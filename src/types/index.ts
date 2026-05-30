export type AgentCategory = 'backend' | 'review' | 'infrastructure' | 'frontend' | 'domain' | 'testing' | 'bizdev';
export type AgentModel = 'opus' | 'sonnet' | 'haiku';

export interface Agent {
  name: string;
  description: string;
  description_full: string;
  category: AgentCategory;
  model: AgentModel;
  color: string;
  tools: string[];
  memory_type: string;
  skill?: string;
  system_prompt_preview: string;
  linked_commands: string[];
  has_memory: boolean;
}

export interface Skill {
  name: string;
  description: string;
  body: string;
}

export interface Command {
  name: string;
  description: string;
  body: string;
  agent_refs: string[];
  is_pipeline: boolean;
}

export interface PipelineStep {
  agent_name: string;
  label: string;
  description: string;
}

export interface Pipeline {
  name: string;
  description: string;
  steps: PipelineStep[];
  command_file: string;
  is_custom: boolean;
}

export interface DashboardStats {
  agent_count: number;
  skill_count: number;
  command_count: number;
  pipeline_count: number;
  category_breakdown: Record<string, number>;
  model_breakdown: Record<string, number>;
}

export interface AgentCreateRequest {
  name: string;
  description: string;
  category: AgentCategory;
  tools: string[];
  model: AgentModel;
  extra_context: string;
}

export interface PipelineCreateRequest {
  name: string;
  description: string;
  steps: PipelineStep[];
}
