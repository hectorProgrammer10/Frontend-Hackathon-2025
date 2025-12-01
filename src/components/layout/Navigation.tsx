// Navigation Component

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentionally syncing menu state with pathname changes
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 
                          flex items-center justify-center group-hover:scale-110 
                          transition-transform duration-300 shadow-lg shadow-purple-500/20">
              <span className="text-2xl">🎬</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-white 
                           bg-clip-text text-transparent tracking-tight">
              MovieDB
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${isActive('/')
                ? 'bg-white/10 text-white shadow-inner shadow-white/5'
                : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              Home
            </Link>
            <Link
              href="/search"
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${isActive('/search')
                ? 'bg-white/10 text-white shadow-inner shadow-white/5'
                : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              Search
            </Link>
            <Link
              href="/favorites"
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${isActive('/favorites')
                ? 'bg-white/10 text-white shadow-inner shadow-white/5'
                : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>Favorites</span>
              <span className="text-sm">❤️</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`} />
              <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''
                }`} />
              <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 md:hidden transition-all duration-300 flex items-center justify-center ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <Link
            href="/"
            className={`text-3xl font-bold transition-colors ${isActive('/') ? 'text-purple-400' : 'text-white hover:text-purple-300'}`}
          >
            Home
          </Link>
          <Link
            href="/search"
            className={`text-3xl font-bold transition-colors ${isActive('/search') ? 'text-purple-400' : 'text-white hover:text-purple-300'}`}
          >
            Search
          </Link>
          <Link
            href="/favorites"
            className={`text-3xl font-bold transition-colors flex items-center gap-3 ${isActive('/favorites') ? 'text-purple-400' : 'text-white hover:text-purple-300'}`}
          >
            Favorites ❤️
          </Link>
        </div>
      </div>
    </nav>
  );
}
