import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, BookOpen, Terminal, GitBranch, Plus, ArrowRight, RefreshCw, Activity } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { StatCard } from '../components/ui/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useStats } from '../hooks/useStats';
import { api } from '../api/client';
import type { AgentCategory, AgentStatus } from '../types';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function DashboardPage() {
  const { stats, loading, refetch } = useStats();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await api.syncAgents();
      setSyncMsg(res.success ? res.output || 'Up to date' : `Sync failed: ${res.output}`);
      if (res.success) refetch();
    } catch (e) {
      setSyncMsg(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  const healthStatuses: AgentStatus[] = ['healthy', 'degraded', 'error', 'unknown'];

  return (
    <div>
      <TopBar title="Dashboard" subtitle="Claude Agent System Overview" />
      <div className="p-8 space-y-8">

        {/* Sync bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 text-xs bg-slate-700/40 hover:bg-slate-700/70 text-slate-300 border border-slate-600/40 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing…' : 'Sync agents'}
          </button>
          {stats.last_synced && (
            <span className="text-xs text-slate-500">Last synced: {formatTime(stats.last_synced)}</span>
          )}
          {syncMsg && (
            <span className={`text-xs ${syncMsg.startsWith('Sync failed') ? 'text-red-400' : 'text-green-400'}`}>
              {syncMsg}
            </span>
          )}
        </div>

        {/* Counts */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Agents" value={stats.agent_count} icon={<Bot size={20} />} color="text-indigo-400" />
          <StatCard label="Skills" value={stats.skill_count} icon={<BookOpen size={20} />} color="text-purple-400" />
          <StatCard label="Commands" value={stats.command_count} icon={<Terminal size={20} />} color="text-blue-400" />
          <StatCard label="Pipelines" value={stats.pipeline_count} icon={<GitBranch size={20} />} color="text-green-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category breakdown */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Agents by Category</h2>
            <div className="space-y-3">
              {Object.entries(stats.category_breakdown).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <CategoryBadge category={cat as AgentCategory} />
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${(count / stats.agent_count) * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-xs w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Health breakdown */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Activity size={14} /> Agent Health
            </h2>
            <div className="space-y-3">
              {healthStatuses.map(s => {
                const count = stats.health_breakdown[s] ?? 0;
                if (count === 0) return null;
                return (
                  <div key={s} className="flex items-center justify-between">
                    <StatusBadge status={s} size="md" />
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all bg-slate-500"
                          style={{ width: `${(count / stats.agent_count) * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-xs w-4 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
              {Object.keys(stats.health_breakdown).length === 0 && (
                <p className="text-xs text-slate-600">No health data yet — log runs to track agent health.</p>
              )}
            </div>
          </GlassCard>

          {/* Quick actions */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Browse Agent Gallery', desc: 'Search and explore all agents', to: '/agents', icon: <Bot size={16} /> },
                { label: 'View Pipelines', desc: 'See /fix and /ship pipeline DAGs', to: '/pipelines', icon: <GitBranch size={16} /> },
                { label: 'Run History', desc: 'View all agent executions', to: '/runs', icon: <Activity size={16} /> },
                { label: 'Create New Agent', desc: 'Use AI to generate a custom agent', to: '/create/agent', icon: <Plus size={16} /> },
              ].map(item => (
                <button key={item.to} onClick={() => navigate(item.to)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/60 transition-colors text-left group">
                  <div className="text-indigo-400">{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
