// SearchBar Component

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  placeholder = 'Search movies and series...'
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
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

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 text-base md:text-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl 
                   text-white placeholder-white/40 outline-none
                   focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/10
                   transition-all duration-300
                   hover:border-white/20 hover:bg-white/10"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2
                   p-3 md:px-6 md:py-2 bg-gradient-to-r from-purple-600 to-pink-600
                   text-white font-semibold rounded-xl
                   hover:from-purple-500 hover:to-pink-500
                   transition-all duration-300
                   hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
          aria-label="Search"
        >
          <span className="hidden md:block">Search</span>
          <span className="md:hidden text-xl">🔍</span>
        </button>
      </div>
    </form>
  );
}
