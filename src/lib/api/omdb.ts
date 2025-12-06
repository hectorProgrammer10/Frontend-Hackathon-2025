// Capa de servicio de API de OMDb (ahora utiliza TMDB como backend)
import { Movie, MovieDetail, SearchResponse, Filters } from '@/types';
import {
  searchTMDB,
  getMovieDetailsTMDB,
  getTVShowDetailsTMDB,
  parseTMDBId,
} from './tmdb';


export async function searchMovies(
  query: string,
  filters: Filters = {}
): Promise<SearchResponse> {
  return searchTMDB(query, filters);
}


export async function getMovieDetails(id: string): Promise<MovieDetail | null> {
  try {
    const tmdbInfo = parseTMDBId(id);

    if (tmdbInfo) {
      if (tmdbInfo.type === 'movie') {
        return await getMovieDetailsTMDB(tmdbInfo.id);
      } else {
        return await getTVShowDetailsTMDB(tmdbInfo.id);
      }
    }

    console.warn('Legacy IMDb ID detected, not supported:', id);
    return null;

  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}


export async function getTrendingMovies(): Promise<Movie[]> {
  const { getTrendingMoviesFromTMDB } = await import('./tmdb');
  return getTrendingMoviesFromTMDB();
}


export async function getPopularSeries(): Promise<Movie[]> {
  const { getPopularSeriesFromTMDB } = await import('./tmdb');
  return getPopularSeriesFromTMDB();
}
