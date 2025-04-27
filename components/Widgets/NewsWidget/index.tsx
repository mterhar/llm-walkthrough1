'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { NewsArticle, WidgetProps } from '@/lib/types';

export function NewsWidget({ onClose }: WidgetProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('technology');
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);
  const [viewSaved, setViewSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const fetchNews = async (selectedCategory: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Map our UI categories to NYT sections
      let nytSection = selectedCategory;
      if (selectedCategory === 'science') {
        nytSection = 'science';
      } else if (selectedCategory === 'business') {
        nytSection = 'business';
      } else {
        nytSection = 'technology';
      }
      
      // Fetch from our API route
      const response = await fetch(`/api/news?section=${nytSection}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching news: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setError('Failed to load news articles');
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
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
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(date);
    } catch {
      return dateString;
    }
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
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow">
          {viewSaved ? (
            savedArticles.length > 0 ? (
              <ul className="space-y-4">
                {savedArticles.map(article => (
                  <li key={article.id} className="border border-gray-200 rounded overflow-hidden">
                    {article.imageUrl && (
                      <div className="relative w-full h-40">
                        <Image 
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
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
                  {article.imageUrl ? (
                    <div className="relative w-full h-40">
                      <Image 
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
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