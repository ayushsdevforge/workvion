import { useState, useEffect } from 'react';
import { userAPI, leaveAPI, attendanceAPI } from '@/services/api';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/utils/helpers';
import { PageTransition } from '@/components/Motion';
import { STAT_CARDS } from './data';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, pendingLeaves: 0, totalAttendance: 0, totalLeaves: 0 });
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, leavesRes, attendanceRes] = await Promise.all([
          userAPI.getAll({ limit: 1 }),
          leaveAPI.getAll({ status: 'pending', limit: 5 }),
          attendanceAPI.getAll({ limit: 1 }),
        ]);

        setStats({
          totalUsers: usersRes.data.data?.total || 0,
          pendingLeaves: leavesRes.data.data?.total || 0,
          totalAttendance: attendanceRes.data.data?.total || 0,
          totalLeaves: leavesRes.data.data?.total || 0,
        });

        setPendingLeaves(leavesRes.data.data?.leaves || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-950">Admin Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Overview of all employees and their activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((c) => (
          <StatCard key={c.key} icon={c.icon} label={c.label} value={stats[c.key]} color={c.color} />
        ))}
      </div>

      <Card title="Pending Leave Requests">
        {pendingLeaves.length === 0 ? (
          <p className="text-sm text-gray-500">No pending leave requests.</p>
        ) : (
          <div className="space-y-3">
            {pendingLeaves.map((leave) => (
              <div key={leave._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {leave.userId?.fullName} — {leave.leaveType}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(leave.startDate)} to {formatDate(leave.endDate)} · {leave.totalDays} day(s)
                  </p>
                </div>
                <StatusBadge status={leave.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
    </PageTransition>
  );
};

export default AdminDashboard;
