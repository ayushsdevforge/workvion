import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { leaveAPI, attendanceAPI } from '@/services/api';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import Loader from '@/components/Loader';
import { formatDate } from '@/utils/helpers';
import { PageTransition } from '@/components/Motion';
import { STAT_CARDS } from './data';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([leaveAPI.getMyLeaves({ limit: 5 }), attendanceAPI.getMy({ limit: 5 })])
      .then(([lRes, aRes]) => {
        const leaves = lRes.data.data?.leaves || [];
        setRecentLeaves(leaves);
        setRecentAttendance(aRes.data.data?.records || []);
        setStats({
          pending: leaves.filter((l) => l.status === 'pending').length,
          approved: leaves.filter((l) => l.status === 'approved').length,
          rejected: leaves.filter((l) => l.status === 'rejected').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const ListItem = ({ left, right }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">{left}{right}</div>
  );

  return (
    <PageTransition>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-950">Welcome back, {user?.fullName?.split(' ')[0]} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your account.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((c) => (
          <StatCard key={c.key} icon={c.icon} label={c.label} value={{ leaveBalance: user?.leaveBalance ?? 0, ...stats }[c.key]} color={c.color} />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Recent Leaves">
          {recentLeaves.length === 0 ? <p className="text-sm text-gray-500">No leave requests yet.</p> : (
            <div className="space-y-3">
              {recentLeaves.map((l) => (
                <ListItem key={l._id}
                  left={<div><p className="text-sm font-medium text-gray-900">{l.leaveType}</p><p className="text-xs text-gray-500">{formatDate(l.startDate)} — {formatDate(l.endDate)}</p></div>}
                  right={<StatusBadge status={l.status} />} />
              ))}
            </div>
          )}
        </Card>
        <Card title="Recent Attendance">
          {recentAttendance.length === 0 ? <p className="text-sm text-gray-500">No attendance records yet.</p> : (
            <div className="space-y-3">
              {recentAttendance.map((r) => (
                <ListItem key={r._id}
                  left={<p className="text-sm text-gray-700">{formatDate(r.date)}</p>}
                  right={<StatusBadge status={r.status} />} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
    </PageTransition>
  );
};

export default EmployeeDashboard;
