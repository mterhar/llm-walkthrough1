import { NextRequest, NextResponse } from 'next/server';
import { fetchTopStories, NYT_SECTIONS } from '@/lib/services/nytimes';

export async function GET(request: NextRequest) {
  try {
    // Get the section from the query parameters
    const searchParams = request.nextUrl.searchParams;
    let section = searchParams.get('section') || 'technology';
    
    // Validate the section
    if (!NYT_SECTIONS.includes(section)) {
      section = 'technology'; // Default to technology if invalid section
    }
    
    const articles = await fetchTopStories(section);
    
    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error('Error in news API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
} 