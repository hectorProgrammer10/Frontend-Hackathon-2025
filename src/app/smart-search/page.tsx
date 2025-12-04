'use client';

import { useState } from 'react';
import { getSmartRecommendations } from '@/app/actions/smartSearch';
import { searchTMDB } from '@/lib/api/tmdb';
import MovieCard from '@/components/features/MovieCard';
import { Movie } from '@/types';
import { Sparkles, Loader2 } from 'lucide-react';
import { ThemeContextType, useTheme } from '@/lib/context/ThemeContext';

export default function SmartSearchPage() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [error, setError] = useState('');

  const theme: ThemeContextType = useTheme();

  const handleSearch = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      // 1. Get recommendations from Gemini
      const titles = await getSmartRecommendations(description);

      if (titles.length === 0) {
        setError('No se pudieron generar recomendaciones. Intenta con otra descripción.');
        setIsLoading(false);
        return;
      }

      // 2. Search for each title in TMDB
      const moviePromises = titles.map(async (title) => {
        const searchResult = await searchTMDB(title);
        // Return the first result if found
        return searchResult.Search && searchResult.Search.length > 0 ? searchResult.Search[0] : null;
      });

      const movies = await Promise.all(moviePromises);

      // Filter out nulls
      const validMovies = movies.filter((movie): movie is Movie => movie !== null);

      setResults(validMovies);

      if (validMovies.length === 0) {
        setError('Se encontraron títulos pero no se pudieron localizar en la base de datos.');
      }

    } catch (err) {
      console.error('Smart search error:', err);
      setError('Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-purple-600/20 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Búsqueda Inteligente
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Describe qué tipo de película o serie quieres ver y nuestra IA te recomendará las mejores opciones.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className={`relative ${theme.theme === 'dark' ? 'bg-black/50' : 'bg-white/50'} backdrop-blur-xl rounded-2xl p-2 border border-white/10`}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Quiero ver una película de ciencia ficción sobre viajes en el tiempo con un final triste..."
              className={`w-full bg-transparent ${theme.theme === 'dark' ? 'text-white' : 'text-black'} p-4 text-lg focus:outline-none resize-none h-32 placeholder-gray-500`}
            />
            <div className="flex justify-end px-2 pb-2">
              <button
                onClick={handleSearch}
                disabled={isLoading || !description.trim()}
                className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Pensando...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Buscar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-4 text-red-400 text-center bg-red-900/20 p-3 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {results.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
