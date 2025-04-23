import { useState, useEffect } from 'react';
import { ServiceError } from '../mocks/service';

interface UseDataResult<T> {
  data: T;
  isLoading: boolean;
  error: ServiceError | Error | null;
  refetch: () => Promise<void>;
  setData: (data: T) => void;
}

export function useData<T>(
  fetchFn: () => Promise<T>,
  initialData: T,
  deps: any[] = []
): UseDataResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ServiceError | Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      if (err instanceof ServiceError) {
        setError(err);
      } else {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    setData
  };
}