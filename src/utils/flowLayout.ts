import type { Node, Edge } from '@xyflow/react';
import type { Pipeline } from '../types';

export function buildPipelineNodes(pipeline: Pipeline): Node[] {
  return pipeline.steps.map((step, index) => ({
    id: `${step.agent_name}-${index}`,
    type: 'agentNode',
    position: { x: 200, y: index * 180 },
    data: {
      label: step.label,
      agentName: step.agent_name,
      description: step.description,
      stepNumber: index + 1,
      isFirst: index === 0,
      isLast: index === pipeline.steps.length - 1,
    },
  }));
}

export function buildPipelineEdges(pipeline: Pipeline): Edge[] {
  return pipeline.steps.slice(0, -1).map((step, index) => ({
    id: `e-${index}`,
    source: `${step.agent_name}-${index}`,
    target: `${pipeline.steps[index + 1].agent_name}-${index + 1}`,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
  }));
}
