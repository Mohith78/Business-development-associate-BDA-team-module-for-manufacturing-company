import { useCallback, useEffect, useState } from 'react';

export const useApi = (request, options = {}) => {
  const { immediate = true, fallback = null } = options;
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState('');

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError('');
      try {
        const response = await request(...args);
        setData(response);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { data, setData, loading, error, execute };
};
