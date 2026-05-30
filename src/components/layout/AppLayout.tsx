import React from 'react';
import { Sidebar } from './Sidebar';

interface Props { children: React.ReactNode }

export function AppLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
