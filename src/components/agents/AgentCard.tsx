import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Terminal } from 'lucide-react';
import type { Agent } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { CategoryBadge } from '../ui/CategoryBadge';
import { ModelBadge } from '../ui/ModelBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { CATEGORY_COLORS } from '../../utils/categoryColors';

interface Props { agent: Agent }

export function AgentCard({ agent }: Props) {
  const navigate = useNavigate();
  const colors = CATEGORY_COLORS[agent.category] ?? CATEGORY_COLORS.domain;

  return (
    <GlassCard
      onClick={() => navigate(`/agents/${agent.name}`)}
      className={`p-5 transition-all duration-200 ${colors.border} hover:bg-slate-800/80 group`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <CategoryBadge category={agent.category} />
        <div className="flex items-center gap-1.5">
          <StatusBadge status={agent.status} />
          <ModelBadge model={agent.model} />
        </div>
      </div>
      <h3 className="font-mono text-sm font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
        {agent.name}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
        {agent.description}
      </p>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        {agent.tools.length > 0 && (
          <span className="flex items-center gap-1">
            <Wrench size={11} />
            {agent.tools.length} tools
          </span>
        )}
        {agent.linked_commands.length > 0 && (
          <span className="flex items-center gap-1">
            <Terminal size={11} />
            {agent.linked_commands.map(c => `/${c}`).join(', ')}
          </span>
        )}
        {agent.has_memory && (
          <span className="text-indigo-400">● memory</span>
        )}
        {agent.run_count > 0 && (
          <span className="ml-auto text-slate-600">{agent.run_count} runs</span>
        )}
      </div>
    </GlassCard>
  );
}
