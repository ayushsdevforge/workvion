import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd, yyyy');
  } catch { return '—'; }
};

export const getStatusColor = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800', present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong';

export const getMonthRange = (monthStr) => {
  const [y, m] = monthStr.split('-').map(Number);
  const start = startOfMonth(new Date(y, m - 1));
  return { start, end: endOfMonth(start) };
};

export const getWorkingDays = (monthStr) => {
  const { start, end } = getMonthRange(monthStr);
  return eachDayOfInterval({ start, end }).filter((d) => ![0, 6].includes(getDay(d))).length;
};

export const buildCalendarDays = (monthStr, records) => {
  const { start, end } = getMonthRange(monthStr);
  const days = eachDayOfInterval({ start, end });
  const map = {};
  records.forEach((r) => { map[format(parseISO(r.date), 'yyyy-MM-dd')] = r.status; });
  return days.map((d) => ({
    date: d, dateStr: format(d, 'yyyy-MM-dd'), day: format(d, 'd'),
    dayName: format(d, 'EEE'), status: map[format(d, 'yyyy-MM-dd')] || null,
    isWeekend: [0, 6].includes(getDay(d)),
  }));
};

export const computeAttendanceStats = (records, monthStr) => {
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const workingDays = getWorkingDays(monthStr);
  const unmarked = Math.max(0, workingDays - present - absent);
  const percentage = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0;
  return { present, absent, workingDays, unmarked, percentage };
};
