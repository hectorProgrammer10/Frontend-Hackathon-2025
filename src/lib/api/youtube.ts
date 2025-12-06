// YouTube Data API Service

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * @param query La consulta de búsqueda(e.g. "Inception 2010 official trailer")
 * @returns El ID del vídeo del primer resultado, o nulo si no se encuentra
 */
export async function searchYouTubeTrailer(query: string): Promise<string | null> {
  if (!YOUTUBE_API_KEY) {
    console.error('YOUTUBE_API_KEY is not defined');
    return null;
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      key: YOUTUBE_API_KEY,
      maxResults: '1',
      videoEmbeddable: 'true', // Se asegura de que el vídeo se pueda incrustar
    });

    const response = await fetch(`${BASE_URL}/search?${params.toString()}`);

    if (!response.ok) {
      console.error('YouTube API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }

    return null;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
}
