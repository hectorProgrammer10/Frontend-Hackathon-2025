// Custom React Hooks

'use client';

import { useState, useEffect } from 'react';
import { Movie, MovieDetail, SearchResponse, Filters } from '@/types';
import { searchMovies, getMovieDetails } from '@/lib/api/omdb';
import { getFavorites, toggleFavorite as toggleFav, isFavorite } from '@/lib/utils/favorites';

/**
 * Hook for searching movies
 */
export function useMovieSearch() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, filters?: Filters) => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(query, filters);
      setResults(data);

      if (data.Response === 'False') {
        setError(data.Error || 'No results found');
      }
    } catch (err) {
      setError('Failed to search movies');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}

/**
 * Hook for fetching movie details
 */
export function useMovieDetails(id: string | null) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMovieDetails(id);
        if (data) {
          setMovie(data);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  return { movie, loading, error };
}

/**
 * Hook for managing favorites
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      const favs = getFavorites();
      setFavorites(favs);
      setLoading(false);
    };

    loadFavorites();

    // Listen for storage changes from other tabs
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleFavorite = (item: Movie) => {
    const newState = toggleFav(item);
    setFavorites(getFavorites());
    return newState;
  };

  const checkIsFavorite = (imdbID: string) => {
    return isFavorite(imdbID);
  };

  const refreshFavorites = () => {
    setFavorites(getFavorites());
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite: checkIsFavorite,
    refreshFavorites
  };
}
