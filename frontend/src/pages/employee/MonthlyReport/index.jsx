import { useState, useEffect, useMemo } from 'react';
import { attendanceAPI } from '@/services/api';
import Card from '@/components/Card';
import CalendarGrid from '@/components/CalendarGrid';
import StatusBadge from '@/components/StatusBadge';
import Loader from '@/components/Loader';
import Table from '@/components/Table';
import { format } from 'date-fns';
import { buildCalendarDays, computeAttendanceStats, getMonthRange, formatDate } from '@/utils/helpers';
import { PageTransition } from '@/components/Motion';
import { STAT_ITEMS, LEGEND } from './data';

const breakdownCols = [
  { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
  { key: 'dayName', label: 'Day' },
  { key: 'status', label: 'Status', render: (r) => r.status ? <StatusBadge status={r.status} /> : <span className="text-gray-400 text-xs">Not marked</span> },
];

const MonthlyReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { start, end } = getMonthRange(month);
        const { data } = await attendanceAPI.getMy({ from: format(start, 'yyyy-MM-dd'), to: format(end, 'yyyy-MM-dd'), limit: 50 });
        setRecords(data.data?.records || []);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, [month]);

  const stats = useMemo(() => computeAttendanceStats(records, month), [records, month]);
  const days = useMemo(() => buildCalendarDays(month, records), [records, month]);
  const [y, m] = month.split('-').map(Number);
  const monthTitle = format(new Date(y, m - 1), 'MMMM yyyy');

  if (loading) return <Loader />;

  return (
    <PageTransition>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-brand-950">Monthly Report</h2>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
          className="px-3 py-2 border border-brand-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STAT_ITEMS(stats).map((s) => (
          <Card key={s.label} className="!p-4 text-center">
            <p className={`text-2xl font-bold ${s.color || 'text-gray-900'}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Monthly Attendance</p>
          <p className="text-sm font-semibold text-brand-600">{stats.percentage}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-brand-500 h-3 rounded-full transition-all duration-500" style={{ width: `${stats.percentage}%` }} />
        </div>
        <div className="flex items-center gap-4 mt-3">
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
              <span className="text-xs text-gray-500">{l.label} ({stats[l.label.toLowerCase()]})</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title={monthTitle}><CalendarGrid days={days} /></Card>
      <Card title="Daily Breakdown"><Table columns={breakdownCols} data={days.filter((d) => !d.isWeekend)} /></Card>
    </div>
    </PageTransition>
  );
};

export default MonthlyReport;
