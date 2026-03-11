export const cellStyle = (day) =>
  day.isWeekend ? 'bg-gray-50 border-gray-100 text-gray-400'
  : day.status === 'present' ? 'bg-green-50 border-green-200 text-green-700'
  : day.status === 'absent' ? 'bg-red-50 border-red-200 text-red-700'
  : 'bg-white border-gray-100 text-gray-500';
