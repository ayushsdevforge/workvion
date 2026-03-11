import {
  HiOutlineUsers, HiOutlineClipboardDocumentCheck,
  HiOutlineClock, HiOutlineExclamationCircle,
} from 'react-icons/hi2';

export const STAT_CARDS = [
  { key: 'totalUsers', icon: HiOutlineUsers, label: 'Total Employees', color: 'blue' },
  { key: 'pendingLeaves', icon: HiOutlineExclamationCircle, label: 'Pending Leaves', color: 'yellow' },
  { key: 'totalLeaves', icon: HiOutlineClipboardDocumentCheck, label: 'Total Leave Requests', color: 'purple' },
  { key: 'totalAttendance', icon: HiOutlineClock, label: 'Attendance Records', color: 'brand' },
];
