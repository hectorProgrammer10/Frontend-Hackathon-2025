// TMDB API Service Layer
import {
  Movie,
  MovieDetail,
  TMDBMovie,
  TMDBTVShow,
  TMDBResponse,
  TMDBMovieDetail,
  TMDBTVShowDetail,
  TMDBMultiSearchResult,
  Filters,
  SearchResponse
} from '@/types';

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// TMDB Genre ID mapping
const GENRE_MAP: { [key: string]: number } = {
  'Action': 28,
  'Adventure': 12,
  'Animation': 16,
  'Comedy': 35,
  'Crime': 80,
  'Documentary': 99,
  'Drama': 18,
  'Family': 10751,
  'Fantasy': 14,
  'History': 36,
  'Horror': 27,
  'Music': 10402,
  'Mystery': 9648,
  'Romance': 10749,
  'Science Fiction': 878,
  'Sci-Fi': 878,
  'TV Movie': 10770,
  'Thriller': 53,
  'War': 10752,
  'Western': 37,
};

/**
 * Fetch trending movies from TMDB
 * Using the /trending/movie/week endpoint
 */
export async function getTrendingMoviesFromTMDB(): Promise<Movie[]> {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('TMDB API error:', response.status, response.statusText);
      return [];
    }

    const data: TMDBResponse<TMDBMovie> = await response.json();

    // Convert TMDB movies to our Movie format and limit to 10 results
    return data.results.slice(0, 10).map(convertTMDBMovieToMovie);
  } catch (error) {
    console.error('Error fetching trending movies from TMDB:', error);
    return [];
  }
}

/**
 * Fetch popular TV series from TMDB
 * Using the /tv/popular endpoint
 */
export async function getPopularSeriesFromTMDB(): Promise<Movie[]> {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('TMDB API error:', response.status, response.statusText);
      return [];
    }

    const data: TMDBResponse<TMDBTVShow> = await response.json();

    // Convert TMDB TV shows to our Movie format and limit to 10 results
    return data.results.slice(0, 10).map(convertTMDBTVShowToMovie);
  } catch (error) {
    console.error('Error fetching popular series from TMDB:', error);
    return [];
  }
}

/**
 * Search for movies and TV shows using TMDB multi-search
 * Uses discover endpoint ONLY when browsing (no query) for better performance
 * When query is present, uses search/multi and filters in-memory to ensure accurate total counts
 */
