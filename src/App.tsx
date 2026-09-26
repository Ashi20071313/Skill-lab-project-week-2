import { useState } from 'react';
import { PaperAnalysis, TokenBudget, PresetPaper } from './types/research';
import { PRESET_PAPERS } from './data/presetPapers';
import { MermaidViewer } from './components/MermaidViewer';
import { CoreConceptView } from './components/CoreConceptView';
import { StudentProjectsView } from './components/StudentProjectsView';
import { TokenEfficiencyMonitor } from './components/TokenEfficiencyMonitor';
import { AgentQnAPanel } from './components/AgentQnAPanel';
import { RawAgentOutputModal } from './components/RawAgentOutputModal';
import {
  Brain,
  Search,
  Sparkles,
  BookOpen,
  GitBranch,
  GraduationCap,
  Terminal,
  Bot,
  ExternalLink,
  Loader2,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  FolderGit2,
} from 'lucide-react';

export default function App() {
  // Initial state loads the classic Attention Is All You Need analysis
  const [analysis, setAnalysis] = useState<PaperAnalysis>(
    PRESET_PAPERS[0].preloadedAnalysis!
  );
  const [tokenBudget, setTokenBudget] = useState<TokenBudget>({
    promptTokens: 1420,
    candidatesTokens: 2180,
    totalTokens: 3600,
    tokenLimit: 25000,
    utilizationPercent: 14.4,
    isUnder25kLimit: true,
    status: 'Optimal Efficiency',
  });

  const [paperUrlInput, setPaperUrlInput] = useState('');
  const [paperTitleInput, setPaperTitleInput] = useState('');
  const [paperTextInput, setPaperTextInput] = useState('');
  const [showAdvancedInput, setShowAdvancedInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'concepts' | 'flowchart' | 'projects' | 'raw' | 'qna'>('concepts');
  const [history, setHistory] = useState<{ id: string; title: string; year: string }[]>([
    { id: 'attention-is-all-you-need', title: 'Attention Is All You Need', year: '2017' },
  ]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Handle Preset Selection
  const handleSelectPreset = async (preset: PresetPaper) => {
    setErrorMsg(null);
    setPaperUrlInput(preset.arxivUrl);
    setPaperTitleInput(preset.title);

    if (preset.preloadedAnalysis) {
      setAnalysis(preset.preloadedAnalysis);
      setActiveTab('concepts');
      return;
    }

    // Trigger analysis if not preloaded
    await runAnalysis({ paperUrl: preset.arxivUrl, paperTitle: preset.title });
  };

  // Run Analysis via Server
  const runAnalysis = async (params?: { paperUrl?: string; paperTitle?: string; paperText?: string }) => {
    const url = params?.paperUrl ?? paperUrlInput.trim();
    const title = params?.paperTitle ?? paperTitleInput.trim();
    const text = params?.paperText ?? paperTextInput.trim();

    if (!url && !title && !text) {
      setErrorMsg('Please enter a research paper URL (e.g. arXiv), paper title, or paste text.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperUrl: url || undefined,
          paperTitle: title || undefined,
          paperText: text || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete paper analysis.');
      }

      setAnalysis(data.analysis);
      if (data.tokenBudget) {
        setTokenBudget(data.tokenBudget);
      }

      // Add to history
      const newTitle = data.analysis.paperMeta?.title || title || url;
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.title !== newTitle);
        return [{ id: `item-${Date.now()}`, title: newTitle, year: data.analysis.paperMeta?.year || '2024' }, ...filtered.slice(0, 5)];
      });

      // Jump to concepts tab
      setActiveTab('concepts');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || 'Error communicating with CS Research Agent API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCitation = async () => {
    const meta = analysis.paperMeta;
    const citation = `${meta.authors?.join(', ')} (${meta.year}). "${meta.title}". ${meta.venue || 'arXiv preprint'}.`;
    await navigator.clipboard.writeText(citation);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  CS Research Agent
                </h1>
                <span className="hidden sm:inline-block rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  Paper Architecture &amp; Student Projects
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Token-Efficient Academic Paper Parser • Mermaid.js Flowcharts • Resume Blueprints
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Constraint: &lt;25,000 Tokens</span>
            </div>
            <a
              href="https://arxiv.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            >
              <FolderGit2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>arXiv Portal</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Paper Input & Ingestion Section */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-indigo-400" />
                Analyze Academic Paper
              </label>
              <button
                onClick={() => setShowAdvancedInput(!showAdvancedInput)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
              >
                {showAdvancedInput ? 'Hide Excerpt Input' : 'Paste Raw Abstract / Excerpt'}
                {showAdvancedInput ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Primary URL Input Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={paperUrlInput}
                  onChange={(e) => setPaperUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
                  placeholder="Enter paper URL (e.g. https://arxiv.org/abs/1706.03762 or OpenReview / GitHub)..."
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-4 pr-10 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all shadow-inner"
                  disabled={isLoading}
                />
                {paperUrlInput && (
                  <button
                    onClick={() => setPaperUrlInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                onClick={() => runAnalysis()}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 transition-all cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Agent Parsing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Extract Architecture &amp; Projects</span>
                  </>
                )}
              </button>
            </div>

            {/* Advanced Input: Title & Excerpt */}
            {showAdvancedInput && (
              <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-800/80">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Paper Title or Query
                  </label>
                  <input
                    type="text"
                    value={paperTitleInput}
                    onChange={(e) => setPaperTitleInput(e.target.value)}
                    placeholder="e.g. FlashAttention: Fast and Memory-Efficient Exact Attention..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Paper Excerpt / Abstract (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={paperTextInput}
                    onChange={(e) => setPaperTextInput(e.target.value)}
                    placeholder="Paste abstract or section text here if URL is restricted..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {/* Presets Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-indigo-400" />
                Iconic Papers:
              </span>
              {PRESET_PAPERS.map((preset) => {
                const isCurrent = analysis.paperMeta.title === preset.title;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    disabled={isLoading}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                        : 'border border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {preset.title.split(':')[0]}
                  </button>
                );
              })}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </section>

        {/* Paper Overview & Meta Card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                  {analysis.paperMeta.venue || 'Academic Paper'} • {analysis.paperMeta.year || '2024'}
                </span>
                {analysis.paperMeta.arxivId && (
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300 border border-slate-700">
                    arXiv:{analysis.paperMeta.arxivId}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {analysis.paperMeta.title}
              </h2>
              {analysis.paperMeta.authors && analysis.paperMeta.authors.length > 0 && (
                <p className="text-xs text-slate-400">
                  Authors: {analysis.paperMeta.authors.join(', ')}
                </p>
              )}
              {analysis.paperMeta.oneSentenceHook && (
                <p className="text-xs text-slate-300 italic pt-1 text-indigo-200/90">
                  &ldquo;{analysis.paperMeta.oneSentenceHook}&rdquo;
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyCitation}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedLink ? 'Copied Citation' : 'Copy Citation'}
              </button>

              {analysis.paperMeta.url && (
                <a
                  href={analysis.paperMeta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-600/30 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Original Paper
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Operational Constraint & Token Efficiency Monitor */}
        <TokenEfficiencyMonitor tokenBudget={tokenBudget} />

        {/* Tabbed Agent Step Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'concepts'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            1. Core Concept Extraction
          </button>

          <button
            onClick={() => setActiveTab('flowchart')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'flowchart'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <GitBranch className="h-4 w-4" />
            2. Architecture Flowchart (Mermaid)
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            3. Student Resume Projects (3 Ideas)
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'raw'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-4 w-4" />
            Raw Output [FLOWCHART]
          </button>

          <button
            onClick={() => setActiveTab('qna')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'qna'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Bot className="h-4 w-4" />
            Research Agent Q&amp;A
          </button>
        </div>

        {/* Tab Content Display */}
        <section className="space-y-6">
          {activeTab === 'concepts' && (
            <CoreConceptView
              coreConcepts={analysis.coreConcepts}
              paperTitle={analysis.paperMeta.title}
            />
          )}

          {activeTab === 'flowchart' && (
            <MermaidViewer
              chartCode={analysis.flowchart.mermaidCode}
              labeledSegment={analysis.flowchart.labeledSegment}
              paperTitle={analysis.paperMeta.title}
            />
          )}

          {activeTab === 'projects' && (
            <StudentProjectsView
              projects={analysis.studentProjects}
              paperTitle={analysis.paperMeta.title}
            />
          )}

          {activeTab === 'raw' && <RawAgentOutputModal analysis={analysis} />}

          {activeTab === 'qna' && <AgentQnAPanel analysis={analysis} />}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-indigo-400" />
            <span>Computer Science Research Agent • Operational Constraint: &lt;25,000 Tokens</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Core Concepts &lt;300 Words</span>
            <span>•</span>
            <span>Mermaid.js Flowcharts</span>
            <span>•</span>
            <span>3rd-Year CS Resume Projects</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
