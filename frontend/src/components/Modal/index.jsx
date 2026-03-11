import { useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { MODAL_SIZES } from './data';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-brand-900/10 w-full ${MODAL_SIZES[size]} max-h-[90vh] overflow-y-auto border border-brand-100/50`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-100/40">
          <h2 className="text-lg font-semibold text-brand-950">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiXMark className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
