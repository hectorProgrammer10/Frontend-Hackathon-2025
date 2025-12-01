// Movie and Series type definitions for OMDb API

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
