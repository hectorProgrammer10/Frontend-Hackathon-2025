// MovieCard Component

'use client';

import { Movie } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useFavorites } from '@/lib/hooks';
import { Heart } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  variant?: 'grid' | 'list';
}

export default function MovieCard({ movie, variant = 'grid' }: MovieCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const favorite = isFavorite(movie.imdbID);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const posterUrl = !imageError && movie.Poster !== 'N/A'
    ? movie.Poster
    : '/placeholder-poster.svg';

  if (variant === 'list') {
    return (
      <Link href={`/movie/${movie.imdbID}`}>
        <div className="flex gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-3 
                      hover:bg-white/10 transition-all duration-300 
                      border border-white/5 hover:border-purple-500/30
                      group cursor-pointer h-full">
          <div className="relative w-20 sm:w-24 aspect-[2/3] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={posterUrl}
              alt={movie.Title}
              fill
              onError={() => setImageError(true)}
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 80px, 96px"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                {movie.Title}
              </h3>
              <p className="text-white/60 mt-1 text-sm">
                {movie.Year} • <span className="capitalize">{movie.Type}</span>
              </p>
            </div>
            <button
              onClick={handleToggleFavorite}
              className={`self-start px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                        border flex items-center gap-2 mt-2
                        ${favorite
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
            >
              {favorite ? <p className='flex gap-2'><Heart size={16} className='fill-red-600 text-red-600'></Heart>Guardado</p> : <p className='flex gap-2'><Heart size={16}></Heart>Guardar</p>}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/movie/${movie.imdbID}`} className="block h-full">
      <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden
                    border border-white/5 hover:border-purple-500/30
                    transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                    hover:shadow-purple-500/20 cursor-pointer h-full flex flex-col">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={posterUrl}
            alt={movie.Title}
            fill
            onError={() => setImageError(true)}
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 w-10 h-10 rounded-full 
                     bg-black/40 backdrop-blur-md border border-white/10
                     flex items-center justify-center
                     hover:bg-purple-500 hover:border-purple-500 transition-all duration-300
                     opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                     hover:scale-110 active:scale-95 shadow-lg"
          >
            <span className="text-xl leading-none">{favorite ? <Heart size={20} className='text-red-500 fill-red-600'></Heart> : <Heart size={20}></Heart>}</span>
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-white/5 to-transparent">
          <div>
            <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight
                         group-hover:text-purple-400 transition-colors">
              {movie.Title}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <p className="text-white/60 text-sm font-medium">{movie.Year}</p>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider border border-white/5">
              {movie.Type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
