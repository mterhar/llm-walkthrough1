import { NextRequest } from 'next/server';
import { GET } from './route';
import * as nytimesService from '@/lib/services/nytimes';

// Mock the nytimes service
jest.mock('@/lib/services/nytimes', () => ({
  fetchTopStories: jest.fn(),
  NYT_SECTIONS: ['technology', 'business', 'science']
}));

describe('News API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return articles with status 200', async () => {
    // Mock articles to be returned
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article',
        source: 'NYT',
        url: 'https://example.com',
        publishedAt: '2023-01-01',
        imageUrl: 'https://example.com/image.jpg',
        summary: 'This is a test article'
      }
    ];

    // Set up the mock to return our test articles
    (nytimesService.fetchTopStories as jest.Mock).mockResolvedValue(mockArticles);

    // Create a mock request with a search param
    const request = new NextRequest(
      new URL('http://localhost:3000/api/news?section=technology')
    );

    // Call the route handler
    const response = await GET(request);
    const data = await response.json();

    // Expectations
    expect(response.status).toBe(200);
    expect(data).toEqual({ articles: mockArticles });
    expect(nytimesService.fetchTopStories).toHaveBeenCalledWith('technology');
  });

  it('should default to technology section if none provided', async () => {
    // Mock empty array response
    (nytimesService.fetchTopStories as jest.Mock).mockResolvedValue([]);

    // Create a request without section param
    const request = new NextRequest(
      new URL('http://localhost:3000/api/news')
    );

    // Call the route handler
    await GET(request);

    // Check if the default section was used
    expect(nytimesService.fetchTopStories).toHaveBeenCalledWith('technology');
  });

  it('should handle errors and return 500 status', async () => {
    // Mock a rejection from the service
    (nytimesService.fetchTopStories as jest.Mock).mockRejectedValue(
      new Error('Service error')
    );

    // Create a request
    const request = new NextRequest(
      new URL('http://localhost:3000/api/news')
    );

    // Call the route handler
    const response = await GET(request);
    const data = await response.json();

    // Expectations
    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch news articles');
  });
}); 