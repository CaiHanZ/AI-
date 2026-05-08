export type EvidenceFilter = {
  stage: string;
  syndrome: string;
  therapy: string;
  formula: string;
  outcome: string;
  studyType: string;
};

export type Literature = {
  id: string;
  title: string;
  journal: string;
  year: string;
  tags: string[];
  abstract: string;
};

export type EvidenceUnit = {
  id: string;
  title: string;
  journal: string;
  syndrome: string;
  therapy: string;
  intervention: string;
  formula: string;
  outcome: string;
  studyType: string;
  sourceText: string;
};

export type GraphNode = {
  id: string;
  label: string;
  type: 'disease' | 'stage' | 'syndrome' | 'therapy' | 'formula' | 'outcome' | 'study';
  evidenceIds?: string[];
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type SummaryTask = 'summary' | 'basis' | 'pattern';

export type GeneratedSummary = {
  taskType: SummaryTask;
  content: string;
  references: EvidenceUnit[];
};

export type SourceTrace = {
  id: string;
  title: string;
  journal: string;
  sourceText: string;
  fields: Record<string, string>;
};
