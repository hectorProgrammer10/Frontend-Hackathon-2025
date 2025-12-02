// SimilarMovies Component

'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types';
import { getSimilarContentTMDB, parseTMDBId, findTMDBIdFromIMDb } from '@/lib/api/tmdb';
import MovieCard from './MovieCard';
import { LoadingSkeleton } from '@/components/ui/Loading';
import { Clapperboard } from 'lucide-react';

interface SimilarMoviesProps {
  genre: string;
  currentId: string;
}

export default function SimilarMovies({ currentId }: Omit<SimilarMoviesProps, 'genre'>) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      console.log('[SimilarMovies] Fetching for ID:', currentId);

      let tmdbId: number;
      let type: 'movie' | 'series';

      // 1. Try to parse as TMDB ID
      const tmdbInfo = parseTMDBId(currentId);

      if (tmdbInfo) {
        console.log('[SimilarMovies] Parsed TMDB info:', tmdbInfo);
        tmdbId = tmdbInfo.id;
        type = tmdbInfo.type === 'movie' ? 'movie' : 'series';
      } else if (currentId.startsWith('tt')) {
        // 2. If it's an IMDb ID, look it up
        console.log('[SimilarMovies] Detected IMDb ID, looking up in TMDB...');
        const found = await findTMDBIdFromIMDb(currentId);

        if (found) {
          console.log('[SimilarMovies] Found TMDB ID from IMDb:', found);
          tmdbId = found.id;
          type = found.type === 'movie' ? 'movie' : 'series';
        } else {
          console.log('[SimilarMovies] Could not find TMDB ID for IMDb ID:', currentId);
          setLoading(false);
          return;
        }
      } else {
        console.log('[SimilarMovies] Unknown ID format:', currentId);
        setLoading(false);
        return;
      }

      // Use TMDB's similar content endpoint
      const similar = await getSimilarContentTMDB(tmdbId, type);
      console.log('[SimilarMovies] Received similar movies:', similar.length);
      setMovies(similar);
      setLoading(false);
    };

    fetchSimilar();
  }, [currentId]);

  if (loading) return <LoadingSkeleton />;

  if (movies.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <span className="text-3xl"><Clapperboard size={28}></Clapperboard></span> También te podría gustar
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie.imdbID} movie={movie} variant="grid" />
        ))}
      </div>
    </div>
  );
}
