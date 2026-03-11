import { HiOutlineCalendarDays, HiOutlineClock, HiOutlineShieldCheck } from 'react-icons/hi2';

export const LANDING_FEATURES = [
  { icon: HiOutlineCalendarDays, title: 'Leave Management', desc: 'Apply, track and manage leaves with a seamless workflow.' },
  { icon: HiOutlineClock, title: 'Attendance Tracking', desc: 'Mark daily attendance and view detailed history.' },
  { icon: HiOutlineShieldCheck, title: 'Admin Controls', desc: 'Approve leaves, monitor attendance, and manage employees.' },
];

export const LEAVE_TYPES = [
  'Casual Leave', 'Sick Leave', 'Earned Leave',
  'Maternity Leave', 'Paternity Leave', 'Unpaid Leave',
];

export const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export const NOTIFICATION_ICONS = {
  success: '✅', info: 'ℹ️', warning: '⚠️', error: '❌', email: '📧',
};

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
