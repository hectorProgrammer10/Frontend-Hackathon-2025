// Favorites Page

'use client';

import { useFavorites } from '@/lib/hooks';
import MovieCard from '@/components/features/MovieCard';
import { LoadingSpinner, EmptyState } from '@/components/ui/Loading';
import { Star } from 'lucide-react';

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
          <h1 className="text-4xl md:text-5xl font-black text-yellow-300 mb-4">
            <Star size={32} className="inline mr-2 text-yellow-300" /> Tus Favoritos
          </h1>
          <p className="text-xl text-yellow-300">
            {favorites.length > 0
              ? `Tienes ${favorites.length} ${favorites.length === 1 ? 'favorito' : 'favoritos'}`
              : 'Comienza a crear tu colección'}
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <EmptyState
            title="Aún No Tienes Favoritos"
            description="¡Comienza a explorar películas y series para agregarlas a tus favoritos!"
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
