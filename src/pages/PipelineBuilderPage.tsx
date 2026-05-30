import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { GlassCard } from '../components/ui/GlassCard';
import { PipelineBuilderForm } from '../components/creator/PipelineBuilderForm';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAgents } from '../hooks/useAgents';
import { api } from '../api/client';
import type { PipelineCreateRequest } from '../types';

export function PipelineBuilderPage() {
  const navigate = useNavigate();
  const { agents } = useAgents();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ pipeline: { name: string }; file_created: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (req: PipelineCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.createPipeline(req);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create pipeline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopBar title="Pipeline Builder" subtitle="Chain agents into a sequential workflow" backTo="/pipelines" />
      <div className="p-8 max-w-2xl">
        {result ? (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 text-green-400 mb-4">
              <CheckCircle size={20} />
              <span className="font-medium">Pipeline created!</span>
            </div>
            <p className="text-slate-400 text-sm mb-2">
              Pipeline <span className="font-mono text-white">/{result.pipeline.name}</span> saved to:
            </p>
            <p className="text-xs font-mono text-slate-500 bg-slate-900/50 rounded-lg px-3 py-2 mb-6">{result.file_created}</p>
            <div className="flex gap-3">
              <button onClick={() => navigate('/pipelines')}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors">
                View Pipelines
              </button>
              <button onClick={() => { setResult(null); setError(null); }}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                Build Another
              </button>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700/40 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}
            {agents.length === 0 ? (
              <div className="flex justify-center py-8"><LoadingSpinner size={24} /></div>
            ) : (
              <PipelineBuilderForm
                agents={agents.map(a => a.name)}
                onSubmit={handleSubmit}
                loading={loading}
              />
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
}
