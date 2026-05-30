import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Pipeline } from '../../types';
import { AgentNode } from './AgentNode';
import { buildPipelineNodes, buildPipelineEdges } from '../../utils/flowLayout';

const nodeTypes = { agentNode: AgentNode };

interface Props { pipeline: Pipeline }

export function PipelineFlow({ pipeline }: Props) {
  const nodes = useMemo(() => buildPipelineNodes(pipeline), [pipeline]);
  const edges = useMemo(() => buildPipelineEdges(pipeline), [pipeline]);

  return (
    <div className="h-full w-full bg-slate-900 rounded-xl overflow-hidden" style={{ minHeight: 400 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" variant={BackgroundVariant.Dots} gap={20} />
        <Controls showInteractive={false} className="!bg-slate-800 !border-slate-700" />
      </ReactFlow>
    </div>
  );
}
