// TrailerPlayer Component

'use client';

interface TrailerPlayerProps {
  title: string;
  year: string;
}

export default function TrailerPlayer({ title, year }: TrailerPlayerProps) {
  // Construct a search query for YouTube embed
  // Note: This uses the 'listType=search' parameter which is supported by YouTube embeds
  const searchQuery = encodeURIComponent(`${title} ${year} official trailer`);

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10 bg-black">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed?listType=search&list=${searchQuery}`}
        title={`${title} Trailer`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
