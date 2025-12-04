// Search Results Page

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/features/SearchBar';
import MovieCard from '@/components/features/MovieCard';
import FilterPanel from '@/components/features/FilterPanel';
import Pagination from '@/components/ui/Pagination';
import { LoadingSkeleton, EmptyState, ErrorMessage } from '@/components/ui/Loading';
import { useMovieSearch } from '@/lib/hooks';
import { Filters } from '@/types';
import { Grid2X2, List } from 'lucide-react';

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


  useEffect(() => {
    // Initial search if query OR type is present
    if (initialQuery || initialType) {
      search(initialQuery, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run on mount
  }, []);

  useEffect(() => {
    // Trigger search when filters change, allowing empty query if filters are active
    const hasFilters = filters.type || filters.year;
    if (query || hasFilters || (filters.page || 1) > 1) {
      search(query, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only trigger on specific filter changes
  }, [filters.type, filters.year, filters.page]);

  // Update filtered results when search results change
  useEffect(() => {
    if (results?.Search) {
      setFilteredResults(results.Search);
    } else {
      setFilteredResults([]);
    }
  }, [results]);

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

  const isBrowsing = !query && (filters.type || filters.year);

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
                <p className="text-muted">
                  {isBrowsing ? (
                    <span>Explorando <span className="text-foreground font-bold">{filters.type === 'movie' ? 'Películas' : filters.type === 'series' ? 'Series' : 'Contenido'}</span></span>
                  ) : (
                    <span>Encontrados <span className="text-foreground font-bold">{results.totalResults}</span> resultados {query && ` para "${query}"`}</span>
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                      ? 'bg-purple-500 text-white'
                      : 'bg-card text-muted hover:bg-card/80'
                      }`}
                  >
                    <Grid2X2 size={20}></Grid2X2>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                      ? 'bg-purple-500 text-white'
                      : 'bg-card text-muted hover:bg-card/80'
                      }`}
                  >
                    <List size={20}></List>
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && <LoadingSkeleton />}

            {/* Error State */}
            {error && !loading && <ErrorMessage message={error} />}

            {/* Empty State */}
            {!loading && !error && (!results || !results.Search || results.Search.length === 0) && (query || isBrowsing) && (
              <EmptyState
                title="No se Encontraron Resultados"
                description={`No pudimos encontrar ningún ${filters.type === 'movie' ? 'película' : filters.type === 'series' ? 'serie' : 'contenido'} que coincida con tu búsqueda. Intenta ajustar tus filtros.`}
              />
            )}

            {/* No Search Yet */}
            {!loading && !query && !isBrowsing && !results && (
              <EmptyState
                title="Comienza tu Búsqueda"
                description="Ingresa el título de una película o serie en la barra de búsqueda para comenzar."
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
