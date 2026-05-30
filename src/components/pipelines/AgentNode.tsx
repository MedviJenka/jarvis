import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

interface NodeData {
  label: string;
  agentName: string;
  description: string;
  stepNumber: number;
  isFirst: boolean;
  isLast: boolean;
  [key: string]: unknown;
}

export function AgentNode({ data }: NodeProps) {
  const d = data as NodeData;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 w-52 shadow-xl">
      {!d.isFirst && <Handle type="target" position={Position.Top} className="!bg-indigo-500 !border-indigo-400" />}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
          {d.stepNumber}
        </span>
        <span className="text-white font-semibold text-sm">{d.label}</span>
      </div>
      <p className="text-slate-400 text-xs font-mono mb-1">{d.agentName}</p>
      <p className="text-slate-500 text-xs leading-relaxed">{d.description}</p>
      {!d.isLast && <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !border-indigo-400" />}
    </div>
  );
}
