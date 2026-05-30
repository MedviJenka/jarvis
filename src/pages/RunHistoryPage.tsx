import React, { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { GlassCard } from '../components/ui/GlassCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useRuns } from '../hooks/useRuns';
import type { RunStatus } from '../types';

function formatDuration(ms: number | null): string {
  if (ms === null) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_FILTERS: Array<RunStatus | 'all'> = ['all', 'success', 'error', 'running'];

export function RunHistoryPage() {
  const { runs, loading, error } = useRuns(undefined, 100);
  const [statusFilter, setStatusFilter] = useState<RunStatus | 'all'>('all');
  const [agentFilter, setAgentFilter] = useState('');

  const filtered = runs.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (agentFilter && !r.agent_name.includes(agentFilter)) return false;
    return true;
  });

  const agentNames = Array.from(new Set(runs.map(r => r.agent_name))).sort();

  return (
    <div>
      <TopBar title="Run History" subtitle="All agent executions" />
      <div className="p-8 space-y-4">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex gap-1">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700/40 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            value={agentFilter}
            onChange={e => setAgentFilter(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-1.5"
          >
            <option value="">All agents</option>
            {agentNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-xs text-slate-500 ml-auto">{filtered.length} runs</span>
        </div>

        {loading && <div className="flex justify-center py-16"><LoadingSpinner size={32} /></div>}
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {!loading && filtered.length === 0 && (
          <EmptyState message="No runs yet — log a run from an agent's detail page." />
        )}

        {!loading && filtered.length > 0 && (
          <GlassCard className="overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700/60 text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Agent</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Triggered by</th>
                  <th className="text-left px-4 py-3">Input</th>
                  <th className="text-left px-4 py-3">Started</th>
                  <th className="text-right px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((run, i) => (
                  <tr
                    key={run.id}
                    className={`border-b border-slate-800/60 hover:bg-slate-700/20 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-800/10'}`}
                  >
                    <td className="px-4 py-3 font-mono text-slate-200">{run.agent_name}</td>
                    <td className="px-4 py-3"><StatusBadge status={run.status} /></td>
                    <td className="px-4 py-3 text-slate-400">{run.triggered_by ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{run.input_summary ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-400">{formatTime(run.started_at)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">{formatDuration(run.duration_ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
