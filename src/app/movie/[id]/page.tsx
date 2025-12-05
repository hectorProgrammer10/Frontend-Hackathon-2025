// Movie/Series Detail Page

'use client';

import { useParams } from 'next/navigation';
import { useMovieDetails, useFavorites } from '@/lib/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/Loading';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import ShareButton from '@/components/features/ShareButton';
import { Circle, Heart, Star, Youtube } from 'lucide-react';

// Lazy load heavy components
const TrailerPlayer = dynamic(() => import('@/components/features/TrailerPlayer'), {
  loading: () => <div className="h-64 bg-card animate-pulse rounded-xl" />,
});
const SimilarMovies = dynamic(() => import('@/components/features/SimilarMovies'), {
  loading: () => <div className="h-64 bg-card animate-pulse rounded-xl" />,
});

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { movie, loading, error } = useMovieDetails(id);
  const { toggleFavorite, isFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error || 'Película no encontrada'} />
      </div>
    );
  }

  const favorite = isFavorite(movie.imdbID);
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-poster.svg';

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </Link>
      </div>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Poster */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20">
                <Image
                  src={posterUrl}
                  alt={movie.Title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(movie)}
                className="w-full mt-6 px-6 py-4 rounded-xl font-bold text-lg
                         bg-gradient-to-r from-purple-500 to-pink-500
                         hover:from-purple-600 hover:to-pink-600
                         text-white transition-all duration-300
                         hover:scale-105 active:scale-95
                         flex items-center justify-center gap-3"
              >
                <span className="text-2xl">{favorite ? <Heart size={20} className='fill-red-600 text-red-600'></Heart> : <Heart size={20}></Heart>}</span>
                {favorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
              </button>

              {/* Share Button */}
              <ShareButton title={movie.Title} />
            </div>
          </div>

          {/* Information */}
          <div className="lg:w-2/3 space-y-8">
            {/* Title & Ratings */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                {movie.Title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-2 rounded-full bg-card text-foreground font-semibold">
                  {movie.Year}
                </span>
                <span className="px-4 py-2 rounded-full bg-card text-foreground font-semibold">
                  {movie.Rated}
                </span>
                <span className="px-4 py-2 rounded-full bg-card text-foreground font-semibold">
                  {movie.Runtime}
                </span>
                <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                  {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
                </span>
              </div>

              {/* IMDb Rating & Metascore */}
              <div className="flex gap-4">
                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                  <div className="px-6 py-3 rounded-xl bg-yellow-500/20 border-2 border-yellow-500/50">
                    <div className="text-sm text-yellow-300 font-semibold mb-1">IMDb</div>
                    <div className="text-2xl font-black text-yellow-400 flex gap-2 items-center">
                      <Star size={20}></Star> {movie.imdbRating}
                    </div>
                  </div>
                )}
                {movie.Metascore && movie.Metascore !== 'N/A' && (
                  <div className="px-6 py-3 rounded-xl bg-green-500/20 border-2 border-green-500/50">
                    <div className="text-sm text-green-300 font-semibold mb-1">Metascore</div>
                    <div className="text-2xl font-black text-green-400 flex gap-2 items-center"><Circle size={20}></Circle> {movie.Metascore}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Plot */}
            <div className="bg-card backdrop-blur-sm rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Plot</h2>
              <p className="text-muted text-lg leading-relaxed">{movie.Plot}</p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-border">
                  <h3 className="text-muted text-sm font-semibold mb-2">Genre</h3>
                  <p className="text-foreground text-lg">{movie.Genre}</p>
                </div>
              )}

              {movie.Director && movie.Director !== 'N/A' && (
                <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-border">
                  <h3 className="text-muted text-sm font-semibold mb-2">Director</h3>
                  <p className="text-foreground text-lg">{movie.Director}</p>
                </div>
              )}

              {movie.Writer && movie.Writer !== 'N/A' && (
                <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-border">
                  <h3 className="text-muted text-sm font-semibold mb-2">Writer</h3>
                  <p className="text-foreground text-lg">{movie.Writer}</p>
                </div>
              )}

              {movie.Actors && movie.Actors !== 'N/A' && (
                <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-border">
                  <h3 className="text-muted text-sm font-semibold mb-2">Cast</h3>
                  <p className="text-foreground text-lg">{movie.Actors}</p>
                </div>
              )}

              {movie.Language && movie.Language !== 'N/A' && (
                <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-border">
                  <h3 className="text-muted text-sm font-semibold mb-2">Language</h3>
                  <p className="text-foreground text-lg">{movie.Language}</p>
                </div>
              )}

              {movie.Country && movie.Country !== 'N/A' && (
                <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-border">
                  <h3 className="text-muted text-sm font-semibold mb-2">Country</h3>
                  <p className="text-foreground text-lg">{movie.Country}</p>
                </div>
              )}

              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-border md:col-span-2">
                  <h3 className="text-muted text-sm font-semibold mb-2">Awards</h3>
                  <p className="text-foreground text-lg">{movie.Awards}</p>
                </div>
              )}
            </div>

            {/* Additional Ratings */}
            {movie.Ratings && movie.Ratings.length > 0 && (
              <div className="bg-card backdrop-blur-sm rounded-2xl p-6 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Other Ratings</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {movie.Ratings.map((rating, index) => (
                    <div key={index} className="text-center p-4 bg-card rounded-xl">
                      <div className="text-muted text-sm mb-1">{rating.Source}</div>
                      <div className="text-foreground text-xl font-bold">{rating.Value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer Section */}
            <div className="space-y-4 z-10">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-3xl"><Youtube size={28}></Youtube></span> Official Trailer
              </h2>
              <TrailerPlayer title={movie.Title} year={movie.Year} />
            </div>

            {/* Similar Movies Section */}
            <div className="pt-8 border-t border-border">
              <SimilarMovies currentId={movie.imdbID} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
