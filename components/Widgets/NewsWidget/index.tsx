'use client';

import { useState, useEffect } from 'react';
import { NewsArticle, WidgetProps } from '@/lib/types';

export function NewsWidget({ id, onClose }: WidgetProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('technology');
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);
  const [viewSaved, setViewSaved] = useState(false);

  // Fetch news on component mount and when category changes
  useEffect(() => {
    if (!viewSaved) {
      fetchNews(category);
    }
  }, [category, viewSaved]);

  // Load saved articles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedNewsArticles');
    if (saved) {
      try {
        setSavedArticles(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved articles', e);
      }
    }
  }, []);

  const fetchNews = (category: string) => {
    setIsLoading(true);
    
    // Mock API call - in a real app, we would fetch from a news API
    setTimeout(() => {
      const mockArticles: NewsArticle[] = [
        {
          id: '1',
          title: 'New React 19 Features Developers Are Excited About',
          source: 'Tech Daily',
          url: '#',
          publishedAt: new Date().toISOString(),
          imageUrl: 'https://via.placeholder.com/300x200',
          summary: 'React 19 introduces several new features that improve performance and developer experience.'
        },
        {
          id: '2',
          title: 'The Future of Web Development in 2024',
          source: 'Web Trends',
          url: '#',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          imageUrl: 'https://via.placeholder.com/300x200',
          summary: 'Explore the latest trends and technologies shaping the future of web development.'
        },
        {
          id: '3',
          title: 'TypeScript 5.5 Released With New Features',
          source: 'Dev News',
          url: '#',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          imageUrl: 'https://via.placeholder.com/300x200',
          summary: 'TypeScript 5.5 brings new type-checking features and performance improvements.'
        },
        {
          id: '4',
          title: 'Building Responsive Dashboards With Tailwind CSS',
          source: 'UI Weekly',
          url: '#',
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          imageUrl: 'https://via.placeholder.com/300x200',
          summary: 'Learn how to create beautiful, responsive dashboards using Tailwind CSS.'
        },
        {
          id: '5',
          title: 'Next.js 15 Announced With Focus on Performance',
          source: 'Framework Times',
          url: '#',
          publishedAt: new Date(Date.now() - 345600000).toISOString(),
          imageUrl: 'https://via.placeholder.com/300x200',
          summary: 'Vercel announces Next.js 15 with significant performance improvements and new features.'
        },
      ];
      
      setArticles(mockArticles);
      setIsLoading(false);
    }, 1000);
  };

  const handleSaveArticle = (article: NewsArticle) => {
    if (!savedArticles.some(saved => saved.id === article.id)) {
      const updatedSaved = [...savedArticles, article];
      setSavedArticles(updatedSaved);
      localStorage.setItem('savedNewsArticles', JSON.stringify(updatedSaved));
    }
  };

  const handleRemoveSaved = (id: string) => {
    const filtered = savedArticles.filter(article => article.id !== id);
    setSavedArticles(filtered);
    localStorage.setItem('savedNewsArticles', JSON.stringify(filtered));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">News</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <button
            onClick={() => { setViewSaved(false); setCategory('technology') }}
            className={`px-3 py-1 rounded text-sm ${!viewSaved && category === 'technology' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Tech
          </button>
          <button
            onClick={() => { setViewSaved(false); setCategory('business') }}
            className={`px-3 py-1 rounded text-sm ${!viewSaved && category === 'business' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Business
          </button>
          <button
            onClick={() => { setViewSaved(false); setCategory('science') }}
            className={`px-3 py-1 rounded text-sm ${!viewSaved && category === 'science' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Science
          </button>
        </div>
        
        <button
          onClick={() => setViewSaved(!viewSaved)}
          className={`px-3 py-1 rounded text-sm ${viewSaved ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {viewSaved ? 'Latest News' : 'Saved Articles'}
          {!viewSaved && savedArticles.length > 0 && (
            <span className="ml-1 bg-red-500 text-white rounded-full text-xs px-1.5">{savedArticles.length}</span>
          )}
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow">
          {viewSaved ? (
            savedArticles.length > 0 ? (
              <ul className="space-y-4">
                {savedArticles.map(article => (
                  <li key={article.id} className="border border-gray-200 rounded overflow-hidden">
                    {article.imageUrl && (
                      <img 
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h3 className="font-semibold">{article.title}</h3>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{article.source}</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      {article.summary && (
                        <p className="text-sm mt-2 text-gray-600">{article.summary}</p>
                      )}
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={() => handleRemoveSaved(article.id)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                        <a 
                          href={article.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 text-sm hover:text-blue-700"
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No saved articles yet
              </div>
            )
          ) : articles.length > 0 ? (
            <ul className="space-y-4">
              {articles.map(article => (
                <li key={article.id} className="border border-gray-200 rounded overflow-hidden">
                  {article.imageUrl && (
                    <img 
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold">{article.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{article.source}</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    {article.summary && (
                      <p className="text-sm mt-2 text-gray-600">{article.summary}</p>
                    )}
                    <div className="mt-3 flex justify-between">
                      <button
                        onClick={() => handleSaveArticle(article)}
                        className="text-gray-500 text-sm hover:text-gray-700"
                        disabled={savedArticles.some(saved => saved.id === article.id)}
                      >
                        {savedArticles.some(saved => saved.id === article.id) ? 'Saved' : 'Save for later'}
                      </button>
                      <a 
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 text-sm hover:text-blue-700"
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No articles found
            </div>
          )}
        </div>
      )}
    </div>
  );
} 