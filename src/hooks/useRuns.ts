import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { AgentRun } from '../types';

export function useRuns(agentName?: string, limit = 50) {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRuns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getRuns(agentName, limit);
      setRuns(res.runs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load runs');
    } finally {
      setLoading(false);
    }
  }, [agentName, limit]);

  useEffect(() => { fetchRuns(); }, [fetchRuns]);

  return { runs, loading, error, refetch: fetchRuns };
}
