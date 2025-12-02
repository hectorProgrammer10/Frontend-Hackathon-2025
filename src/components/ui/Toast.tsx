'use client';

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for animation
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 shadow-green-500/10';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 shadow-red-500/10';
      default:
        return 'bg-blue-500/10 border-blue-500/20 shadow-blue-500/10';
    }
  };

  return (
    <div
      className={`
        flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl
        transition-all duration-300 ease-out w-full md:w-auto md:min-w-[320px] max-w-md
        ${getStyles()}
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0 animate-slideIn'}
      `}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 pt-0.5">
        <p className="text-white font-medium leading-relaxed">
          {message}
        </p>
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  );
}

