import React from 'react';

const MODEL_STYLES: Record<string, string> = {
  opus: 'bg-violet-900/50 text-violet-300 border border-violet-700/50',
  sonnet: 'bg-blue-900/50 text-blue-300 border border-blue-700/50',
  haiku: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
};

interface Props { model: string }

export function ModelBadge({ model }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${MODEL_STYLES[model] ?? MODEL_STYLES.sonnet}`}>
      {model}
    </span>
  );
}
