import type {
  Agent, Skill, Command, Pipeline, DashboardStats,
  AgentCreateRequest, PipelineCreateRequest,
  AgentRun, LogRunRequest, FinishRunRequest,
} from '../types';

const BASE = process.env.REACT_APP_API_URL ?? 'http://localhost:8000';

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error((err as any).detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Agents
  getAgents: () => req<{ agents: Agent[]; total: number }>('/api/v1/agents/'),
  getAgent: (name: string) => req<Agent>(`/api/v1/agents/${name}`),
  createAgent: (body: AgentCreateRequest) =>
    req<{ agent: Agent; files_created: string[] }>('/api/v1/agents/create', { method: 'POST', body: JSON.stringify(body) }),
  overrideAgentStatus: (name: string, status: string, note?: string) =>
    req<{ ok: boolean }>(`/api/v1/agents/${name}/status`, { method: 'POST', body: JSON.stringify({ status, note }) }),

  // Skills, Commands, Pipelines
  getSkills: () => req<{ skills: Skill[]; total: number }>('/api/v1/skills/'),
  getCommands: () => req<{ commands: Command[]; total: number }>('/api/v1/commands/'),
  getPipelines: () => req<{ pipelines: Pipeline[]; total: number }>('/api/v1/pipelines/'),
  createPipeline: (body: PipelineCreateRequest) =>
    req<{ pipeline: Pipeline; file_created: string }>('/api/v1/pipelines/create', { method: 'POST', body: JSON.stringify(body) }),

  // Stats + Sync
  getStats: () => req<DashboardStats>('/api/v1/stats/'),
  syncAgents: () => req<{ success: boolean; output: string; synced_at: string | null }>('/api/v1/sync', { method: 'POST' }),

  // Runs
  logRun: (body: LogRunRequest) =>
    req<AgentRun>('/api/v1/runs/', { method: 'POST', body: JSON.stringify(body) }),
  finishRun: (runId: string, body: FinishRunRequest) =>
    req<AgentRun>(`/api/v1/runs/${runId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getRuns: (agentName?: string, limit = 50) =>
    req<{ runs: AgentRun[]; total: number }>(`/api/v1/runs/?${agentName ? `agent_name=${agentName}&` : ''}limit=${limit}`),
};
