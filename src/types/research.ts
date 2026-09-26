export interface KeyEquation {
  name: string;
  formula: string;
  description: string;
}

export interface CoreConcepts {
  problemStatement: string;
  methodology: string;
  algorithmicBreakthroughs: string;
  plainSummary: string;
  wordCount?: number;
  keyEquations?: KeyEquation[];
}

export interface FlowchartData {
  mermaidCode: string;
  labeledSegment?: string;
}

export interface ProjectMilestone {
  phase: string;
  focus: string;
  deliverables: string[];
}

export interface StudentProject {
  title: string;
  exactExtension: string;
  targetedMetric: string;
  recommendedTechStack: string[];
  difficulty: 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  resumeBullet: string;
  interviewTalkingPoint?: string;
  milestoneRoadmap?: ProjectMilestone[];
}

export interface PaperMeta {
  title: string;
  authors: string[];
  year: string;
  venue?: string;
  arxivId?: string;
  url?: string;
  oneSentenceHook?: string;
}

export interface PaperAnalysis {
  paperMeta: PaperMeta;
  coreConcepts: CoreConcepts;
  flowchart: FlowchartData;
  studentProjects: StudentProject[];
  rawAgentOutput?: string;
}

export interface TokenBudget {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  tokenLimit: number;
  utilizationPercent: number;
  isUnder25kLimit: boolean;
  status: string;
}

export interface PresetPaper {
  id: string;
  title: string;
  authors: string[];
  year: string;
  tag: string;
  arxivUrl: string;
  shortDesc: string;
  preloadedAnalysis?: PaperAnalysis;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}
