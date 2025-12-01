// Favorites Page

'use client';

import { useFavorites } from '@/lib/hooks';
import MovieCard from '@/components/features/MovieCard';
import { LoadingSpinner, EmptyState } from '@/components/ui/Loading';

export default function FavoritesPage() {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            ❤️ Your Favorites
          </h1>
          <p className="text-xl text-white/70">
            {favorites.length > 0
              ? `You have ${favorites.length} favorite ${favorites.length === 1 ? 'item' : 'items'}`
              : 'Start building your collection'}
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <EmptyState
            title="No Favorites Yet"
            description="Start exploring movies and series to add them to your favorites!"
          />
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
