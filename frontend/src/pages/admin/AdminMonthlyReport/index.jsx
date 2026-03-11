import { useState, useEffect, useMemo } from 'react';
import { attendanceAPI, userAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import { format } from 'date-fns';
import { getMonthRange, getWorkingDays } from '@/utils/helpers';
import { HiOutlineDocumentArrowDown } from 'react-icons/hi2';
import { PageTransition } from '@/components/Motion';

const AdminMonthlyReport = () => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    userAPI.getAll({ limit: 100 }).then(({ data }) => setUsers(data.data?.users || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const { start, end } = getMonthRange(month);
    const params = { from: format(start, 'yyyy-MM-dd'), to: format(end, 'yyyy-MM-dd'), limit: 500 };
    if (selectedUser) params.userId = selectedUser;
    attendanceAPI.getAll(params).then(({ data }) => setRecords(data.data?.records || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, [month, selectedUser]);

  const workingDays = useMemo(() => getWorkingDays(month), [month]);

  const userReports = useMemo(() => {
    const grouped = {};
    records.forEach((r) => {
      if (!r.userId) return;
      const uid = r.userId._id || r.userId;
      if (!grouped[uid]) grouped[uid] = { name: r.userId?.fullName, email: r.userId?.email || '', present: 0, absent: 0 };
      if (r.status === 'present') grouped[uid].present++;
      if (r.status === 'absent') grouped[uid].absent++;
    });
    return Object.entries(grouped).map(([id, d]) => ({
      id, ...d, workingDays, unmarked: Math.max(0, workingDays - d.present - d.absent),
      percentage: workingDays > 0 ? Math.round((d.present / workingDays) * 100) : 0,
    }));
  }, [records, workingDays]);

  const totalPresent = records.filter((r) => r.status === 'present').length;
  const totalAbsent = records.filter((r) => r.status === 'absent').length;
  const avgPct = userReports.length > 0 ? Math.round(userReports.reduce((a, b) => a + b.percentage, 0) / userReports.length) : 0;

  const stats = [
    { value: userReports.length, label: 'Employees' }, { value: workingDays, label: 'Working Days' },
    { value: totalPresent, label: 'Total Present', color: 'text-green-600' },
    { value: totalAbsent, label: 'Total Absent', color: 'text-red-600' },
    { value: `${avgPct}%`, label: 'Avg Attendance', color: 'text-brand-600' },
  ];

  const exportCSV = () => {
    const rows = [['Employee', 'Email', 'Present', 'Absent', 'Unmarked', 'Working Days', 'Attendance %'],
      ...userReports.map((u) => [u.name, u.email, u.present, u.absent, u.unmarked, u.workingDays, u.percentage + '%'])];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: `attendance-report-${month}.csv` }).click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader />;

  return (
    <PageTransition>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-brand-950">Monthly Attendance Report</h2>
        <div className="flex flex-wrap items-center gap-3">
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-2 border border-brand-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All Employees</option>
            {users.map((u) => <option key={u._id} value={u._id}>{u.fullName}</option>)}
          </select>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 border border-brand-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <HiOutlineDocumentArrowDown className="h-4 w-4 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="!p-4 text-center">
            <p className={`text-2xl font-bold ${s.color || 'text-gray-900'}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card title="Employee Breakdown">
        {userReports.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No attendance data for this month.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Employee', 'Present', 'Absent', 'Unmarked', 'Attendance'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userReports.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{u.present}</span></td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{u.absent}</span></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-400">{u.unmarked}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${u.percentage >= 75 ? 'bg-green-500' : u.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${u.percentage}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{u.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
    </PageTransition>
  );
};

export default AdminMonthlyReport;
