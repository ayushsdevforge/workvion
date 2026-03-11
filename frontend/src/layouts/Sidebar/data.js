import {
  HiOutlineHome, HiOutlineCalendarDays, HiOutlineClock, HiOutlineUsers,
  HiOutlineClipboardDocumentCheck, HiOutlineChartBar, HiOutlineUser,
  HiOutlineDocumentChartBar,
} from 'react-icons/hi2';

export const NAV = {
  employee: [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/leaves', icon: HiOutlineCalendarDays, label: 'Leaves' },
    { to: '/attendance', icon: HiOutlineClock, label: 'Attendance' },
    { to: '/report', icon: HiOutlineDocumentChartBar, label: 'Monthly Report' },
    { to: '/profile', icon: HiOutlineUser, label: 'Profile' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: HiOutlineChartBar, label: 'Dashboard' },
    { to: '/admin/employees', icon: HiOutlineUsers, label: 'Employees' },
    { to: '/admin/leaves', icon: HiOutlineClipboardDocumentCheck, label: 'Leave Approvals' },
    { to: '/admin/attendance', icon: HiOutlineClock, label: 'Attendance' },
    { to: '/admin/report', icon: HiOutlineDocumentChartBar, label: 'Monthly Report' },
  ],
};

export const linkCls = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`;
