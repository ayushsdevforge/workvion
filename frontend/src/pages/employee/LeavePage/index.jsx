import { useState, useEffect, useCallback } from 'react';
import { leaveAPI } from '@/services/api';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import LeaveForm from '@/components/LeaveForm';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, getErrorMessage } from '@/utils/helpers';
import { STATUS_OPTIONS } from '@/data/constants';
import { useNotifications } from '@/context/NotificationContext';
import toast from 'react-hot-toast';
import { HiPlus } from 'react-icons/hi2';
import { PageTransition } from '@/components/Motion';
import { DEFAULT_FORM } from './data';

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const { addNotification } = useNotifications();

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await leaveAPI.getMyLeaves(params);
      setLeaves(data.data?.leaves || []);
      setTotalPages(data.data?.pages || 1);
    } catch { toast.error('Failed to fetch leaves'); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leaveAPI.apply(form);
      toast.success('Leave applied successfully');
      addNotification({ title: 'Leave Applied', message: `Your ${form.leaveType} request has been submitted`, type: 'info' });
      addNotification({ title: '📧 Email Sent', message: 'Leave request notification sent to admin', type: 'email' });
      setShowModal(false); setForm(DEFAULT_FORM); setPage(1); fetchLeaves();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSubmitting(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this leave request?')) return;
    try { await leaveAPI.cancel(id); toast.success('Leave cancelled'); fetchLeaves(); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  const columns = [
    { key: 'leaveType', label: 'Type' },
    { key: 'startDate', label: 'From', render: (r) => formatDate(r.startDate) },
    { key: 'endDate', label: 'To', render: (r) => formatDate(r.endDate) },
    { key: 'totalDays', label: 'Days' },
    { key: 'reason', label: 'Reason', render: (r) => <span className="max-w-[200px] truncate block">{r.reason}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', render: (r) => r.status === 'pending' && (
      <Button variant="ghost" size="sm" onClick={() => handleCancel(r._id)}>Cancel</Button>
    )},
  ];

  return (
    <PageTransition>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-950">My Leaves</h2>
        <Button onClick={() => setShowModal(true)}><HiPlus className="h-4 w-4 mr-1.5" /> Apply Leave</Button>
      </div>
      <Card>
        <div className="mb-4">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-brand-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <Table columns={columns} data={leaves} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Apply for Leave">
        <LeaveForm form={form} setForm={setForm} onSubmit={handleApply} onCancel={() => setShowModal(false)} loading={submitting} />
      </Modal>
    </div>
    </PageTransition>
  );
};

export default LeavePage;
