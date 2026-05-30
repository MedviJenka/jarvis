import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { Pipeline } from '../types';

export function usePipelines() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPipelines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPipelines();
      setPipelines(res.pipelines);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load pipelines');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPipelines(); }, [fetchPipelines]);
  return { pipelines, loading, error, refetch: fetchPipelines };
}
