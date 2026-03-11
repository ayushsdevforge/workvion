import { useState, useEffect, useCallback } from 'react';
import { leaveAPI } from '@/services/api';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, getErrorMessage } from '@/utils/helpers';
import { STATUS_OPTIONS } from '@/data/constants';
import { useNotifications } from '@/context/NotificationContext';
import toast from 'react-hot-toast';
import { PageTransition } from '@/components/Motion';

const LeaveApprovalPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);
  const { addNotification } = useNotifications();

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await leaveAPI.getAll(params);
      setLeaves(data.data?.leaves || []);
      setTotalPages(data.data?.pages || 1);
    } catch { toast.error('Failed to fetch leaves'); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      const leave = leaves.find((l) => l._id === id);
      const name = leave?.userId?.fullName || 'Employee';
      action === 'approve' ? await leaveAPI.approve(id) : await leaveAPI.reject(id);
      toast.success(`Leave ${action}d`);
      addNotification({ title: `Leave ${action === 'approve' ? 'Approved' : 'Rejected'}`, message: `${name}'s ${leave?.leaveType} (${leave?.totalDays} days)`, type: action === 'approve' ? 'success' : 'warning' });
      addNotification({ title: '📧 Email Sent', message: `Notification sent to ${leave?.userId?.email || name}`, type: 'email' });
      fetchLeaves();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setActionLoading(null); }
  };

  const columns = [
    { key: 'employee', label: 'Employee', render: (r) => (
      <div><p className="font-medium text-gray-900">{r.userId?.fullName}</p><p className="text-xs text-gray-500">{r.userId?.email}</p></div>
    )},
    { key: 'leaveType', label: 'Type' },
    { key: 'startDate', label: 'From', render: (r) => formatDate(r.startDate) },
    { key: 'endDate', label: 'To', render: (r) => formatDate(r.endDate) },
    { key: 'totalDays', label: 'Days' },
    { key: 'reason', label: 'Reason', render: (r) => <span className="max-w-[180px] truncate block">{r.reason}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', render: (r) => r.status === 'pending' && (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => handleAction(r._id, 'approve')} loading={actionLoading === r._id}>Approve</Button>
        <Button size="sm" variant="danger" onClick={() => handleAction(r._id, 'reject')} loading={actionLoading === r._id}>Reject</Button>
      </div>
    )},
  ];

  return (
    <PageTransition>
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-950">Leave Approvals</h2>
      <Card>
        <div className="mb-4">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-brand-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <Table columns={columns} data={leaves} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
    </PageTransition>
  );
};

export default LeaveApprovalPage;
