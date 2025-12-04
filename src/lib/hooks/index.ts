// Custom React Hooks

'use client';

import { useState, useEffect } from 'react';
import { Movie, MovieDetail, SearchResponse, Filters } from '@/types';
import { searchMovies, getMovieDetails } from '@/lib/api/omdb';
import { getFavorites, toggleFavorite as toggleFav, isFavorite } from '@/lib/utils/favorites';
import { useToast } from '@/lib/context/ToastContext';

/**
 * Hook for searching movies
 */
export function useMovieSearch() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const search = async (query: string, filters?: Filters) => {
    // Allow search if query is present OR if we have filters (browsing mode)
    const hasFilters = filters && (filters.type || filters.genre || filters.minRating);

    if (!query.trim() && !hasFilters) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(query, filters);
      setResults(data);

      if (data.Response === 'False') {
        let errorMessage = data.Error || 'No se encontraron resultados';

        // Translate common API errors
        if (errorMessage === 'Movie not found!') errorMessage = 'No se encontraron resultados';
        if (errorMessage === 'Too many results.') errorMessage = 'Demasiados resultados, intenta ser más específico';
        if (errorMessage === 'Incorrect IMDb ID.') errorMessage = 'ID de IMDb incorrecto';

        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Error not needed, just catching to set generic error message
    } catch (_err) {
      const errorMessage = 'Error al buscar películas. Por favor intenta de nuevo.';
      setError(errorMessage);
      setResults(null);
      showToast(errorMessage, 'error');
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
  const { showToast } = useToast();

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
          const errorMessage = 'Película no encontrada';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Error not needed, just catching to set generic error message
      } catch (_err) {
        const errorMessage = 'Error al cargar detalles de la película';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, showToast]);

  return { movie, loading, error };
}

/**
 * Hook for managing favorites
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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

    if (newState) {
      showToast(`"${item.Title}" agregado a favoritos`, 'success');
    } else {
      showToast(`"${item.Title}" eliminado de favoritos`, 'info');
    }

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
