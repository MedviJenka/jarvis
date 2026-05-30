import React from 'react';
import type { AgentStatus, RunStatus } from '../../types';

const STATUS_STYLES: Record<string, string> = {
  healthy:    'bg-green-900/30 text-green-400 border-green-700/40',
  degraded:   'bg-yellow-900/30 text-yellow-400 border-yellow-700/40',
  error:      'bg-red-900/30 text-red-400 border-red-700/40',
  deprecated: 'bg-slate-700/40 text-slate-500 border-slate-600/40',
  unknown:    'bg-slate-800/40 text-slate-500 border-slate-700/40',
  running:    'bg-blue-900/30 text-blue-400 border-blue-700/40',
  success:    'bg-green-900/30 text-green-400 border-green-700/40',
};

const STATUS_DOT: Record<string, string> = {
  healthy:    'bg-green-400',
  degraded:   'bg-yellow-400',
  error:      'bg-red-400',
  deprecated: 'bg-slate-500',
  unknown:    'bg-slate-600',
  running:    'bg-blue-400 animate-pulse',
  success:    'bg-green-400',
};

interface Props {
  status: AgentStatus | RunStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.unknown;
  const dot = STATUS_DOT[status] ?? STATUS_DOT.unknown;
  const text = size === 'md' ? 'text-xs' : 'text-[10px]';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${style} ${text} font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
