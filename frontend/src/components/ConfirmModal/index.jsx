import Modal from '@/components/Modal';
import Button from '@/components/Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', loading, danger }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-gray-600 text-sm">{message}</p>
    <div className="flex justify-end gap-3 pt-6">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} loading={loading}
        className={danger ? '!bg-red-600 hover:!bg-red-700 focus:!ring-red-500' : ''}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmModal;
