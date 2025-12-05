// YouTube Data API Service

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Search for a trailer on YouTube
 * @param query The search query (e.g. "Inception 2010 official trailer")
 * @returns The video ID of the first result, or null if not found
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
      videoEmbeddable: 'true', // Ensure video can be embedded
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
