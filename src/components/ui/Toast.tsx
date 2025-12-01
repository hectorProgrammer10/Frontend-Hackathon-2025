// Toast Component

'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
        <span className="text-green-400 text-xl">✓</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
