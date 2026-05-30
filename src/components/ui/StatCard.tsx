import React from 'react';
import { GlassCard } from './GlassCard';

interface Props { label: string; value: number; icon: React.ReactNode; color: string }

export function StatCard({ label, value, icon, color }: Props) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-slate-700/50 ${color}`}>{icon}</div>
      </div>
    </GlassCard>
  );
}
