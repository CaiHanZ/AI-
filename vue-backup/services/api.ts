import type {
  EvidenceFilter,
  EvidenceUnit,
  GeneratedSummary,
  GraphEdge,
  GraphNode,
  Literature,
  SourceTrace,
  SummaryTask,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) {
    throw new Error('未配置 VITE_API_BASE_URL，当前使用前端兜底示例数据。');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`接口请求失败：${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function searchLiterature(params: EvidenceFilter) {
  return request<Literature[]>('/literature/search', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function extractEvidence(literatureIds: string[]) {
  return request<EvidenceUnit[]>('/evidence/extract', {
    method: 'POST',
    body: JSON.stringify({ literatureIds }),
  });
}

export function createEvidenceChain(evidenceIds: string[]) {
  return request<{ chainId: string; evidence: EvidenceUnit[] }>('/evidence-chains', {
    method: 'POST',
    body: JSON.stringify({ evidenceIds }),
  });
}

export function updateEvidenceChain(chainId: string, payload: { evidence: EvidenceUnit[] }) {
  return request<{ ok: boolean }>(`/evidence-chains/${chainId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function getEvidenceGraph(chainId: string) {
  return request<{ nodes: GraphNode[]; edges: GraphEdge[] }>(`/evidence-chains/${chainId}/graph`);
}

export function generateSummary(chainId: string, taskType: SummaryTask) {
  return request<GeneratedSummary>(`/evidence-chains/${chainId}/summary`, {
    method: 'POST',
    body: JSON.stringify({ taskType }),
  });
}

export function getSourceTrace(evidenceId: string) {
  return request<SourceTrace>(`/evidence/${evidenceId}/source-trace`);
}
