import { useState, useEffect, useCallback } from 'react';
import { attendanceAPI, userAPI } from '@/services/api';
import Card from '@/components/Card';
import Table from '@/components/Table';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';
import { PageTransition } from '@/components/Motion';
import { INPUT_CLS } from './data';

const AdminAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userAPI.getAll({ limit: 100 }).then(({ data }) => setUsers(data.data?.users || [])).catch(() => {});
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      if (selectedUser) params.userId = selectedUser;
      const { data } = await attendanceAPI.getAll(params);
      setRecords(data.data?.records || []);
      setTotalPages(data.data?.pages || 1);
    } catch { toast.error('Failed to fetch attendance'); }
    finally { setLoading(false); }
  }, [page, dateFrom, dateTo, selectedUser]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const columns = [
    { key: 'employee', label: 'Employee', render: (r) => (
      <div><p className="font-medium text-gray-900">{r.userId?.fullName}</p><p className="text-xs text-gray-500">{r.userId?.email}</p></div>
    )},
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <PageTransition>
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-950">All Attendance</h2>
      <Card>
        <div className="flex flex-wrap gap-3 mb-4">
          <div><label className="block text-xs text-gray-500 mb-1">Employee</label>
            <select value={selectedUser} onChange={(e) => { setSelectedUser(e.target.value); setPage(1); }} className={INPUT_CLS}>
              <option value="">All Employees</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.fullName}</option>)}
            </select></div>
          <div><label className="block text-xs text-gray-500 mb-1">From</label>
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className={INPUT_CLS} /></div>
          <div><label className="block text-xs text-gray-500 mb-1">To</label>
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className={INPUT_CLS} /></div>
        </div>
        <Table columns={columns} data={records} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
    </PageTransition>
  );
};

export default AdminAttendancePage;
