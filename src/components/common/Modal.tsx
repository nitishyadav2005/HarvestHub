import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/40 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full ${widthClasses[maxWidth]} clay-card p-4 sm:p-6 md:p-8 max-h-[92vh] overflow-y-auto relative border border-emerald-100 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-emerald-100">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1b4332] flex items-center gap-2 truncate">
              {title}
            </h2>
            {subtitle && <p className="text-xs md:text-sm text-emerald-700/80 mt-1 break-words">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-emerald-800 hover:bg-emerald-100/60 rounded-full transition-colors shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
