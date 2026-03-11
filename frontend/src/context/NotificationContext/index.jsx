import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  });

  const save = (items) => {
    setNotifications(items);
    localStorage.setItem('notifications', JSON.stringify(items));
  };

  const addNotification = useCallback(({ title, message, type = 'info' }) => {
    const newNotif = {
      id: Date.now().toString(),
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev].slice(0, 50);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    save([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};
