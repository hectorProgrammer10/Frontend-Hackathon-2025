// Navigation Component

'use client';

import { Heart, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/features/ThemeToggle';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-black/80 backdrop-blur-xl'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 
                          flex items-center justify-center group-hover:scale-110 
                          transition-transform duration-300 shadow-lg shadow-purple-500/20">
              <span className="w-10 h-10"><img src="/iconM.svg"></img></span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-white 
                           bg-clip-text text-transparent tracking-tight">
              ComePelículas
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
              <span className='flex items-center gap-2'>Inicio <Home size={16}></Home></span>
            </Link>
            <Link
              href="/search"
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${isActive('/search')
                ? 'bg-white/10 text-white shadow-inner shadow-white/5'
                : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className='flex items-center gap-2'>Buscar <Search size={16}></Search></span>
            </Link>
            <Link
              href="/favorites"
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${isActive('/favorites')
                ? 'bg-white/10 text-white shadow-inner shadow-white/5'
                : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className='flex items-center gap-2'>Favoritos<Heart size={16} className='text-red-500'></Heart></span>
            </Link>
            <div className="ml-2 pl-2 border-l border-white/10">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
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
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 w-full h-[100dvh] bg-black/90 backdrop-blur-xl z-40 md:hidden transition-all duration-300 flex flex-col items-center justify-start pt-48 overflow-y-auto ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}>
        <div className="flex flex-col items-center gap-8 text-center w-full pb-10">
          <Link
            href="/"
            className={`text-3xl font-bold transition-colors ${isActive('/') ? 'text-purple-400' : 'text-white hover:text-purple-300'}`}
          >
            <span className='flex items-center gap-2'>Inicio <Home size={24}></Home></span>
          </Link>
          <Link
            href="/search"
            className={`text-3xl font-bold transition-colors ${isActive('/search') ? 'text-purple-400' : 'text-white hover:text-purple-300'}`}
          >
            <span className='flex items-center gap-2'>Buscar <Search size={24}></Search></span>
          </Link>
          <Link
            href="/favorites"
            className={`text-3xl font-bold transition-colors flex items-center gap-3 ${isActive('/favorites') ? 'text-purple-400' : 'text-white hover:text-purple-300'}`}
          >
            <span className='flex items-center gap-2'>Favoritos<Heart size={24} className='text-red-500'></Heart></span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
