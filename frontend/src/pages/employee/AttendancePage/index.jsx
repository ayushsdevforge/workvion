import { useState, useEffect, useCallback } from 'react';
import { attendanceAPI } from '@/services/api';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, getErrorMessage } from '@/utils/helpers';
import { useNotifications } from '@/context/NotificationContext';
import toast from 'react-hot-toast';
import { HiPlus } from 'react-icons/hi2';
import { PageTransition } from '@/components/Motion';
import { today, INPUT_CLS } from './data';

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ date: today(), status: 'present' });
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { addNotification } = useNotifications();

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      const { data } = await attendanceAPI.getMy(params);
      setRecords(data.data?.records || []);
      setTotalPages(data.data?.pages || 1);
    } catch { toast.error('Failed to fetch attendance'); }
    finally { setLoading(false); }
  }, [page, dateFrom, dateTo]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const handleMark = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await attendanceAPI.mark(form);
      toast.success('Attendance marked');
      addNotification({ title: 'Attendance Marked', message: `Marked as ${form.status} for ${form.date}`, type: 'success' });
      setShowModal(false); setForm({ date: today(), status: 'present' }); fetchAttendance();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSubmitting(false); }
  };

  const columns = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <PageTransition>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-950">My Attendance</h2>
        <Button onClick={() => setShowModal(true)}><HiPlus className="h-4 w-4 mr-1.5" /> Mark Attendance</Button>
      </div>
      <Card>
        <div className="flex flex-wrap gap-3 mb-4">
          <div><label className="block text-xs text-gray-500 mb-1">From</label>
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className={INPUT_CLS} /></div>
          <div><label className="block text-xs text-gray-500 mb-1">To</label>
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className={INPUT_CLS} /></div>
        </div>
        <Table columns={columns} data={records} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Mark Attendance">
        <form onSubmit={handleMark} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} max={today()} className={`w-full ${INPUT_CLS}`} required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`w-full ${INPUT_CLS}`}>
              <option value="present">Present</option><option value="absent">Absent</option></select></div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Mark</Button>
          </div>
        </form>
      </Modal>
    </div>
    </PageTransition>
  );
};

export default AttendancePage;
