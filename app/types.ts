export type Screen = 'home' | 'search' | 'edit' | 'graph' | 'summary';

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
