'use client';

import { useState, useEffect } from 'react';
import { WidgetLayout, WidgetType } from '@/lib/types';
import { TasksWidget } from '@/components/Widgets/TasksWidget';
import { WeatherWidget } from '@/components/Widgets/WeatherWidget';
import { NewsWidget } from '@/components/Widgets/NewsWidget';
import { QuoteWidget } from '@/components/Widgets/QuoteWidget';

export function Dashboard() {
  const [layouts, setLayouts] = useState<WidgetLayout[]>([]);

  // Load saved layouts from localStorage on component mount
  useEffect(() => {
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    if (savedLayouts) {
      try {
        setLayouts(JSON.parse(savedLayouts));
      } catch (e) {
        console.error('Failed to parse saved layouts', e);
      }
    } else {
      // Default layout if none saved
      setLayouts([
        { id: 'tasks-widget', type: 'todo', position: { x: 0, y: 0 }, size: { width: 1, height: 2 } },
        { id: 'weather-widget', type: 'weather', position: { x: 1, y: 0 }, size: { width: 1, height: 1 } },
        { id: 'quote-widget', type: 'quote', position: { x: 1, y: 1 }, size: { width: 1, height: 1 } },
        { id: 'news-widget', type: 'news', position: { x: 0, y: 2 }, size: { width: 2, height: 2 } },
      ]);
    }
  }, []);

  // Save layouts to localStorage when they change
  useEffect(() => {
    if (layouts.length > 0) {
      localStorage.setItem('dashboardLayouts', JSON.stringify(layouts));
    }
  }, [layouts]);

  const handleAddWidget = (type: WidgetType) => {
    // For Tasks widget type, check if one already exists
    if (type === 'todo' && layouts.some(widget => widget.type === 'todo')) {
      // Don't add another Tasks widget if one already exists
      return;
    }
    
    const newWidget: WidgetLayout = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 0, y: 0 }, // Will be adjusted by grid layout
      size: { width: 1, height: 1 },
    };
    setLayouts([...layouts, newWidget]);
  };

  const handleRemoveWidget = (id: string) => {
    setLayouts(layouts.filter(widget => widget.id !== id));
  };

  // Check if there's already a Tasks widget
  const hasTasksWidget = layouts.some(widget => widget.type === 'todo');

  // Render widget based on type
  const renderWidget = (widget: WidgetLayout) => {
    const props = {
      id: widget.id,
      onClose: () => handleRemoveWidget(widget.id),
    };

    switch (widget.type) {
      case 'todo':
        return <TasksWidget key={widget.id} {...props} />;
      case 'weather':
        return <WeatherWidget key={widget.id} {...props} />;
      case 'news':
        return <NewsWidget key={widget.id} {...props} />;
      case 'quote':
        return <QuoteWidget key={widget.id} {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personal Dashboard</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleAddWidget('todo')}
            className={`px-3 py-2 ${hasTasksWidget 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'} text-white rounded`}
            disabled={hasTasksWidget}
            title={hasTasksWidget ? "Only one Tasks widget allowed" : "Add Tasks widget"}
          >
            Add Tasks
          </button>
          <button 
            onClick={() => handleAddWidget('weather')}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Weather
          </button>
          <button 
            onClick={() => handleAddWidget('news')}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Add News
          </button>
          <button 
            onClick={() => handleAddWidget('quote')}
            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Add Quote
          </button>
        </div>
      </div>

      {/* Simple grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {layouts.map(widget => (
          <div key={widget.id} className="relative bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              {renderWidget(widget)}
            </div>
          </div>
        ))}
      </div>

      {layouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your dashboard is empty</p>
          <p className="text-gray-500">Add widgets using the buttons above</p>
        </div>
      )}
    </div>
  );
} 