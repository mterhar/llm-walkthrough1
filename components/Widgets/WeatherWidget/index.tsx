'use client';

import { useState, useEffect } from 'react';
import { WeatherData, WidgetProps } from '@/lib/types';

export function WeatherWidget({ id, onClose }: WidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('');
  const [inputLocation, setInputLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('weatherLocation');
    if (savedLocation) {
      setLocation(savedLocation);
      fetchWeather(savedLocation);
    } else {
      // Default to user's location
      getUserLocation();
    }
  }, []);

  const getUserLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, we would use these coordinates to fetch weather
          // For demo purposes, we'll just use a mock location
          const mockLocation = 'New York';
          setLocation(mockLocation);
          localStorage.setItem('weatherLocation', mockLocation);
          fetchWeather(mockLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not get your location. Please enter it manually.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
    }
  };

  const fetchWeather = (loc: string) => {
    setIsLoading(true);
    setError('');
    
    // Mock API call - in a real app, we would fetch from a weather API
    setTimeout(() => {
      const mockWeather: WeatherData = {
        location: loc,
        current: {
          temp: 72,
          condition: 'Partly Cloudy',
          icon: 'cloud',
          humidity: 65,
          windSpeed: 5,
        },
        forecast: [
          {
            date: new Date().toLocaleDateString(),
            high: 75,
            low: 62,
            condition: 'Partly Cloudy',
            icon: 'cloud',
          },
          {
            date: new Date(Date.now() + 86400000).toLocaleDateString(),
            high: 78,
            low: 65,
            condition: 'Sunny',
            icon: 'sun',
          },
          {
            date: new Date(Date.now() + 172800000).toLocaleDateString(),
            high: 80,
            low: 68,
            condition: 'Sunny',
            icon: 'sun',
          },
          {
            date: new Date(Date.now() + 259200000).toLocaleDateString(),
            high: 77,
            low: 66,
            condition: 'Rain',
            icon: 'rain',
          },
          {
            date: new Date(Date.now() + 345600000).toLocaleDateString(),
            high: 74,
            low: 63,
            condition: 'Cloudy',
            icon: 'cloud',
          },
        ],
      };
      
      setWeather(mockWeather);
      setIsLoading(false);
    }, 1000);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLocation.trim()) return;
    
    setLocation(inputLocation);
    localStorage.setItem('weatherLocation', inputLocation);
    fetchWeather(inputLocation);
    setInputLocation('');
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1M12 20v1M3 12h1M20 12h1M5.6 5.6l.7.7M18.4 18.4l.7.7M18.4 5.6l-.7.7M5.6 18.4l-.7.7" />
          </svg>
        );
      case 'cloud':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case 'rain':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14.5a3.5 3.5 0 00-3.5-3.5h-1.35a6 6 0 00-11.3 0H2.5a3.5 3.5 0 000 7h13a3.5 3.5 0 003.5-3.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19v1M12 19v1M16 19v1" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Weather</h2>
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

      <form onSubmit={handleLocationSubmit} className="mb-4 flex space-x-2">
        <input
          type="text"
          value={inputLocation}
          onChange={(e) => setInputLocation(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter location..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update
        </button>
      </form>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : weather ? (
        <div className="flex-grow">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{weather.location}</h3>
            <div className="flex items-center mt-2">
              {getWeatherIcon(weather.current.icon)}
              <div className="ml-3">
                <div className="text-3xl font-bold">{weather.current.temp}°F</div>
                <div className="text-gray-600">{weather.current.condition}</div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>Humidity: {weather.current.humidity}%</div>
              <div>Wind: {weather.current.windSpeed} mph</div>
            </div>
          </div>
          
          <h4 className="font-semibold mb-2">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-1">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center p-2">
                <div className="text-xs font-medium">{day.date.split('/')[1]}</div>
                <div className="my-1">{getWeatherIcon(day.icon)}</div>
                <div className="text-xs font-medium">{day.high}°</div>
                <div className="text-xs text-gray-500">{day.low}°</div>
              </div>
            ))}
          </div>
          
          {weather.alerts && weather.alerts.length > 0 && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
              <div className="font-semibold">Weather Alert</div>
              <div className="text-sm">{weather.alerts[0].title}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No weather data available
        </div>
      )}
    </div>
  );
} 