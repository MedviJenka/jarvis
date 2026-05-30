import type { AgentCategory } from '../types';

export const CATEGORY_COLORS: Record<AgentCategory, { badge: string; border: string; dot: string; text: string }> = {
  backend:        { badge: 'bg-purple-900/50 text-purple-300 border border-purple-700/50', border: 'hover:border-purple-500/50', dot: 'bg-purple-400', text: 'text-purple-300' },
  review:         { badge: 'bg-orange-900/50 text-orange-300 border border-orange-700/50', border: 'hover:border-orange-500/50', dot: 'bg-orange-400', text: 'text-orange-300' },
  infrastructure: { badge: 'bg-sky-900/50 text-sky-300 border border-sky-700/50',          border: 'hover:border-sky-500/50',    dot: 'bg-sky-400',    text: 'text-sky-300' },
  frontend:       { badge: 'bg-pink-900/50 text-pink-300 border border-pink-700/50',       border: 'hover:border-pink-500/50',   dot: 'bg-pink-400',   text: 'text-pink-300' },
  domain:         { badge: 'bg-amber-900/50 text-amber-300 border border-amber-700/50',    border: 'hover:border-amber-500/50',  dot: 'bg-amber-400',  text: 'text-amber-300' },
  testing:        { badge: 'bg-green-900/50 text-green-300 border border-green-700/50',    border: 'hover:border-green-500/50',  dot: 'bg-green-400',  text: 'text-green-300' },
  bizdev:         { badge: 'bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-700/50', border: 'hover:border-fuchsia-500/50', dot: 'bg-fuchsia-400', text: 'text-fuchsia-300' },
};

export const CATEGORY_LABELS: Record<AgentCategory, string> = {
  backend: 'Backend',
  review: 'Code Review',
  infrastructure: 'Infrastructure',
  frontend: 'Frontend',
  domain: 'Domain',
  testing: 'Testing',
  bizdev: 'Biz Dev',
};
