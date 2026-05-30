import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, BookOpen, Terminal, GitBranch, Plus, ArrowRight } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { StatCard } from '../components/ui/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import { useStats } from '../hooks/useStats';
import type { AgentCategory } from '../types';

export function DashboardPage() {
  const { stats, loading } = useStats();
  const navigate = useNavigate();

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Dashboard" subtitle="Claude Agent System Overview" />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Agents" value={stats.agent_count} icon={<Bot size={20} />} color="text-indigo-400" />
          <StatCard label="Skills" value={stats.skill_count} icon={<BookOpen size={20} />} color="text-purple-400" />
          <StatCard label="Commands" value={stats.command_count} icon={<Terminal size={20} />} color="text-blue-400" />
          <StatCard label="Pipelines" value={stats.pipeline_count} icon={<GitBranch size={20} />} color="text-green-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <GlassCard className="p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Browse Agent Gallery', desc: 'Search and explore all agents', to: '/agents', icon: <Bot size={16} /> },
                { label: 'View Pipelines', desc: 'See /fix and /ship pipeline DAGs', to: '/pipelines', icon: <GitBranch size={16} /> },
                { label: 'Create New Agent', desc: 'Use AI to generate a custom agent', to: '/create/agent', icon: <Plus size={16} /> },
                { label: 'Build Pipeline', desc: 'Chain agents into a new pipeline', to: '/create/pipeline', icon: <GitBranch size={16} /> },
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
