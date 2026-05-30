import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { AgentCard } from '../components/agents/AgentCard';
import { AgentSearch } from '../components/agents/AgentSearch';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useAgents } from '../hooks/useAgents';
import type { AgentCategory } from '../types';

export function AgentGalleryPage() {
  const { agents, loading, error } = useAgents();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | null>(null);

  const filtered = useMemo(() => {
    return agents.filter(a => {
      const matchesQuery = !query || a.name.includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase());
      const matchesCat = !selectedCategory || a.category === selectedCategory;
      return matchesQuery && matchesCat;
    });
  }, [agents, query, selectedCategory]);

  return (
    <div>
      <TopBar
        title="Agent Gallery"
        subtitle={`${agents.length} agents`}
        action={
          <button onClick={() => navigate('/create/agent')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors">
            <Plus size={14} /> New Agent
          </button>
        }
      />
      <div className="p-8">
        <AgentSearch
          query={query}
          onQueryChange={setQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size={32} /></div>
        ) : error ? (
          <div className="text-red-400 text-sm text-center py-8">{error}</div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No agents match your search" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(agent => <AgentCard key={agent.name} agent={agent} />)}
          </div>
        )}
      </div>
    </div>
  );
}
