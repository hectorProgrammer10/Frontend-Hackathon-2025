// Favorites Management using LocalStorage
import { FavoriteItem, Movie } from '@/types';

const FAVORITES_KEY = 'omdb_favorites';

/**
 * Check if localStorage is available and accessible
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    // localStorage is not available (privacy mode, storage full, etc.)
    console.warn('localStorage is not available:', e);
    return false;
  }
}

/**
 * Get all favorites from localStorage
 */
export function getFavorites(): FavoriteItem[] {
  if (!isStorageAvailable()) return [];

  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

/**
 * Add a movie/series to favorites
 */
export function addToFavorites(item: Movie): void {
  if (!isStorageAvailable()) return;

  try {
    const favorites = getFavorites();
    const exists = favorites.some(fav => fav.imdbID === item.imdbID);

    if (!exists) {
      const newFavorite: FavoriteItem = {
        ...item,
        addedAt: Date.now(),
      };
      favorites.push(newFavorite);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}

/**
 * Remove a movie/series from favorites
 */
export function removeFromFavorites(imdbID: string): void {
  if (!isStorageAvailable()) return;

  try {
    const favorites = getFavorites();
    const updated = favorites.filter(fav => fav.imdbID !== imdbID);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

/**
 * Check if an item is in favorites
 */
export function isFavorite(imdbID: string): boolean {
  if (!isStorageAvailable()) return false;

  try {
    const favorites = getFavorites();
    return favorites.some(fav => fav.imdbID === imdbID);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(item: Movie): boolean {
  const favorite = isFavorite(item.imdbID);

  if (favorite) {
    removeFromFavorites(item.imdbID);
    return false;
  } else {
    addToFavorites(item);
    return true;
  }
}
