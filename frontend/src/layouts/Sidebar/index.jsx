import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { NAV, linkCls } from './data';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const links = NAV[user?.role] || NAV.employee;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-5 py-4 border-b border-gray-200">
          <img src="/trackdesk.png.png" alt="TrackDesk" className="h-12 object-contain" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {user?.role === 'admin' ? 'Admin' : 'Menu'}
          </p>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls} onClick={onClose}>
              <l.icon className="h-5 w-5" />{l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="h-8 w-8 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-brand-700 font-semibold text-sm">{user?.fullName?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600">
            <HiOutlineArrowRightOnRectangle className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
