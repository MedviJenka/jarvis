export type AgentCategory = 'backend' | 'review' | 'infrastructure' | 'frontend' | 'domain' | 'testing' | 'bizdev';
export type AgentModel = 'opus' | 'sonnet' | 'haiku';
export type AgentStatus = 'healthy' | 'degraded' | 'error' | 'deprecated' | 'unknown';
export type RunStatus = 'running' | 'success' | 'error';

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
  status: AgentStatus;
  run_count: number;
  error_count: number;
  last_run_at: string | null;
}

export interface AgentRun {
  id: string;
  agent_name: string;
  triggered_by: string | null;
  status: RunStatus;
  input_summary: string | null;
  output_summary: string | null;
  error_msg: string | null;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
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
  last_synced: string | null;
  health_breakdown: Record<string, number>;
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

export interface LogRunRequest {
  agent_name: string;
  triggered_by?: string;
  input_summary?: string;
}

export interface FinishRunRequest {
  status: 'success' | 'error';
  output_summary?: string;
  error_msg?: string;
}
