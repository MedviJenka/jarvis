import type { Agent, Skill, Command, Pipeline, DashboardStats, AgentCreateRequest, PipelineCreateRequest } from '../types';

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
  getAgents: () => req<{ agents: Agent[]; total: number }>('/api/v1/agents/'),
  getAgent: (name: string) => req<Agent>(`/api/v1/agents/${name}`),
  getSkills: () => req<{ skills: Skill[]; total: number }>('/api/v1/skills/'),
  getCommands: () => req<{ commands: Command[]; total: number }>('/api/v1/commands/'),
  getPipelines: () => req<{ pipelines: Pipeline[]; total: number }>('/api/v1/pipelines/'),
  getStats: () => req<DashboardStats>('/api/v1/stats/'),
  createAgent: (body: AgentCreateRequest) => req<{ agent: Agent; files_created: string[] }>('/api/v1/agents/create', { method: 'POST', body: JSON.stringify(body) }),
  createPipeline: (body: PipelineCreateRequest) => req<{ pipeline: Pipeline; file_created: string }>('/api/v1/pipelines/create', { method: 'POST', body: JSON.stringify(body) }),
};
