import { NextResponse } from 'next/server';
import { searchYouTubeTrailer } from '@/lib/api/youtube';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const videoId = await searchYouTubeTrailer(query);

  return NextResponse.json({ videoId });
}
