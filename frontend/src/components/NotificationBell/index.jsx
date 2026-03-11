import { useState, useRef, useEffect } from 'react';
import { HiBell, HiXMark, HiCheck, HiTrash } from 'react-icons/hi2';
import { useNotifications } from '@/context/NotificationContext';
import { NOTIFICATION_ICONS } from '@/data/constants';
import { timeAgo } from './data';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-gray-100">
        <HiBell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl border border-brand-100/50 shadow-2xl shadow-brand-900/10 z-50 max-h-[70vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-100/40">
            <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && <button onClick={markAllAsRead} className="p-1.5 rounded-lg hover:bg-gray-100" title="Mark all read"><HiCheck className="h-4 w-4 text-gray-500" /></button>}
              {notifications.length > 0 && <button onClick={clearAll} className="p-1.5 rounded-lg hover:bg-gray-100" title="Clear all"><HiTrash className="h-4 w-4 text-gray-500" /></button>}
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><HiXMark className="h-4 w-4 text-gray-500" /></button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <HiBell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : notifications.map((n) => (
              <div key={n.id} onClick={() => markAsRead(n.id)}
                className={`px-4 py-3 border-b border-brand-50 cursor-pointer hover:bg-brand-50/40 ${!n.read ? 'bg-brand-50/60' : ''}`}>
                <div className="flex gap-3">
                  <span className="text-base mt-0.5">{NOTIFICATION_ICONS[n.type] || NOTIFICATION_ICONS.info}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</p>
                      {!n.read && <span className="h-1.5 w-1.5 bg-brand-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
