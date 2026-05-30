import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileText } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { GlassCard } from '../components/ui/GlassCard';
import { AgentCreatorForm } from '../components/creator/AgentCreatorForm';
import { api } from '../api/client';
import type { AgentCreateRequest } from '../types';

export function AgentCreatorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ agent: { name: string }; files_created: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (req: AgentCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.createAgent(req);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopBar title="Create Agent" subtitle="Generate a new Claude sub-agent with AI" backTo="/agents" />
      <div className="p-8 max-w-2xl">
        {result ? (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 text-green-400 mb-4">
              <CheckCircle size={20} />
              <span className="font-medium">Agent created successfully!</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Agent <span className="font-mono text-white">{result.agent.name}</span> has been generated and saved.
            </p>
            <div className="space-y-2 mb-6">
              {result.files_created.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-900/50 rounded-lg px-3 py-2">
                  <FileText size={12} className="text-indigo-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate(`/agents/${result.agent.name}`)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors">
                View Agent
              </button>
              <button onClick={() => { setResult(null); setError(null); }}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                Create Another
              </button>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-6">
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Describe the agent you want to create. A CrewAI crew will design the specification and generate
              the agent file, skill file, and command file automatically.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700/40 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}
            <AgentCreatorForm onSubmit={handleSubmit} loading={loading} />
          </GlassCard>
        )}
      </div>
    </div>
  );
}
