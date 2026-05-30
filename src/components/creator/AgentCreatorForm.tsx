import React, { useState } from 'react';
import type { AgentCategory, AgentCreateRequest, AgentModel } from '../../types';
import { CATEGORY_LABELS } from '../../utils/categoryColors';

const AVAILABLE_TOOLS = ['Glob', 'Grep', 'Read', 'Edit', 'Write', 'Bash', 'WebFetch', 'WebSearch', 'Agent'];
const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as AgentCategory[];

interface Props {
  onSubmit: (req: AgentCreateRequest) => Promise<void>;
  loading: boolean;
}

export function AgentCreatorForm({ onSubmit, loading }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AgentCategory>('backend');
  const [model, setModel] = useState<AgentModel>('sonnet');
  const [tools, setTools] = useState<string[]>(['Glob', 'Grep', 'Read']);
  const [extraContext, setExtraContext] = useState('');

  const toggleTool = (tool: string) => {
    setTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, category, tools, model, extra_context: extraContext });
  };

  const inputCls = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";
  const labelCls = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelCls}>Agent Name (slug)</label>
        <input value={name} onChange={e => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          placeholder="e.g. my-custom-agent" className={inputCls} required />
      </div>
      <div>
        <label className={labelCls}>Description — what should this agent do?</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          rows={3} placeholder="Describe the agent's purpose, responsibilities, and when to use it..."
          className={inputCls} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value as AgentCategory)} className={inputCls}>
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Model</label>
          <select value={model} onChange={e => setModel(e.target.value as AgentModel)} className={inputCls}>
            <option value="opus">Opus (architect/planner)</option>
            <option value="sonnet">Sonnet (reviewer/specialist)</option>
            <option value="haiku">Haiku (simple tasks)</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Tools</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TOOLS.map(tool => (
            <button key={tool} type="button" onClick={() => toggleTool(tool)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                tools.includes(tool)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
              }`}>
              {tool}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelCls}>Extra Context (optional)</label>
        <textarea value={extraContext} onChange={e => setExtraContext(e.target.value)}
          rows={2} placeholder="Any specific patterns, constraints, or project context..."
          className={inputCls} />
      </div>
      <button type="submit" disabled={loading || !name || !description}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating agent with AI...
          </>
        ) : 'Create Agent with CrewAI'}
      </button>
    </form>
  );
}
