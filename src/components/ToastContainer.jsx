import React from 'react';
import { useCafe } from '../context/CafeContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useCafe();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="toast-icon toast-icon-success" />;
      case 'warning':
        return <AlertTriangle size={16} className="toast-icon toast-icon-warning" />;
      case 'error':
        return <AlertCircle size={16} className="toast-icon toast-icon-error" />;
      default:
        return <Info size={16} className="toast-icon toast-icon-info" />;
    }
  };

  return (
    <div className="toast-container no-print" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          <div className="toast-body">
            {getIcon(toast.type)}
            <span className="toast-text">{toast.message}</span>
          </div>
          <button
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
