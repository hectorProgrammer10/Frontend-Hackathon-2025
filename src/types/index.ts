

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
}

export interface MovieDetail extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface Filters {
  type?: 'movie' | 'series' | 'episode' | '';
  year?: string;
  page?: number;
  genre?: string;
  minRating?: number;
}

export interface FavoriteItem {
  imdbID: string;
  Title: string;
  Year: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
  addedAt: number;
}

// TMDB API Types
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// TMDB Detail Types
export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TMDBMovieDetail {
  id: number;
  imdb_id: string | null;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: TMDBGenre[];
  production_companies: TMDBProductionCompany[];
  adult: boolean;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  original_language: string;
}

export interface TMDBTVShowDetail {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: TMDBGenre[];
  production_companies: TMDBProductionCompany[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  tagline: string | null;
  original_language: string;
  episode_run_time: number[];
}


export interface TMDBMultiSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity: number;
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
}

