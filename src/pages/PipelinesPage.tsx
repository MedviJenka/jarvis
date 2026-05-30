import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { GlassCard } from '../components/ui/GlassCard';
import { PipelineFlow } from '../components/pipelines/PipelineFlow';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { usePipelines } from '../hooks/usePipelines';
import type { Pipeline } from '../types';

export function PipelinesPage() {
  const { pipelines, loading, error } = usePipelines();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Pipeline | null>(null);

  const displayPipeline = selected ?? pipelines[0] ?? null;

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size={32} /></div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div>
      <TopBar
        title="Pipelines"
        subtitle="Multi-agent sequential workflows"
        action={
          <button onClick={() => navigate('/create/pipeline')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors">
            <Plus size={14} /> New Pipeline
          </button>
        }
      />
      <div className="p-8 flex gap-6 h-[calc(100vh-100px)]">
        <div className="w-64 flex-shrink-0 space-y-2">
          {pipelines.map(p => (
            <GlassCard
              key={p.name}
              onClick={() => setSelected(p)}
              className={`p-4 transition-all ${displayPipeline?.name === p.name ? 'border-indigo-500/50 bg-indigo-900/10' : 'hover:border-slate-600'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-sm text-white">/{p.name}</span>
                {p.is_custom && <span className="text-xs text-purple-400 bg-purple-900/30 border border-purple-700/40 rounded-full px-2">custom</span>}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
              <p className="text-xs text-indigo-400 mt-2">{p.steps.length} steps</p>
            </GlassCard>
          ))}
        </div>

        <div className="flex-1">
          {displayPipeline ? (
            <div className="h-full flex flex-col gap-4">
              <GlassCard className="p-4">
                <h2 className="font-mono text-white text-lg">/{displayPipeline.name}</h2>
                <p className="text-sm text-slate-400 mt-1">{displayPipeline.description}</p>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {displayPipeline.steps.map(s => s.label).join(' -> ')}
                </p>
              </GlassCard>
              <div className="flex-1">
                <PipelineFlow pipeline={displayPipeline} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              Select a pipeline to view its DAG
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
