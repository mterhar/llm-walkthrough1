'use client';

import { useState, useEffect } from 'react';
import { Quote, WidgetProps } from '@/lib/types';

export function QuoteWidget({ id, onClose }: WidgetProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [category, setCategory] = useState('success');

  // Fetch quote on component mount and when category changes
  useEffect(() => {
    fetchQuote(category);
  }, [category]);
  
  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteQuotes');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error parsing favorite quotes', e);
      }
    }
  }, []);

  const fetchQuote = (category: string) => {
    setIsLoading(true);
    
    // Mock API call - in a real app, we would fetch from a quotes API
    setTimeout(() => {
      const quotes = {
        success: [
          { id: '1', text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.', author: 'Winston Churchill', category: 'success' },
          { id: '2', text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney', category: 'success' },
          { id: '3', text: 'Don\'t be afraid to give up the good to go for the great.', author: 'John D. Rockefeller', category: 'success' },
        ],
        creativity: [
          { id: '4', text: 'Creativity is intelligence having fun.', author: 'Albert Einstein', category: 'creativity' },
          { id: '5', text: 'You can\'t use up creativity. The more you use, the more you have.', author: 'Maya Angelou', category: 'creativity' },
          { id: '6', text: 'Creativity involves breaking out of established patterns in order to look at things in a different way.', author: 'Edward de Bono', category: 'creativity' },
        ],
        motivation: [
          { id: '7', text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', category: 'motivation' },
          { id: '8', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation' },
          { id: '9', text: 'Your time is limited, so don\'t waste it living someone else\'s life.', author: 'Steve Jobs', category: 'motivation' },
        ],
        wisdom: [
          { id: '10', text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates', category: 'wisdom' },
          { id: '11', text: 'We can know only that we know nothing. And that is the highest degree of human wisdom.', author: 'Leo Tolstoy', category: 'wisdom' },
          { id: '12', text: 'By three methods we may learn wisdom: First, by reflection, which is noblest; Second, by imitation, which is easiest; and third by experience, which is the bitterest.', author: 'Confucius', category: 'wisdom' },
        ],
      };
      
      const categoryQuotes = quotes[category as keyof typeof quotes] || quotes.success;
      const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
      const selectedQuote = categoryQuotes[randomIndex];
      
      // Check if this quote is a favorite
      const isFavorite = favorites.some(fav => fav.id === selectedQuote.id);
      setQuote({ ...selectedQuote, isFavorite });
      
      setIsLoading(false);
    }, 500);
  };

  const toggleFavorite = () => {
    if (!quote) return;
    
    const isFavorite = favorites.some(fav => fav.id === quote.id);
    let updatedFavorites: Quote[];
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== quote.id);
    } else {
      updatedFavorites = [...favorites, { ...quote, isFavorite: true }];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites));
    setQuote({ ...quote, isFavorite: !isFavorite });
  };

  const handleShare = () => {
    if (!quote) return;
    
    // In a real app, we would implement sharing functionality
    // For now, we'll just copy to clipboard
    const text = `"${quote.text}" - ${quote.author}`;
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Quote copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy quote:', err);
      });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Daily Quote</h2>
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

      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => setCategory('success')}
          className={`px-2 py-1 text-xs rounded ${category === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Success
        </button>
        <button
          onClick={() => setCategory('creativity')}
          className={`px-2 py-1 text-xs rounded ${category === 'creativity' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Creativity
        </button>
        <button
          onClick={() => setCategory('motivation')}
          className={`px-2 py-1 text-xs rounded ${category === 'motivation' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Motivation
        </button>
        <button
          onClick={() => setCategory('wisdom')}
          className={`px-2 py-1 text-xs rounded ${category === 'wisdom' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Wisdom
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : quote ? (
        <div className="flex-grow flex flex-col justify-center">
          <div className="bg-gray-50 p-6 rounded-lg">
            <svg className="w-8 h-8 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.016 14.016v-4.031h4.031v4.031h-4.031zM14.016 8.016v-4.031h4.031v4.031h-4.031zM8.016 8.016v-4.031h4.031v4.031h-4.031zM8.016 14.016v-4.031h4.031v4.031h-4.031zM14.016 20.016v-4.031h4.031v4.031h-4.031zM8.016 20.016v-4.031h4.031v4.031h-4.031z"></path>
            </svg>
            <blockquote className="italic text-xl text-gray-700 mb-4">"{quote.text}"</blockquote>
            <div className="text-right font-semibold text-gray-600">- {quote.author}</div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={toggleFavorite}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 mr-1 ${quote.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                  viewBox="0 0 20 20" 
                  fill={quote.isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                >
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{quote.isFavorite ? 'Saved' : 'Save'}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Share</span>
              </button>
              
              <button
                onClick={() => fetchQuote(category)}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm">New Quote</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No quote available
        </div>
      )}
    </div>
  );
} 