export async function searchTMDB(query: string, filters: Filters = {}): Promise<SearchResponse> {
  try {
    // 1. BROWSING MODE: No query, just filters -> Use /discover
    if (!query.trim() && (filters.genre || filters.minRating || filters.type)) {
      return await discoverWithFilters(query, filters);
    }

    // 2. SEARCH MODE: Query present -> Use /search/multi
    const params = new URLSearchParams({
      query: query,
      page: (filters.page || 1).toString(),
    });

    const response = await fetch(`${BASE_URL}/search/multi?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        Search: [],
        totalResults: '0',
        Response: 'False',
        Error: 'Failed to search',
      };
    }

    const data: TMDBResponse<TMDBMultiSearchResult> = await response.json();

    // Filter and convert results
    let results = data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(convertMultiSearchResultToMovie);

    // Apply in-memory filtering for search results
    // This is necessary because /search/multi doesn't support complex filters
    // and /discover doesn't support text search.
    if (filters.genre || filters.minRating || filters.type) {
      // We need to filter based on the raw data before conversion if possible, 
      // but our convert function drops genre_ids.
      // However, we can fetch details if needed, or rely on what we have.
      // TMDB search results DO include genre_ids and vote_average.

      const rawFiltered = data.results.filter(item => {
        if (item.media_type !== 'movie' && item.media_type !== 'tv') return false;

        let pass = true;

        // Filter by Type
        if (filters.type) {
          const itemType = item.media_type === 'movie' ? 'movie' : 'series';
          if (itemType !== filters.type) pass = false;
        }

        // Filter by Genre
        if (filters.genre && pass) {
          const normalizedGenre = filters.genre.charAt(0).toUpperCase() + filters.genre.slice(1).toLowerCase();
          const targetGenreId = GENRE_MAP[normalizedGenre] || GENRE_MAP[filters.genre];
          if (targetGenreId && item.genre_ids) {
            pass = item.genre_ids.includes(targetGenreId);
          }
        }

        // Filter by Rating
        if (filters.minRating && pass) {
          if (item.vote_average) {
            pass = item.vote_average >= filters.minRating;
          } else {
            pass = false;
          }
        }

        return pass;
      });

      results = rawFiltered.map(convertMultiSearchResultToMovie);

      // Update total results to reflect the filtered count on this page
      // Note: This is an approximation. We can't know the total filtered count across all pages
      // without fetching them all. But showing the count of matches on this page 
      // is better than showing the global total.
      // Ideally, we'd say "Found X results on this page".
      // For now, we'll just return the length of filtered results if it's small, 
      // or keep the original if we didn't filter anything.

      if (results.length < data.results.length) {
        // If we filtered out items, the total count from API is misleading for the user.
        // We'll set it to the number of results we found on this page, 
        // effectively "hiding" pages that might have matches but we can't see.
        // This is a trade-off for not having a true search+filter API.
        return {
          Search: results,
          totalResults: results.length.toString(),
          Response: 'True'
        };
      }
    }

    return {
      Search: results,
      totalResults: data.total_results.toString(),
      Response: 'True',
    };
  } catch (error) {
    console.error('Error searching TMDB:', error);
    return {
      Search: [],
      totalResults: '0',
      Response: 'False',
      Error: 'Failed to fetch data',
    };
  }
}

/**
 * Discover movies/TV with filters using TMDB discover endpoint
 */
async function discoverWithFilters(query: string, filters: Filters): Promise<SearchResponse> {
  try {
    const isMovie = !filters.type || filters.type === 'movie';
    const isSeries = !filters.type || filters.type === 'series';

    const promises: Promise<TMDBResponse<TMDBMovie> | TMDBResponse<TMDBTVShow>>[] = [];

    // Build discover parameters
    const buildParams = (type: 'movie' | 'tv') => {
      const params = new URLSearchParams({
        page: (filters.page || 1).toString(),
      });

      // Add genre filter
      if (filters.genre) {
        // Normalize genre to Title Case to match map keys (e.g. "action" -> "Action")
        const normalizedGenre = filters.genre.charAt(0).toUpperCase() + filters.genre.slice(1).toLowerCase();
        const genreId = GENRE_MAP[normalizedGenre] || GENRE_MAP[filters.genre];

        if (genreId) {
          params.append('with_genres', genreId.toString());
        }
      }

      // Add rating filter
      if (filters.minRating) {
        params.append('vote_average.gte', filters.minRating.toString());
        params.append('vote_count.gte', '100'); // Minimum votes for reliability
      }

      return params;
    };

    // Fetch movies if needed
    if (isMovie) {
      const params = buildParams('movie');
      promises.push(
        fetch(`${BASE_URL}/discover/movie?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }).then(r => r.json())
      );
    }

    // Fetch TV shows if needed
    if (isSeries) {
      const params = buildParams('tv');
      promises.push(
        fetch(`${BASE_URL}/discover/tv?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }).then(r => r.json())
      );
    }

    const responses = await Promise.all(promises);

    // Combine and convert results
    let allResults: Movie[] = [];
    let totalResults = 0;

    responses.forEach((data, index) => {
      // Determine if this response is movie or tv
      // If we fetched both, index 0 is movie, 1 is tv
      // If we fetched only one, check isMovie/isSeries flags
      let isMovieData = false;
      if (isMovie && isSeries) {
        isMovieData = index === 0;
      } else if (isMovie) {
        isMovieData = true;
      }

      const converted = data.results.map((item: TMDBMovie | TMDBTVShow) => {
        if (isMovieData || 'title' in item) {
          return convertTMDBMovieToMovie(item as TMDBMovie);
        } else {
          return convertTMDBTVShowToMovie(item as TMDBTVShow);
        }
      });
      allResults = allResults.concat(converted);
      totalResults += data.total_results;
    });

    // Filter by query text if provided (client-side filtering of discovered results)
    // Note: TMDB discover doesn't support text query + filters easily without advanced search
    // So we discover by filters first, then filter by title if needed
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      allResults = allResults.filter(movie =>
        movie.Title.toLowerCase().includes(lowerQuery)
      );
    }

    return {
      Search: allResults,
      totalResults: totalResults.toString(),
      Response: 'True',
    };
  } catch (error) {
    console.error('Error in discover with filters:', error);
    return {
      Search: [],
      totalResults: '0',
      Response: 'False',
      Error: 'Failed to fetch data',
    };
  }
}

/**
 * Get detailed information about a movie from TMDB
 */
export async function getMovieDetailsTMDB(tmdbId: number): Promise<MovieDetail | null> {
  try {
    const response = await fetch(`${BASE_URL}/movie/${tmdbId}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: TMDBMovieDetail = await response.json();
    return convertTMDBMovieDetailToMovieDetail(data);
  } catch (error) {
    console.error('Error fetching movie details from TMDB:', error);
    return null;
  }
}

/**
 * Get detailed information about a TV show from TMDB
 */
export async function getTVShowDetailsTMDB(tmdbId: number): Promise<MovieDetail | null> {
  try {
    const response = await fetch(`${BASE_URL}/tv/${tmdbId}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: TMDBTVShowDetail = await response.json();
    return convertTMDBTVShowDetailToMovieDetail(data);
  } catch (error) {
    console.error('Error fetching TV show details from TMDB:', error);
    return null;
  }
}

/**
 * Get similar movies or TV shows
 */
export async function getSimilarContentTMDB(tmdbId: number, type: 'movie' | 'series'): Promise<Movie[]> {
  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const response = await fetch(`${BASE_URL}/${endpoint}/${tmdbId}/similar`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: TMDBResponse<TMDBMovie | TMDBTVShow> = await response.json();

    return data.results.slice(0, 6).map(item => {
      if ('title' in item) {
        return convertTMDBMovieToMovie(item as TMDBMovie);
      } else {
        return convertTMDBTVShowToMovie(item as TMDBTVShow);
      }
    });
  } catch (error) {
    console.error('Error fetching similar content from TMDB:', error);
    return [];
  }
}

/**
 * Extract TMDB ID and type from our custom ID format
 * Format: tmdb-movie-123 or tmdb-tv-456
 */
export function parseTMDBId(customId: string): { id: number; type: 'movie' | 'tv' } | null {
  const match = customId.match(/^tmdb-(movie|tv)-(\d+)$/);
  if (!match) return null;

  return {
    type: match[1] as 'movie' | 'tv',
    id: parseInt(match[2], 10),
  };
}

/**
 * Find TMDB ID from IMDb ID
 */
export async function findTMDBIdFromIMDb(imdbId: string): Promise<{ id: number; type: 'movie' | 'tv' } | null> {
  try {
    const response = await fetch(`${BASE_URL}/find/${imdbId}?external_source=imdb_id`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (data.movie_results && data.movie_results.length > 0) {
      return { id: data.movie_results[0].id, type: 'movie' };
    }

    if (data.tv_results && data.tv_results.length > 0) {
      return { id: data.tv_results[0].id, type: 'tv' };
    }

    return null;
  } catch (error) {
    console.error('Error finding TMDB ID from IMDb:', error);
    return null;
  }
}

// ==== CONVERSION UTILITIES ====

/**
 * Convert TMDB movie format to our app's Movie interface
 */
function convertTMDBMovieToMovie(tmdbMovie: TMDBMovie): Movie {
  return {
    imdbID: `tmdb-movie-${tmdbMovie.id}`,
    Title: tmdbMovie.title,
    Year: tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : 'N/A',
    Type: 'movie',
    Poster: tmdbMovie.poster_path
      ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Poster',
  };
}

/**
 * Convert TMDB TV show format to our app's Movie interface
 */
function convertTMDBTVShowToMovie(tmdbShow: TMDBTVShow): Movie {
  return {
    imdbID: `tmdb-tv-${tmdbShow.id}`,
    Title: tmdbShow.name,
    Year: tmdbShow.first_air_date ? tmdbShow.first_air_date.split('-')[0] : 'N/A',
    Type: 'series',
    Poster: tmdbShow.poster_path
      ? `${IMAGE_BASE_URL}${tmdbShow.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Poster',
  };
}

/**
 * Convert TMDB multi-search result to our app's Movie interface
 */
function convertMultiSearchResultToMovie(result: TMDBMultiSearchResult): Movie {
  const isMovie = result.media_type === 'movie';

  return {
    imdbID: `tmdb-${result.media_type}-${result.id}`,
    Title: isMovie ? (result.title || '') : (result.name || ''),
    Year: isMovie
      ? (result.release_date ? result.release_date.split('-')[0] : 'N/A')
      : (result.first_air_date ? result.first_air_date.split('-')[0] : 'N/A'),
    Type: isMovie ? 'movie' : 'series',
    Poster: result.poster_path
      ? `${IMAGE_BASE_URL}${result.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Poster',
  };
}

/**
 * Convert TMDB movie detail to our app's MovieDetail interface
 */
function convertTMDBMovieDetailToMovieDetail(tmdb: TMDBMovieDetail): MovieDetail {
  return {
    // ALWAYS use our custom ID format for internal routing/consistency
    // We ignore the actual IMDb ID for the ID field to ensure favorites/links work consistently
    imdbID: `tmdb-movie-${tmdb.id}`,
    Title: tmdb.title,
    Year: tmdb.release_date ? tmdb.release_date.split('-')[0] : 'N/A',
    Type: 'movie',
    Poster: tmdb.poster_path
      ? `${IMAGE_BASE_URL}${tmdb.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Poster',
    Rated: 'N/A',
    Released: tmdb.release_date || 'N/A',
    Runtime: tmdb.runtime ? `${tmdb.runtime} min` : 'N/A',
    Genre: tmdb.genres.map(g => g.name).join(', '),
    Director: 'N/A',
    Writer: 'N/A',
    Actors: 'N/A',
    Plot: tmdb.overview || 'No plot available',
    Language: tmdb.original_language.toUpperCase(),
    Country: 'N/A',
    Awards: 'N/A',
    Ratings: [
      {
        Source: 'TMDB',
        Value: `${tmdb.vote_average.toFixed(1)}/10`,
      },
    ],
    Metascore: 'N/A',
    imdbRating: tmdb.vote_average.toFixed(1),
    imdbVotes: tmdb.vote_count.toLocaleString(),
    Response: 'True',
  };
}

/**
 * Convert TMDB TV show detail to our app's MovieDetail interface
 */
function convertTMDBTVShowDetailToMovieDetail(tmdb: TMDBTVShowDetail): MovieDetail {
  return {
    imdbID: `tmdb-tv-${tmdb.id}`,
    Title: tmdb.name,
    Year: tmdb.first_air_date ? tmdb.first_air_date.split('-')[0] : 'N/A',
    Type: 'series',
    Poster: tmdb.poster_path
      ? `${IMAGE_BASE_URL}${tmdb.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Poster',
    Rated: 'N/A',
    Released: tmdb.first_air_date || 'N/A',
    Runtime: tmdb.episode_run_time.length > 0 ? `${tmdb.episode_run_time[0]} min` : 'N/A',
    Genre: tmdb.genres.map(g => g.name).join(', '),
    Director: 'N/A',
    Writer: 'N/A',
    Actors: 'N/A',
    Plot: tmdb.overview || 'No plot available',
    Language: tmdb.original_language.toUpperCase(),
    Country: 'N/A',
    Awards: 'N/A',
    Ratings: [
      {
        Source: 'TMDB',
        Value: `${tmdb.vote_average.toFixed(1)}/10`,
      },
    ],
    Metascore: 'N/A',
    imdbRating: tmdb.vote_average.toFixed(1),
    imdbVotes: tmdb.vote_count.toLocaleString(),
    Response: 'True',
  };
}
