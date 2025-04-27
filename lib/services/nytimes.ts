import { NewsArticle } from '@/lib/types';

const NYT_API_KEY = process.env.NYT_API_KEY || '';
const NYT_API_BASE_URL = 'https://api.nytimes.com/svc';

interface NYTArticle {
  title: string;
  abstract: string;
  url: string;
  published_date: string;
  section: string;
  byline: string;
  multimedia: Array<{
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
  }>;
  short_url: string;
  uri: string;
}

interface NYTTopStoriesResponse {
  status: string;
  copyright: string;
  section: string;
  last_updated: string;
  num_results: number;
  results: NYTArticle[];
}

export async function fetchTopStories(section: string = 'technology'): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `${NYT_API_BASE_URL}/topstories/v2/${section}.json?api-key=${NYT_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`NYT API error: ${response.status}`);
    }

    const data: NYTTopStoriesResponse = await response.json();
    
    // Map NYT article format to our app's NewsArticle format
    return data.results.map((article: NYTArticle) => {
      // Find the first medium-sized image or fallback to any image
      const image = article.multimedia?.find(media => media.format === 'mediumThreeByTwo210') || 
                    article.multimedia?.[0];
      
      return {
        id: article.uri,
        title: article.title,
        source: article.byline || 'The New York Times',
        url: article.url,
        publishedAt: article.published_date,
        imageUrl: image?.url,
        summary: article.abstract
      };
    });
  } catch (error) {
    console.error('Error fetching NYT top stories:', error);
    return [];
  }
}

// Valid NYT Top Stories sections
export const NYT_SECTIONS = [
  'arts',
  'automobiles',
  'books',
  'business',
  'fashion',
  'food',
  'health',
  'home',
  'insider',
  'magazine',
  'movies',
  'nyregion',
  'obituaries',
  'opinion',
  'politics',
  'realestate',
  'science',
  'sports',
  'sundayreview',
  'technology',
  'theater',
  'travel',
  'upshot',
  'us',
  'world'
]; 