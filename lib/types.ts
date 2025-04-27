/**
 * Application-wide type definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Dashboard widget types
export type WidgetType = 'todo' | 'weather' | 'news' | 'quote';

export interface WidgetLayout {
  id: string;
  type: WidgetType;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface WidgetProps {
  id: string;
  onEdit?: () => void;
  onClose?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}

// Task widget types (formerly Todo widget types)
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  userId?: string;
}

// Alias for backward compatibility
export type TaskItem = TodoItem;

// Weather widget types
export interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
  alerts?: Array<{
    title: string;
    description: string;
    severity: string;
  }>;
}

// News widget types
export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  summary?: string;
}

// Quote widget types
export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  isFavorite?: boolean;
} 