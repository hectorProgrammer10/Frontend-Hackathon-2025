// ShareButton Component

'use client';

import { useState } from 'react';
import Toast from '@/components/ui/Toast';

interface ShareButtonProps {
  title: string;
  text?: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title,
      text: text || `Check out ${title} on MovieDB`,
      url,
    };

    // Try native share first (Mobile)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log('Error sharing:', err);
        // Fallback to clipboard if user cancels or error occurs
      }
    }

    // Fallback to Clipboard (Desktop)
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="w-full mt-4 px-6 py-4 rounded-xl font-bold text-lg
                 bg-white/10 hover:bg-white/20 border border-white/10
                 text-white transition-all duration-300
                 hover:scale-105 active:scale-95
                 flex items-center justify-center gap-3"
      >
        <span className="text-2xl">🔗</span>
        Share Movie
      </button>

      <Toast
        message="Link copied to clipboard!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
