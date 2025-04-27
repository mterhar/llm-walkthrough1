import { useState, useEffect } from 'react';
import { ApiResponse } from '../types';

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: object;
  credentials?: RequestCredentials;
  cache?: RequestCache;
}

export function useFetch<T>(url: string, options?: UseFetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const defaultHeaders = {
          'Content-Type': 'application/json',
        };

        const fetchOptions: RequestInit = {
          method: options?.method || 'GET',
          headers: { ...defaultHeaders, ...options?.headers },
          signal,
          credentials: options?.credentials || 'same-origin',
          cache: options?.cache || 'default',
        };

        if (options?.body && options.method !== 'GET') {
          fetchOptions.body = JSON.stringify(options.body);
        }

        const response = await fetch(url, fetchOptions);
        const result = await response.json() as ApiResponse<T>;
        
        if (!response.ok) {
          throw new Error(result.error || 'An error occurred');
        }
        
        setData(result.data as T);
      } catch (err) {
        if (!signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, options?.method, options?.body]);

  return { data, error, isLoading };
} 