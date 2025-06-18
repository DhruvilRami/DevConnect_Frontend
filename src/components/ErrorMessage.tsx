import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose, className = '' }) => {
  return (
    <div className={`bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 ${className}`}>
      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
      <p className="text-red-300 flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;