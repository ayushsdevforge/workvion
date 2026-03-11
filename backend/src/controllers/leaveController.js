import Leave from "../models/Leave.js";
import User from "../models/User.js";

// Calculate the number of days between two dates 
const calcDays = (start, end) => {
  const ms = new Date(end) - new Date(start);
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1;
  return days > 0 ? days : 0;
};


const paginate = (query) => {
  const page  = parseInt(query.page)  || 1;
  const limit = parseInt(query.limit) || 10;
  return { page, limit, skip: (page - 1) * limit };
};



  /** POST /api/leaves – Apply for leave */
export const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ success: false, message: "End date must be after start date" });
    }

    const totalDays = calcDays(startDate, endDate);
    const user = await User.findById(req.user._id);

    // Check if enough leave balance
    if (user.leaveBalance < totalDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. You have ${user.leaveBalance} days remaining`,
      });
    }

    const leave = await Leave.create({
      userId: req.user._id, leaveType, startDate, endDate, totalDays, reason,
    });

    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};

/** GET /api/leaves/my – Get own leave requests (with optional status filter) */  
export const getOwnLeaves = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = { userId: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const [leaves, total] = await Promise.all([
      Leave.find(filter).sort({ appliedDate: -1 }).skip(skip).limit(limit),
      Leave.countDocuments(filter),
    ]);

    res.json({ success: true, data: { leaves, total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/leaves/:id – Edit a pending leave */
export const editLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findOne({ _id: req.params.id, userId: req.user._id });
    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });
    if (leave.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending leaves can be edited" });
    }

    // Update only the fields that were sent
    const { leaveType, startDate, endDate, reason } = req.body;
    if (leaveType) leave.leaveType = leaveType;
    if (startDate) leave.startDate = startDate;
    if (endDate)   leave.endDate   = endDate;
    if (reason)    leave.reason    = reason;
    leave.totalDays = calcDays(leave.startDate, leave.endDate);

    await leave.save();
    res.json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/leaves/:id – Cancel a pending leave */
export const cancelLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findOne({ _id: req.params.id, userId: req.user._id });
    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });
    if (leave.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending leaves can be cancelled" });
    }

    await Leave.deleteOne({ _id: leave._id });
    res.json({ success: true, message: "Leave cancelled" });
  } catch (err) {
    next(err);
  }
};



/** GET /api/leaves/all – View all leave requests (with filters) */
export const getAllLeaves = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.userId) filter.userId = req.query.userId;

    const [rawLeaves, total] = await Promise.all([
      Leave.find(filter)
        .populate("userId", "fullName email")
        .sort({ appliedDate: -1 })
        .skip(skip)
        .limit(limit),
      Leave.countDocuments(filter),
    ]);

    const leaves = rawLeaves.filter((l) => l.userId != null);

    res.json({ success: true, data: { leaves, total: leaves.length, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/leaves/:id/approve – Approve a pending leave & deduct balance */
export const approveLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });
    if (leave.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending leaves can be approved" });
    }

    const user = await User.findById(leave.userId);
    if (user.leaveBalance < leave.totalDays) {
      return res.status(400).json({ success: false, message: "Employee has insufficient leave balance" });
    }

    // Deduct balance and mark approved
    user.leaveBalance -= leave.totalDays;
    leave.status = "approved";
    await Promise.all([user.save(), leave.save()]);

    res.json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/leaves/:id/reject – Reject a pending leave */
export const rejectLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });
    if (leave.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending leaves can be rejected" });
    }

    leave.status = "rejected";
    await leave.save();
    res.json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};
