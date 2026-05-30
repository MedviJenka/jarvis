import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, GitBranch, Plus, Workflow, Cpu } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/agents', label: 'Agents', icon: Bot },
  { to: '/pipelines', label: 'Pipelines', icon: GitBranch },
  { to: '/create/agent', label: 'New Agent', icon: Plus },
  { to: '/create/pipeline', label: 'New Pipeline', icon: Workflow },
];

export function Sidebar() {
  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="text-indigo-400" size={22} />
          <span className="font-bold text-lg text-white tracking-tight">Jarvis</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Agent Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-600">Claude Code Agents</p>
      </div>
    </aside>
  );
}
