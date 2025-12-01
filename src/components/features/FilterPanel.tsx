// FilterPanel Component

'use client';

import { Filters } from '@/types';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
  'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport',
  'Thriller', 'War', 'Western'
];

const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const updateFilter = (key: keyof Filters, value: string | number) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined,
      page: 1, // Reset to first page when filters change
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Filtros</h3>
        {(filters.type || filters.year || filters.genre || filters.minRating) && (
          <button
            onClick={() => onFilterChange({ page: 1 })}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
          >
            Restablecer Todo
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Type Filter */}
        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2">
            Tipo de Contenido
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl
                     text-white outline-none cursor-pointer appearance-none
                     focus:border-purple-500/50 focus:bg-white/15 transition-all"
          >
            <option value="">Todos los Tipos</option>
            <option value="movie">Películas</option>
            <option value="series">Series</option>
            <option value="episode">Episodios</option>
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2">
            Año de Estreno
          </label>
          <select
            value={filters.year || ''}
            onChange={(e) => updateFilter('year', e.target.value)}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl
                     text-white outline-none cursor-pointer appearance-none
                     focus:border-purple-500/50 focus:bg-white/15 transition-all"
          >
            <option value="">Todos los Años</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Genre Filter (Client-side) */}
        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2">
            Género <span className="text-white/40 text-xs font-normal">(Página Actual)</span>
          </label>
          <select
            value={filters.genre || ''}
            onChange={(e) => updateFilter('genre', e.target.value)}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl
                     text-white outline-none cursor-pointer appearance-none
                     focus:border-purple-500/50 focus:bg-white/15 transition-all"
          >
            <option value="">Todos los Géneros</option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Min Rating Filter (Client-side) */}
        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2">
            Calificación Mínima <span className="text-white/40 text-xs font-normal">(Página Actual)</span>
          </label>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.minRating || 0}
              onChange={(e) => updateFilter('minRating', parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-white/60 mt-2">
              <span>0</span>
              <span className="text-purple-400 font-bold">{filters.minRating || 0}+</span>
              <span>10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
