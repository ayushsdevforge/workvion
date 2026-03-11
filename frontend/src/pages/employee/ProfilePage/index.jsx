import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
import { PageTransition } from '@/components/Motion';
import { formatDate } from '@/utils/helpers';
import {
  HiOutlineEnvelope,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineCalendarDays,
  HiOutlineClock,
} from 'react-icons/hi2';

const ProfilePage = () => {
  const { user } = useAuth();

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const memberSince = user?.dateOfJoining
    ? new Date(user.dateOfJoining).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  const details = [
    { icon: HiOutlineEnvelope, label: 'Email Address', value: user?.email },
    { icon: HiOutlineShieldCheck, label: 'Role', value: user?.role, capitalize: true },
    { icon: HiOutlineCalendar, label: 'Date of Joining', value: formatDate(user?.dateOfJoining) },
  ];

  const leaveStats = [
    { icon: HiOutlineCalendarDays, label: 'Leave Balance', value: `${user?.leaveBalance ?? 0} days`, color: 'bg-brand-50 text-brand-700 border-brand-200/60' },
    { icon: HiOutlineClock, label: 'Member Since', value: memberSince, color: 'bg-blue-50 text-blue-700 border-blue-200/60' },
  ];

  return (
    <PageTransition>
      <div className="max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-brand-950">Profile</h2>

        {/* Header Card — avatar + name */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-brand-700 to-brand-900 rounded-t-2xl" />
          <div className="relative pt-12 flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-3xl font-bold text-brand-700">{initials}</span>
            </div>
            <div className="text-center sm:text-left pb-1">
              <h3 className="text-xl font-bold text-brand-950">{user?.fullName}</h3>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {leaveStats.map((s) => (
            <div key={s.label} className={`flex items-center gap-4 p-5 rounded-2xl border ${s.color}`}>
              <div className="p-3 rounded-xl bg-white/60">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium opacity-70">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Details Card */}
        <Card title="Personal Information">
          <div className="divide-y divide-gray-100">
            {details.map((item) => (
              <div key={item.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="p-2.5 bg-brand-50 rounded-xl">
                  <item.icon className="h-5 w-5 text-brand-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                  <p className={`text-sm font-semibold text-gray-900 truncate ${item.capitalize ? 'capitalize' : ''}`}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
