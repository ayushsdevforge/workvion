import {
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineChartBarSquare,
  HiOutlineDocumentChartBar,
  HiOutlineUserPlus,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineHandThumbUp,
  HiOutlineClipboardDocumentCheck,
  HiOutlinePresentationChartLine,
} from 'react-icons/hi2';

export const NAV_LINKS = ['Features', 'How it Works'];

export const MARQUEE_ITEMS = [
  { icon: HiOutlineCalendarDays, label: 'Leave Management' },
  { icon: HiOutlineClock, label: 'Attendance Tracking' },
  { icon: HiOutlineShieldCheck, label: 'Admin Controls' },
  { icon: HiOutlineChartBarSquare, label: 'Analytics Dashboard' },
  { icon: HiOutlineDocumentChartBar, label: 'Smart Reports' },
  { icon: HiOutlineClipboardDocumentCheck, label: 'One-Click Actions' },
  { icon: HiOutlinePresentationChartLine, label: 'Team Overview' },
  { icon: HiOutlineHandThumbUp, label: 'Instant Approvals' },
];

export const FEATURES = [
  { icon: HiOutlineCalendarDays, title: 'Apply for Leave', desc: 'Submit leave requests in seconds with an intuitive form and real-time validation.' },
  { icon: HiOutlineClock, title: 'Attendance Tracking', desc: 'One-click daily attendance with detailed monthly calendar views.' },
  { icon: HiOutlineChartBarSquare, title: 'Leave Balance', desc: 'Track your remaining leaves across all categories at a glance.' },
  { icon: HiOutlineShieldCheck, title: 'Admin Panel', desc: 'Full control over employees, leave approvals, and attendance records.' },
  { icon: HiOutlineDocumentChartBar, title: 'Reports & Analytics', desc: 'Generate monthly reports with attendance percentages and leave summaries.' },
  { icon: HiOutlinePresentationChartLine, title: 'Team Overview', desc: "Get a bird's-eye view of your entire team's attendance and status." },
];

export const STEPS = [
  { icon: HiOutlineUserPlus, title: 'Create Account', desc: 'Admin sets up your profile' },
  { icon: HiOutlineArrowRightEndOnRectangle, title: 'Login to Dashboard', desc: 'Access your personalized workspace' },
  { icon: HiOutlineClipboardDocumentCheck, title: 'Mark & Apply', desc: 'Attendance & leave in one click' },
  { icon: HiOutlineHandThumbUp, title: 'Admin Approval', desc: 'Requests reviewed instantly' },
  { icon: HiOutlinePresentationChartLine, title: 'Track History', desc: 'Full analytics at your fingertips' },
];

export const HERO_STATS = [
  ['Attendance', '96%', 'bg-brand-50', 'text-brand-800', 'border-brand-200/60'],
  ['Leaves Left', '14', 'bg-blue-50', 'text-blue-800', 'border-blue-200/60'],
  ['Team Size', '28', 'bg-purple-50', 'text-purple-800', 'border-purple-200/60'],
];

export const HERO_LEAVES = [
  ['Casual Leave', 'Approved', 'bg-green-100 text-green-800'],
  ['Sick Leave', 'Pending', 'bg-yellow-100 text-yellow-800'],
  ['Earned Leave', 'Approved', 'bg-green-100 text-green-800'],
];
