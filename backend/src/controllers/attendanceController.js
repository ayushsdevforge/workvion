import Attendance from "../models/Attendance.js";

//For Pagination and filtering in attendance listing endpoints
const paginate = (query) => {
  const page  = parseInt(query.page)  || 1;
  const limit = parseInt(query.limit) || 10;
  return { page, limit, skip: (page - 1) * limit };
};



//Build a date filter for attendance queries based on optional "from" and "to" query parameters
const buildDateFilter = (query) => {
  if (!query.from && !query.to) return {};
  const dateFilter = {};
  if (query.from) dateFilter.$gte = new Date(query.from);
  if (query.to) {
    const to = new Date(query.to);
    to.setHours(23, 59, 59, 999); // include the full "to" day
    dateFilter.$lte = to;
  }
  return { date: dateFilter };
};



/* POST /api/attendance – Mark attendance for the day (employee) */
export const markAttendance = async (req, res, next) => {
  try {
    const { date, status } = req.body;

    if (!date || !status) {
      return res.status(400).json({ success: false, message: "Date and status are required" });
    }

    // Don't allow future dates
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (inputDate > today) {
      return res.status(400).json({ success: false, message: "Cannot mark future date" });
    }

    // Check if already marked for this day
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
    const endOfDay   = new Date(inputDate.setHours(23, 59, 59, 999));

    const existing = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: "Attendance already marked for this date" });
    }

    const record = await Attendance.create({ userId: req.user._id, date: startOfDay, status });
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};


/* GET /api/attendance/my – Get own attendance records */ 
export const getOwnAttendance = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = { userId: req.user._id, ...buildDateFilter(req.query) };

    const [records, total] = await Promise.all([
      Attendance.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Attendance.countDocuments(filter),
    ]);

    res.json({ success: true, data: { records, total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};


/* GET /api/attendance/all – View all attendance records (admin) */
export const getAllAttendance = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = { ...buildDateFilter(req.query) };
    if (req.query.userId) filter.userId = req.query.userId;

    const [rawRecords, total] = await Promise.all([
      Attendance.find(filter)
        .populate("userId", "fullName email")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments(filter),
    ]);

    const records = rawRecords.filter((r) => r.userId != null);

    res.json({ success: true, data: { records, total: records.length, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};
