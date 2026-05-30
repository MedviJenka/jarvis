import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Wrench, Terminal, Database, FileText } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { GlassCard } from '../components/ui/GlassCard';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import { ModelBadge } from '../components/ui/ModelBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../api/client';
import type { Agent } from '../types';

export function AgentDetailPage() {
  const { name } = useParams<{ name: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    api.getAgent(name)
      .then(setAgent)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size={32} /></div>;
  if (error || !agent) return <div className="p-8 text-red-400">{error ?? 'Agent not found'}</div>;

  return (
    <div>
      <TopBar title={agent.name} subtitle={`/${agent.linked_commands[0] ?? agent.name}`} backTo="/agents" />
      <div className="p-8 space-y-4 max-w-4xl">
        <GlassCard className="p-6">
          <div className="flex items-start gap-3 mb-3">
            <CategoryBadge category={agent.category} size="md" />
            <ModelBadge model={agent.model} />
            {agent.has_memory && <span className="text-xs text-indigo-400 border border-indigo-500/30 bg-indigo-900/20 rounded-full px-2 py-0.5">memory</span>}
          </div>
          <h2 className="font-mono text-xl text-white mb-2">{agent.name}</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{agent.description}</p>
        </GlassCard>

        {agent.tools.length > 0 && (
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Wrench size={14} /><span className="text-xs font-medium uppercase tracking-wide">Tools</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {agent.tools.map(t => (
                <span key={t} className="px-2 py-1 text-xs font-mono bg-slate-700 text-slate-300 rounded">{t}</span>
              ))}
            </div>
          </GlassCard>
        )}

        {agent.linked_commands.length > 0 && (
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <Terminal size={14} /><span className="text-xs font-medium uppercase tracking-wide">Linked Commands</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {agent.linked_commands.map(c => (
                <span key={c} className="px-3 py-1 text-xs font-mono bg-indigo-900/30 text-indigo-300 border border-indigo-700/40 rounded-full">/{c}</span>
              ))}
            </div>
          </GlassCard>
        )}

        {agent.system_prompt_preview && (
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <FileText size={14} /><span className="text-xs font-medium uppercase tracking-wide">System Prompt Preview</span>
            </div>
            <pre className="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap overflow-auto max-h-60 bg-slate-900/50 rounded-lg p-4">
              {agent.system_prompt_preview}
            </pre>
          </GlassCard>
        )}

        {agent.has_memory && (
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 text-indigo-400">
              <Database size={14} /><span className="text-sm">This agent has persistent memory across conversations</span>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
