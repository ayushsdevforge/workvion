export const STAT_ITEMS = (s) => [
  { value: s.workingDays, label: 'Working Days' },
  { value: s.present, label: 'Present', color: 'text-green-600' },
  { value: s.absent, label: 'Absent', color: 'text-red-600' },
  { value: s.unmarked, label: 'Unmarked', color: 'text-gray-400' },
  { value: `${s.percentage}%`, label: 'Attendance Rate', color: 'text-brand-600' },
];

export const LEGEND = [
  { color: 'bg-green-500', label: 'Present' },
  { color: 'bg-red-500', label: 'Absent' },
  { color: 'bg-gray-300', label: 'Unmarked' },
];
