import { defineStore } from 'pinia';
import {
  createEvidenceChain,
  extractEvidence,
  generateSummary,
  getEvidenceGraph,
  getSourceTrace,
  searchLiterature,
  updateEvidenceChain,
} from '../services/api';
import { fallbackEvidence, fallbackGraph, fallbackLiterature } from '../data/fallback';
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

const defaultFilter: EvidenceFilter = {
  stage: '恢复期',
  syndrome: '气虚痰瘀证',
  therapy: '益气活血',
  formula: '补阳还五汤',
  outcome: 'NIHSS',
  studyType: '',
};

function localSummary(taskType: SummaryTask, evidence: EvidenceUnit[]): GeneratedSummary {
  const refText = evidence.slice(0, 3).map((item) => `【${item.id}】`).join('、');
  const contentByTask: Record<SummaryTask, string> = {
    summary:
      `多项结构化证据提示，缺血性脑卒中恢复期相关证型以气虚痰瘀证和气虚血瘀证较为集中，益气活血、活血通络及针刺干预均显示出改善神经功能和日常生活能力的趋势 ${refText}。其中补阳还五汤加减与常规治疗联用可降低NIHSS评分并提升Barthel指数，系统综述结果进一步支持针刺方案对总有效率的改善。`,
    basis:
      `现有证据已经形成“证型-治法-方药-疗效指标”的可追溯链条，但研究类型、证型粒度和疗效指标仍存在异质性 ${refText}。因此，围绕缺血性脑卒中恢复期构建结构化证据库，有助于提高课题立项时的证据组织效率和原文回溯能力。`,
    pattern:
      `当前证据链显示，气虚相关证型多对应益气活血类治法，方药以补阳还五汤、脑心通胶囊为代表；风痰阻络证更偏向化痰通络策略。疗效观察集中于NIHSS、Barthel、Fugl-Meyer和总有效率等指标 ${refText}。`,
  };

  return {
    taskType,
    content: contentByTask[taskType],
    references: evidence,
  };
}

export const useEvidenceStore = defineStore('evidence', {
  state: () => ({
    filters: { ...defaultFilter } as EvidenceFilter,
    literature: [] as Literature[],
    selectedLiteratureIds: [] as string[],
    chainId: 'local-v1-chain',
    evidenceChain: [] as EvidenceUnit[],
    graphNodes: [] as GraphNode[],
    graphEdges: [] as GraphEdge[],
    summary: null as GeneratedSummary | null,
    sourceTrace: null as SourceTrace | null,
    loading: false,
    error: '',
    notice: '',
  }),
  getters: {
    selectedLiterature(state) {
      return state.literature.filter((item) => state.selectedLiteratureIds.includes(item.id));
    },
  },
  actions: {
    setFilter(key: keyof EvidenceFilter, value: string) {
      this.filters[key] = value;
    },
    toggleLiterature(id: string) {
      if (this.selectedLiteratureIds.includes(id)) {
        this.selectedLiteratureIds = this.selectedLiteratureIds.filter((item) => item !== id);
      } else {
        this.selectedLiteratureIds.push(id);
      }
    },
    async runSearch() {
      this.loading = true;
      this.error = '';
      try {
        this.literature = await searchLiterature(this.filters);
        this.notice = '已从后端接口获取检索结果。';
      } catch (error) {
        this.literature = fallbackLiterature;
        this.notice = error instanceof Error ? error.message : '后端不可用，已显示兜底示例数据。';
      } finally {
        this.loading = false;
      }
    },
    async buildChain() {
      this.loading = true;
      this.error = '';
      const ids = this.selectedLiteratureIds.length ? this.selectedLiteratureIds : fallbackLiterature.map((item) => item.id);
      try {
        const evidence = await extractEvidence(ids);
        const created = await createEvidenceChain(evidence.map((item) => item.id));
        this.chainId = created.chainId;
        this.evidenceChain = created.evidence.length ? created.evidence : evidence;
        this.notice = '证据链已由后端生成。';
      } catch (error) {
        this.evidenceChain = fallbackEvidence.filter((item) => ids.includes(item.id));
        if (!this.evidenceChain.length) this.evidenceChain = [...fallbackEvidence];
        this.notice = error instanceof Error ? error.message : '后端不可用，已生成本地示例证据链。';
      } finally {
        this.loading = false;
      }
    },
    updateEvidence(index: number, patch: Partial<EvidenceUnit>) {
      this.evidenceChain[index] = { ...this.evidenceChain[index], ...patch };
    },
    removeEvidence(id: string) {
      this.evidenceChain = this.evidenceChain.filter((item) => item.id !== id);
    },
    moveEvidence(id: string, direction: -1 | 1) {
      const index = this.evidenceChain.findIndex((item) => item.id === id);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= this.evidenceChain.length) return;
      const clone = [...this.evidenceChain];
      [clone[index], clone[next]] = [clone[next], clone[index]];
      this.evidenceChain = clone;
    },
    async saveChain() {
      this.loading = true;
      this.error = '';
      try {
        await updateEvidenceChain(this.chainId, { evidence: this.evidenceChain });
        this.notice = '证据链已保存到后端。';
      } catch (error) {
        this.notice = error instanceof Error ? error.message : '后端不可用，当前修改保留在前端会话中。';
      } finally {
        this.loading = false;
      }
    },
    async loadGraph() {
      this.loading = true;
      this.error = '';
      try {
        const graph = await getEvidenceGraph(this.chainId);
        this.graphNodes = graph.nodes;
        this.graphEdges = graph.edges;
        this.notice = '图谱已从后端加载。';
      } catch (error) {
        this.graphNodes = fallbackGraph.nodes;
        this.graphEdges = fallbackGraph.edges;
        this.notice = error instanceof Error ? error.message : '后端不可用，已显示本地图谱示例。';
      } finally {
        this.loading = false;
      }
    },
    async runSummary(taskType: SummaryTask) {
      this.loading = true;
      this.error = '';
      try {
        this.summary = await generateSummary(this.chainId, taskType);
        this.notice = '摘要已由后端生成。';
      } catch (error) {
        const evidence = this.evidenceChain.length ? this.evidenceChain : fallbackEvidence;
        this.summary = localSummary(taskType, evidence);
        this.notice = error instanceof Error ? error.message : '后端不可用，已显示本地受约束生成示例。';
      } finally {
        this.loading = false;
      }
    },
    async openSource(id: string) {
      this.loading = true;
      try {
        this.sourceTrace = await getSourceTrace(id);
      } catch {
        const evidence = [...this.evidenceChain, ...fallbackEvidence].find((item) => item.id === id) || fallbackEvidence[0];
        this.sourceTrace = {
          id: evidence.id,
          title: evidence.title,
          journal: evidence.journal,
          sourceText: evidence.sourceText,
          fields: {
            证型: evidence.syndrome,
            治法: evidence.therapy,
            干预: evidence.intervention,
            方药: evidence.formula,
            疗效指标: evidence.outcome,
            研究类型: evidence.studyType,
          },
        };
      } finally {
        this.loading = false;
      }
    },
    closeSource() {
      this.sourceTrace = null;
    },
  },
});
