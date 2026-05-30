import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  backTo?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, subtitle, backTo, action }: Props) {
  const navigate = useNavigate();
  return (
    <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
