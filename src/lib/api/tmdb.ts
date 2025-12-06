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
 * Uso del /trending/movie/week endpoint
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

    // Convierte películas TMDB a formato de película y limita a 10 resultados
    return data.results.slice(0, 10).map(convertTMDBMovieToMovie);
  } catch (error) {
    console.error('Error fetching trending movies from TMDB:', error);
    return [];
  }
}


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

    return data.results.slice(0, 10).map(convertTMDBTVShowToMovie);
  } catch (error) {
    console.error('Error fetching popular series from TMDB:', error);
    return [];
  }
}


export async function searchTMDB(query: string, filters: Filters = {}): Promise<SearchResponse> {
  try {
    // 1. modo busqueda: No query, solo filtros -> Use /discover
    if (!query.trim() && (filters.genre || filters.minRating || filters.type)) {
      return await discoverWithFilters(query, filters);
    }

    // 2. Query presente -> Use /search/multi
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

    // Filtro y convertir resultados
    let results = data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(convertMultiSearchResultToMovie);

    // Aplicar filtrado en memoria para los resultados de búsqueda
    // Esto es necesario porque /search/multi no admite filtros complejos
    // y /discover no admite la búsqueda de texto.
    if (filters.genre || filters.minRating || filters.type) {


      const rawFiltered = data.results.filter(item => {
        if (item.media_type !== 'movie' && item.media_type !== 'tv') return false;

        let pass = true;

        // Filter Type
        if (filters.type) {
          const itemType = item.media_type === 'movie' ? 'movie' : 'series';
          if (itemType !== filters.type) pass = false;
        }

        // Filter Genre
        if (filters.genre && pass) {
          const normalizedGenre = filters.genre.charAt(0).toUpperCase() + filters.genre.slice(1).toLowerCase();
          const targetGenreId = GENRE_MAP[normalizedGenre] || GENRE_MAP[filters.genre];
          if (targetGenreId && item.genre_ids) {
            pass = item.genre_ids.includes(targetGenreId);
          }
        }

        // Filter Rating
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


      if (results.length < data.results.length) {

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
 * Discover movies/TV 
 */
async function discoverWithFilters(query: string, filters: Filters): Promise<SearchResponse> {
  try {
    const isMovie = !filters.type || filters.type === 'movie';
    const isSeries = !filters.type || filters.type === 'series';

    const promises: Promise<TMDBResponse<TMDBMovie> | TMDBResponse<TMDBTVShow>>[] = [];

    // discover parameters
    const buildParams = () => {
      const params = new URLSearchParams({
        page: (filters.page || 1).toString(),
      });

      // genre filter
      if (filters.genre) {
        // Normalize genre to Title Case to match map keys (e.g. "action" -> "Action")
        const normalizedGenre = filters.genre.charAt(0).toUpperCase() + filters.genre.slice(1).toLowerCase();
        const genreId = GENRE_MAP[normalizedGenre] || GENRE_MAP[filters.genre];

        if (genreId) {
          params.append('with_genres', genreId.toString());
        }
      }

      // rating filter
      if (filters.minRating) {
        params.append('vote_average.gte', filters.minRating.toString());
        params.append('vote_count.gte', '100'); // Minimum votes for reliability
      }

      return params;
    };

    // Obtener películas si es necesario
    if (isMovie) {
      const params = buildParams();
      promises.push(
        fetch(`${BASE_URL}/discover/movie?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }).then(r => r.json())
      );
    }

    if (isSeries) {
      const params = buildParams();
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

    // Combina y convierte resultados
    let allResults: Movie[] = [];
    let totalResults = 0;

    responses.forEach((data, index) => {
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


export function parseTMDBId(customId: string): { id: number; type: 'movie' | 'tv' } | null {
  const match = customId.match(/^tmdb-(movie|tv)-(\d+)$/);
  if (!match) return null;

  return {
    type: match[1] as 'movie' | 'tv',
    id: parseInt(match[2], 10),
  };
}


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

//  UTILIDADES DE CONVERSIÓN 


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


function convertTMDBMovieDetailToMovieDetail(tmdb: TMDBMovieDetail): MovieDetail {
  return {
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
