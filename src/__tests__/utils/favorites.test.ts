import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  toggleFavorite,
} from '@/lib/utils/favorites'
import { Movie } from '@/types'

describe('Favorites Utilities', () => {
  const mockMovie: Movie = {
    Title: 'Test Movie',
    Year: '2023',
    imdbID: 'tt1234567',
    Type: 'movie',
    Poster: 'https://example.com/poster.jpg',
  }

  beforeEach(() => {
    // Limpiar el almacenamiento local antes de cada prueba
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('getFavorites', () => {
    it('should return empty array when no favorites', () => {
      const favorites = getFavorites()
      expect(favorites).toEqual([])
    })

    it('should return favorites from localStorage', () => {
      const mockFavorites = [{ ...mockMovie, addedAt: Date.now() }]
      localStorage.setItem('omdb_favorites', JSON.stringify(mockFavorites))

      const favorites = getFavorites()
      expect(favorites).toHaveLength(1)
      expect(favorites[0].imdbID).toBe(mockMovie.imdbID)
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('omdb_favorites', 'invalid json')
      jest.spyOn(console, 'error').mockImplementation(() => { })

      const favorites = getFavorites()
      expect(favorites).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('addToFavorites', () => {
    it('should add movie to favorites', () => {
      addToFavorites(mockMovie)

      const favorites = getFavorites()
      expect(favorites).toHaveLength(1)
      expect(favorites[0].imdbID).toBe(mockMovie.imdbID)
      expect(favorites[0].addedAt).toBeDefined()
    })

    it('should not add duplicate movie', () => {
      addToFavorites(mockMovie)
      addToFavorites(mockMovie)

      const favorites = getFavorites()
      expect(favorites).toHaveLength(1)
    })
  })

  describe('removeFromFavorites', () => {
    it('should remove movie from favorites', () => {
      addToFavorites(mockMovie)
      expect(getFavorites()).toHaveLength(1)

      removeFromFavorites(mockMovie.imdbID)
      expect(getFavorites()).toHaveLength(0)
    })

    it('should handle removing non-existent movie', () => {
      removeFromFavorites('nonexistent')
      expect(getFavorites()).toHaveLength(0)
    })
  })

  describe('isFavorite', () => {
    it('should return true if movie is in favorites', () => {
      addToFavorites(mockMovie)
      expect(isFavorite(mockMovie.imdbID)).toBe(true)
    })

    it('should return false if movie is not in favorites', () => {
      expect(isFavorite(mockMovie.imdbID)).toBe(false)
    })
  })

  describe('toggleFavorite', () => {
    it('should add movie if not in favorites', () => {
      const result = toggleFavorite(mockMovie)
      expect(result).toBe(true)
      expect(isFavorite(mockMovie.imdbID)).toBe(true)
    })

    it('should remove movie if already in favorites', () => {
      addToFavorites(mockMovie)
      const result = toggleFavorite(mockMovie)
      expect(result).toBe(false)
      expect(isFavorite(mockMovie.imdbID)).toBe(false)
    })
  })
})
