'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export default function SearchBar({
  initialQuery = '',
  onSearch,
  className = '',
  placeholder = 'Buscar películas y series...'
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-6 pr-32 md:pr-40 py-4 text-base md:text-lg bg-card backdrop-blur-xl border border-border rounded-2xl 
                   text-foreground placeholder-muted outline-none
                   focus:border-purple-500/50 focus:bg-card/80 focus:shadow-lg focus:shadow-purple-500/10
                   transition-all duration-300
                   hover:border-border hover:bg-card/80"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-muted hover:text-foreground transition-colors hover:bg-card/80 rounded-full"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
          <button
            type="submit"
            className="p-3 md:px-6 md:py-2 bg-gradient-to-r from-purple-600 to-pink-600
                     text-white font-semibold rounded-xl
                     hover:from-purple-500 hover:to-pink-500
                     transition-all duration-300
                     hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
            aria-label="Search"
          >
            <span className="hidden md:block">Buscar</span>
            <span className="md:hidden text-xl"><Search size={16} /></span>
          </button>
        </div>
      </div>
    </form>
  );
}
