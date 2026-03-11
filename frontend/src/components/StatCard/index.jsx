import { COLOR_MAP } from './data';

const StatCard = ({ icon: Icon, label, value, color = 'brand' }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-brand-100/50 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${COLOR_MAP[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
