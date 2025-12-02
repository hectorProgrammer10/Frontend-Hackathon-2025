// OMDb API Service Layer (Now using TMDB as backend)
import { Movie, MovieDetail, SearchResponse, Filters } from '@/types';
import {
  searchTMDB,
  getMovieDetailsTMDB,
  getTVShowDetailsTMDB,
  parseTMDBId,
} from './tmdb';

/**
 * Search for movies and series by title (now using TMDB)
 */
export async function searchMovies(
  query: string,
  filters: Filters = {}
): Promise<SearchResponse> {
  // Delegate to TMDB search
  return searchTMDB(query, filters);
}

/**
 * Get detailed information about a movie or series by ID
 * Supports both TMDB IDs (tmdb-movie-123, tmdb-tv-456) and legacy IMDb IDs
 */
export async function getMovieDetails(id: string): Promise<MovieDetail | null> {
  try {
    // Check if it's a TMDB ID
    const tmdbInfo = parseTMDBId(id);

    if (tmdbInfo) {
      // It's a TMDB ID, fetch from TMDB
      if (tmdbInfo.type === 'movie') {
        return await getMovieDetailsTMDB(tmdbInfo.id);
      } else {
        return await getTVShowDetailsTMDB(tmdbInfo.id);
      }
    }

    // Legacy IMDb ID - we don't support this anymore
    // Could add TMDB's find endpoint here if needed
    console.warn('Legacy IMDb ID detected, not supported:', id);
    return null;

  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

/**
 * Get trending/popular movies from TMDB
 * Using TMDB API for real trending data
 */
export async function getTrendingMovies(): Promise<Movie[]> {
  // Import TMDB service dynamically to avoid circular dependencies
  const { getTrendingMoviesFromTMDB } = await import('./tmdb');
  return getTrendingMoviesFromTMDB();
}

/**
 * Get popular series from TMDB
 * Using TMDB API for real popular TV shows data
 */
export async function getPopularSeries(): Promise<Movie[]> {
  // Import TMDB service dynamically to avoid circular dependencies
  const { getPopularSeriesFromTMDB } = await import('./tmdb');
  return getPopularSeriesFromTMDB();
}
