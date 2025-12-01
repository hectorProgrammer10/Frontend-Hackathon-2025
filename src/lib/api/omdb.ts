// OMDb API Service Layer
import { Movie, MovieDetail, SearchResponse, Filters } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

/**
 * Search for movies and series by title
 */
export async function searchMovies(
  query: string,
  filters: Filters = {}
): Promise<SearchResponse> {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY || '',
      s: query,
    });

    if (filters.type) params.append('type', filters.type);
    if (filters.year) params.append('y', filters.year);
    if (filters.page) params.append('page', filters.page.toString());

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    const data: SearchResponse = await response.json();

    if (data.Response === 'False') {
      return {
        Search: [],
        totalResults: '0',
        Response: 'False',
        Error: data.Error || 'No results found',
      };
    }

    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return {
      Search: [],
      totalResults: '0',
      Response: 'False',
      Error: 'Failed to fetch data',
    };
  }
}

/**
 * Get detailed information about a movie or series by IMDb ID
 */
export async function getMovieDetails(id: string): Promise<MovieDetail | null> {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY || '',
      i: id,
      plot: 'full',
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    const data = await response.json();

    if (data.Response === 'False') {
      return null;
    }

    return data as MovieDetail;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

/**
 * Get trending/popular movies (using predetermined popular titles)
 * Note: OMDb doesn't have a trending endpoint, so we search for popular movies
 */
export async function getTrendingMovies(): Promise<Movie[]> {
  const popularTitles = [
    'Inception',
    'The Dark Knight',
    'Interstellar',
    'The Matrix',
    'Pulp Fiction',
    'The Shawshank Redemption',
  ];

  try {
    const promises = popularTitles.map(async (title) => {
      const result = await searchMovies(title, { type: 'movie' });
      return result.Search?.[0] || null;
    });

    const results = await Promise.all(promises);
    return results.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

/**
 * Get popular series
 */
export async function getPopularSeries(): Promise<Movie[]> {
  const popularSeries = [
    'Breaking Bad',
    'Game of Thrones',
    'Stranger Things',
    'The Office',
    'Friends',
    'The Crown',
  ];

  try {
    const promises = popularSeries.map(async (title) => {
      const result = await searchMovies(title, { type: 'series' });
      return result.Search?.[0] || null;
    });

    const results = await Promise.all(promises);
    return results.filter((series): series is Movie => series !== null);
  } catch (error) {
    console.error('Error fetching popular series:', error);
    return [];
  }
}
