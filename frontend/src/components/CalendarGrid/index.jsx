import StatusBadge from '@/components/StatusBadge';
import { WEEKDAYS } from '@/data/constants';
import { cellStyle } from './data';

const CalendarGrid = ({ days }) => {
  const offset = days[0]?.date.getDay() || 0;

  return (
    <div className="grid grid-cols-7 gap-2">
      {WEEKDAYS.map((d) => (
        <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
      ))}
      {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
      {days.map((day) => (
        <div key={day.dateStr} className={`rounded-lg p-2 text-center text-sm border transition-colors ${cellStyle(day)}`}>
          <p className="font-medium">{day.day}</p>
          <p className="text-[10px] mt-0.5">
            {day.isWeekend ? 'Off' : day.status ? <StatusBadge status={day.status} /> : '—'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
