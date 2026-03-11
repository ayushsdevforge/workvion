import { HiOutlineCalendarDays, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

export const STAT_CARDS = [
  { key: 'leaveBalance', icon: HiOutlineCalendarDays, label: 'Leave Balance', color: 'brand' },
  { key: 'pending', icon: HiOutlineClock, label: 'Pending Leaves', color: 'yellow' },
  { key: 'approved', icon: HiOutlineCheckCircle, label: 'Approved', color: 'brand' },
  { key: 'rejected', icon: HiOutlineXCircle, label: 'Rejected', color: 'red' },
];
