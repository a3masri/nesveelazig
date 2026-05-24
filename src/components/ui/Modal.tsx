import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  /** Center dialog or bottom sheet on mobile */
  variant?: 'center' | 'sheet';
};

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  variant = 'center',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isSheet = variant === 'sheet';

  return (
    <div
      className={`fixed inset-0 z-[100] flex p-0 sm:p-4 ${isSheet ? 'items-end sm:items-center justify-center' : 'items-center justify-center p-4'}`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in" aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative w-full outline-none ${maxWidth} ${isSheet ? 'modal-sheet' : 'rounded-2xl'} p-5 sm:p-6 ${isSheet ? 'animate-slide-up sm:animate-bounce-in' : 'animate-bounce-in'} max-h-[92vh] overflow-y-auto overscroll-contain`}
        style={{
          background: 'var(--bg-card)',
          border: '2px solid var(--border-accent)',
          boxShadow: 'var(--shadow-premium)',
        }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2
              id="modal-title"
              className="font-display text-lg font-bold uppercase pr-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl hover:bg-cr-gold/10 transition-colors flex items-center justify-center flex-shrink-0"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        )}
        {!title && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2.5 min-w-[44px] min-h-[44px] rounded-xl hover:bg-cr-gold/10 flex items-center justify-center z-10"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
