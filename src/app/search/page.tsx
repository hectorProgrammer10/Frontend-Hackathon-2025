// Search Results Page

'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/features/SearchBar';
import MovieCard from '@/components/features/MovieCard';
import FilterPanel from '@/components/features/FilterPanel';
import Pagination from '@/components/ui/Pagination';
import { LoadingSkeleton, EmptyState, ErrorMessage } from '@/components/ui/Loading';
import { useMovieSearch } from '@/lib/hooks';
import { Filters } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') as 'movie' | 'series' | 'episode' | '' || '';

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({
    type: initialType,
    page: 1,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredResults, setFilteredResults] = useState<import('@/types').Movie[]>([]);

  const { results, loading, error, search } = useMovieSearch();

  // Use ref to track if we're currently filtering to avoid race conditions
  const isFilteringRef = useRef(false);

  useEffect(() => {
    if (initialQuery) {
      search(initialQuery, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run on mount with initial query
  }, [initialQuery]);

  useEffect(() => {
    if (query) {
      search(query, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only trigger on specific filter changes
  }, [filters.type, filters.year, filters.page]);

  // Client-side filtering effect - properly handling async operations
  useEffect(() => {
    if (!results?.Search) {
      setFilteredResults([]);
      return;
    }

    // Note: OMDb search endpoint doesn't return Genre or Rating, 
    // so we can't truly filter client-side without fetching details for EACH movie.
    // Since fetching details for 10 movies would be slow and hit API limits,
    // we acknowledge this limitation but implement it to fulfill requirements.

    const applyFilters = async () => {
      // Prevent race conditions
      if (isFilteringRef.current) return;
      isFilteringRef.current = true;

      try {
        if (!filters.genre && !filters.minRating) {
          setFilteredResults(results.Search);
          return;
        }

        // We need to fetch details for these movies to filter them
        // This is a heavy operation but necessary for the requirement
        const detailedMovies = await Promise.all(
          results.Search.map(async (movie) => {
            try {
              const res = await fetch(`https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${movie.imdbID}`);
              return await res.json();
            } catch {
              return movie;
            }
          })
        );

        const finalFiltered = detailedMovies.filter(movie => {
          let pass = true;

          if (filters.genre && movie.Genre) {
            pass = pass && movie.Genre.includes(filters.genre);
          }

          if (filters.minRating && movie.imdbRating && movie.imdbRating !== 'N/A') {
            pass = pass && parseFloat(movie.imdbRating) >= filters.minRating;
          }

          return pass;
        });

        // Map back to basic movie type for display
        setFilteredResults(finalFiltered.map(m => ({
          imdbID: m.imdbID,
          Title: m.Title,
          Year: m.Year,
          Type: m.Type,
          Poster: m.Poster
        })));
      } finally {
        isFilteringRef.current = false;
      }
    };

    applyFilters();
  }, [results, filters.genre, filters.minRating]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setFilters({ ...filters, page: 1 });
    search(newQuery, { ...filters, page: 1 });
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar initialQuery={query} onSearch={handleSearch} />
        </div>

        {/* Results Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Toggle & Results Count */}
            {results && results.Search && results.Search.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-white/70">
                  Found <span className="text-white font-bold">{results.totalResults}</span> results
                  {query && ` for "${query}"`}
                  {(filters.genre || filters.minRating) && (
                    <span className="ml-2 text-purple-400 text-sm">
                      (Showing {filteredResults?.length} after filters)
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && <LoadingSkeleton />}

            {/* Error State */}
            {error && !loading && <ErrorMessage message={error} />}

            {/* Empty State */}
            {!loading && !error && (!results || !results.Search || results.Search.length === 0) && query && (
              <EmptyState
                title="No Results Found"
                description={`We couldn't find any ${filters.type || 'content'} matching "${query}". Try adjusting your search or filters.`}
              />
            )}

            {/* No Search Yet */}
            {!loading && !query && (
              <EmptyState
                title="Start Your Search"
                description="Enter a movie or series title in the search bar above to get started."
              />
            )}

            {/* Results Grid/List */}
            {!loading && filteredResults && filteredResults.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredResults.map((movie) => (
                      <MovieCard key={movie.imdbID} movie={movie} variant="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredResults.map((movie) => (
                      <MovieCard key={movie.imdbID} movie={movie} variant="list" />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={filters.page || 1}
                  totalResults={parseInt(results?.totalResults || '0')}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
