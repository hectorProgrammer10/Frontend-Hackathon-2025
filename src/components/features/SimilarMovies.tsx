// SimilarMovies Component

'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types';
import { searchMovies } from '@/lib/api/omdb';
import MovieCard from './MovieCard';
import { LoadingSkeleton } from '@/components/ui/Loading';

interface SimilarMoviesProps {
  genre: string;
  currentId: string;
}

export default function SimilarMovies({ genre, currentId }: SimilarMoviesProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      // Use the first genre to find similar content
      const mainGenre = genre.split(',')[0].trim();
      if (!mainGenre || mainGenre === 'N/A') {
        setLoading(false);
        return;
      }

      const result = await searchMovies(mainGenre, { type: 'movie' });

      if (result.Search) {
        // Filter out the current movie and limit to 6 results
        const filtered = result.Search
          .filter(m => m.imdbID !== currentId)
          .slice(0, 6);
        setMovies(filtered);
      }
      setLoading(false);
    };

    fetchSimilar();
  }, [genre, currentId]);

  if (loading) return <LoadingSkeleton />;

  if (movies.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <span className="text-3xl">🎬</span> You Might Also Like
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie.imdbID} movie={movie} variant="grid" />
        ))}
      </div>
    </div>
  );
}
