'use client';

import { useToast } from '@/lib/context/ToastContext';
import { Link } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text?: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const { showToast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title,
      text: text || `Mira ${title} en MovieDB`,
      url,
    };

    // Pruebe primero la función de compartir nativa (móvil)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast('¡Enlace copiado al portapapeles!', 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Error al copiar el enlace', 'error');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full mt-4 px-6 py-4 rounded-xl font-bold text-lg
               bg-white/10 hover:bg-white/20 border border-white/10
               text-white transition-all duration-300
               hover:scale-105 active:scale-95
               flex items-center justify-center gap-3"
    >
      <span className="text-2xl"><Link size={20}></Link></span>
      Compartir
    </button>
  );
}
