'use client';

import { useFavorites } from '@/lib/hooks';
import MovieCard from '@/components/features/MovieCard';
import { LoadingSpinner, EmptyState } from '@/components/ui/Loading';
import { Star, Plus } from 'lucide-react';
import Link from 'next/link';

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

        {favorites.length === 0 && (
          <EmptyState
            title="Aún No Tienes Favoritos"
            description="¡Comienza a explorar películas y series para agregarlas a tus favoritos!"
          />
        )}


        {favorites.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}

            <Link href="/search" className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-white/20 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                <Plus size={38} className="text-white/50 group-hover:text-purple-400 transition-colors" />
              </div>
              <span className="text-white/50 font-medium group-hover:text-purple-300 transition-colors">
                Añadir a favoritos
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
