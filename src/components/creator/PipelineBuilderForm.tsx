import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { PipelineCreateRequest, PipelineStep } from '../../types';

interface Props {
  agents: string[];
  onSubmit: (req: PipelineCreateRequest) => Promise<void>;
  loading: boolean;
}

export function PipelineBuilderForm({ agents, onSubmit, loading }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<PipelineStep[]>([
    { agent_name: '', label: '', description: '' },
  ]);

  const addStep = () => setSteps(prev => [...prev, { agent_name: '', label: '', description: '' }]);
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: keyof PipelineStep, value: string) => {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, steps });
  };

  const inputCls = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Pipeline Name</label>
          <input value={name} onChange={e => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="e.g. review-and-ship" className={inputCls} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)}
            placeholder="What does this pipeline do?" className={inputCls} required />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-300">Steps ({steps.length})</label>
          <button type="button" onClick={addStep}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            <Plus size={14} /> Add Step
          </button>
        </div>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <GripVertical size={14} className="text-slate-600" />
                <span className="text-xs font-bold text-indigo-400 w-6">#{i + 1}</span>
                <button type="button" onClick={() => removeStep(i)}
                  className="ml-auto text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Agent</label>
                  <select value={step.agent_name} onChange={e => updateStep(i, 'agent_name', e.target.value)} className={inputCls} required>
                    <option value="">Select agent...</option>
                    {agents.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Label</label>
                  <input value={step.label} onChange={e => updateStep(i, 'label', e.target.value)}
                    placeholder="e.g. Reviewer" className={inputCls} required />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Description</label>
                  <input value={step.description} onChange={e => updateStep(i, 'description', e.target.value)}
                    placeholder="What this step does" className={inputCls} required />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading || !name || steps.some(s => !s.agent_name)}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Pipeline...</>
        ) : 'Create Pipeline'}
      </button>
    </form>
  );
}
