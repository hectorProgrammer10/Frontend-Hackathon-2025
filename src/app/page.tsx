// Home Page

'use client';

import { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/features/SearchBar';
import MovieCard from '@/components/features/MovieCard';
import { LoadingSkeleton } from '@/components/ui/Loading';
import { Movie } from '@/types';
import { getTrendingMovies, getPopularSeries } from '@/lib/api/omdb';
import { TrendingUp, Tv } from 'lucide-react';
import PaperBackground from '@/components/ui/PaperBackground';



export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularSeries, setPopularSeries] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    try {
      const [movies, series] = await Promise.all([
        getTrendingMovies(),
        getPopularSeries(),
      ]);
      setTrendingMovies(movies);
      setPopularSeries(series);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return (
    <div className="min-h-screen pb-20">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 lg:pt-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <PaperBackground
          id="papelFondo"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 lg:py-32 lg:mt-3 relative z-10 opacity-88 hover:opacity-100 transition-opacity duration-300 rounded-3xl"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%) ',
            maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
          }}
        >
          <div className="text-center space-y-6 md:space-y-8 animate-fadeIn p-6 rounded-xl pointer-events-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-purple-400 to-foreground bg-clip-text text-transparent drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                Descubre Increíbles
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                Películas y Series
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted font-bold max-w-2xl mx-auto leading-relaxed text-black">
              Explora millones de películas y series de TV. Encuentra tu próxima historia favorita hoy.
            </p>
            <div className="max-w-2xl mx-auto mt-8 md:mt-12">
              <div>
                <SearchBar placeholder="Buscar películas, series o episodios..." />
              </div>
            </div>
          </div>
        </PaperBackground>

      </section>

      {/* Quick Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
          {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance'].map((genre) => (
            <a
              key={genre}
              href={`/search?q=${genre}&type=movie`}
              className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-card backdrop-blur-sm
                       border border-border text-muted font-medium text-sm md:text-base
                       hover:bg-card/80 hover:border-purple-500/50 hover:text-foreground
                       transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {genre}
            </a>
          ))}
        </div>
      </section>

      {/* Trending Movies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <span className="text-3xl md:text-4xl"><TrendingUp size={28}></TrendingUp></span> Películas en Tendencia
          </h2>
          <a
            href="/search?type=movie"
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors text-sm md:text-base"
          >
            Ver todas →
          </a>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Series */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <span className="text-3xl md:text-4xl"><Tv size={28}></Tv></span> Series Populares
          </h2>
          <a
            href="/search?type=series"
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors text-sm md:text-base"
          >
            Ver todas →
          </a>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {popularSeries.map((series) => (
              <MovieCard key={series.imdbID} movie={series} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
