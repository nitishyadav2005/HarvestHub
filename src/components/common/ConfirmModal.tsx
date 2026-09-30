import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Check } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getConfirmButtonClass = () => {
    if (variant === 'danger') {
      return 'px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer';
    }
    if (variant === 'warning') {
      return 'px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer';
    }
    return 'clay-btn-primary text-xs py-2 px-4 cursor-pointer';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-xs text-amber-950 font-medium leading-relaxed pt-1">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-200 transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={getConfirmButtonClass()}
          >
            <Check className="w-3.5 h-3.5" /> {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
