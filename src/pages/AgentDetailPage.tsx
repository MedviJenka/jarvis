import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Wrench, Terminal, Database, FileText, Activity, Play } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { GlassCard } from '../components/ui/GlassCard';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import { ModelBadge } from '../components/ui/ModelBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../api/client';
import { useRuns } from '../hooks/useRuns';
import type { Agent, RunStatus } from '../types';

function formatDuration(ms: number | null): string {
  if (ms === null) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function LogRunModal({ agentName, onClose, onLogged }: { agentName: string; onClose: () => void; onLogged: () => void }) {
  const [triggeredBy, setTriggeredBy] = useState('');
  const [inputSummary, setInputSummary] = useState('');
  const [runStatus, setRunStatus] = useState<'success' | 'error'>('success');
  const [outputSummary, setOutputSummary] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const run = await api.logRun({ agent_name: agentName, triggered_by: triggeredBy || undefined, input_summary: inputSummary || undefined });
      await api.finishRun(run.id, { status: runStatus, output_summary: outputSummary || undefined, error_msg: errorMsg || undefined });
      onLogged();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
      <GlassCard className="p-6 w-full max-w-md">
        <h3 className="text-sm font-semibold text-white mb-4">Log Run — <span className="font-mono text-indigo-300">{agentName}</span></h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Triggered by</label>
            <input value={triggeredBy} onChange={e => setTriggeredBy(e.target.value)}
              placeholder="your name or system"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Input summary</label>
            <input value={inputSummary} onChange={e => setInputSummary(e.target.value)}
              placeholder="what was the input / task?"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Result</label>
            <div className="flex gap-2">
              {(['success', 'error'] as const).map(s => (
                <button key={s} onClick={() => setRunStatus(s)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${runStatus === s ? (s === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white') : 'bg-slate-700 text-slate-400'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {runStatus === 'error' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Error message</label>
              <input value={errorMsg} onChange={e => setErrorMsg(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200" />
            </div>
          )}
          {runStatus === 'success' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Output summary</label>
              <input value={outputSummary} onChange={e => setOutputSummary(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200" />
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={submit} disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save run'}
          </button>
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
        </div>
      </GlassCard>
      </div>
    </div>
  );
}

export function AgentDetailPage() {
  const { name } = useParams<{ name: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogRun, setShowLogRun] = useState(false);
  const { runs, loading: runsLoading, refetch: refetchRuns } = useRuns(name, 20);

  const fetchAgent = () => {
    if (!name) return;
    setLoading(true);
    api.getAgent(name)
      .then(setAgent)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAgent, [name]);

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size={32} /></div>;
  if (error || !agent) return <div className="p-8 text-red-400">{error ?? 'Agent not found'}</div>;

  return (
    <div>
      {showLogRun && (
        <LogRunModal
          agentName={agent.name}
          onClose={() => setShowLogRun(false)}
          onLogged={() => { refetchRuns(); fetchAgent(); }}
        />
      )}
      <TopBar title={agent.name} subtitle={`/${agent.linked_commands[0] ?? agent.name}`} backTo="/agents" />
      <div className="p-8 space-y-4 max-w-4xl">

        <GlassCard className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={agent.category} size="md" />
              <ModelBadge model={agent.model} />
              <StatusBadge status={agent.status} size="md" />
              {agent.has_memory && <span className="text-xs text-indigo-400 border border-indigo-500/30 bg-indigo-900/20 rounded-full px-2 py-0.5">memory</span>}
            </div>
            <button
              onClick={() => setShowLogRun(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-700/40 rounded-lg transition-colors"
            >
              <Play size={11} /> Log run
            </button>
          </div>
          <h2 className="font-mono text-xl text-white mb-2">{agent.name}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">{agent.description}</p>
          {agent.run_count > 0 && (
            <div className="flex gap-4 text-xs text-slate-500 pt-3 border-t border-slate-700/40">
              <span>{agent.run_count} total runs</span>
              {agent.error_count > 0 && <span className="text-red-400">{agent.error_count} errors</span>}
              {agent.last_run_at && <span>Last run {formatTime(agent.last_run_at)}</span>}
            </div>
          )}
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

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <Activity size={14} /><span className="text-xs font-medium uppercase tracking-wide">Recent Runs</span>
          </div>
          {runsLoading && <LoadingSpinner size={20} />}
          {!runsLoading && runs.length === 0 && (
            <p className="text-xs text-slate-600">No runs logged yet. Use the "Log run" button to record executions.</p>
          )}
          {!runsLoading && runs.length > 0 && (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700/40">
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Triggered by</th>
                  <th className="text-left py-2">Input</th>
                  <th className="text-left py-2">Started</th>
                  <th className="text-right py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {runs.map(run => (
                  <tr key={run.id} className="border-b border-slate-800/40 hover:bg-slate-700/10">
                    <td className="py-2"><StatusBadge status={run.status} /></td>
                    <td className="py-2 text-slate-400">{run.triggered_by ?? '—'}</td>
                    <td className="py-2 text-slate-500 max-w-xs truncate">{run.input_summary ?? '—'}</td>
                    <td className="py-2 text-slate-400">{formatTime(run.started_at)}</td>
                    <td className="py-2 text-right text-slate-400">{formatDuration(run.duration_ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
