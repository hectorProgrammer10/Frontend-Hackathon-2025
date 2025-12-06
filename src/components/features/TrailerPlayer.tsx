'use client';

import { useState, useEffect } from 'react';

interface TrailerPlayerProps {
  title: string;
  year: string;
}

export default function TrailerPlayer({ title, year }: TrailerPlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrailer = async () => {
      setLoading(true);
      try {
        const query = encodeURIComponent(`${title} ${year} official trailer`);
        const response = await fetch(`/api/trailer?q=${query}`);
        if (response.ok) {
          const data = await response.json();
          setVideoId(data.videoId);
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [title, year]);

  if (loading) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const searchQuery = encodeURIComponent(`${title} ${year} official trailer`);
  const src = videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : `https://www.youtube.com/embed?listType=search&list=${searchQuery}`;

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10 bg-black z-50 relative">
      <iframe
        width="100%"
        height="100%"
        src={src}
        title={`${title} Trailer`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
