// useMetalPrice.js
import { useState, useEffect, useCallback } from 'react';
import { fetchMetalPrice } from '../services/metalApi';

const REFRESH_INTERVAL = 30000; // 30 seconds

const useMetalPrice = metalKey => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetch = useCallback(
    async (isRefresh = false) => {
      if (!isRefresh) setLoading(true);
      setError(null);
      try {
        const result = await fetchMetalPrice(metalKey);
        setData(result);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.message || 'Failed to fetch price');
      } finally {
        setLoading(false);
      }
    },
    [metalKey],
  );

  useEffect(() => {
    fetch();
    const interval = setInterval(() => fetch(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetch]);

  const refresh = () => fetch(false);

  return { data, loading, error, lastUpdated, refresh };
};

export default useMetalPrice;
