import { useState } from 'react';
import { PaperAnalysis } from '../types/research';
import { FileText, Copy, Check, Download, Terminal } from 'lucide-react';

interface RawAgentOutputModalProps {
  analysis: PaperAnalysis;
}

export function RawAgentOutputModal({ analysis }: RawAgentOutputModalProps) {
  const [copied, setCopied] = useState(false);

  // Generate standardized text output if rawAgentOutput isn't present
  const generateStandardOutput = () => {
    if (analysis.rawAgentOutput) {
      return analysis.rawAgentOutput;
    }

    const { coreConcepts, flowchart, studentProjects } = analysis;

    let text = `1. CORE CONCEPT EXTRACTION:
Problem Statement:
${coreConcepts.problemStatement}

Primary Methodology:
${coreConcepts.methodology}

Key Algorithmic Breakthroughs:
${coreConcepts.algorithmicBreakthroughs}

Plain Accessible Summary:
${coreConcepts.plainSummary}

2. ARCHITECTURAL FLOWCHART (Mermaid.js):
[FLOWCHART]
${flowchart.mermaidCode}

3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:`;

    studentProjects.forEach((proj, idx) => {
      text += `\n\nProject ${idx + 1}: ${proj.title}
- The exact extension: ${proj.exactExtension}
- The targeted performance metric: ${proj.targetedMetric}
- The recommended tech stack: ${proj.recommendedTechStack.join(', ')}
- Resume Bullet: ${proj.resumeBullet}`;
    });

    return text;
  };

  const outputText = generateStandardOutput();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = analysis.paperMeta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `${cleanTitle}-agent-analysis.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Raw Operational Output (Prompt-Compliant Text Stream)
            </h4>
            <p className="text-[11px] text-slate-400">
              Exact text matching Step 1, Step 2 ([FLOWCHART]), and Step 3 specification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied Full Output' : 'Copy All Output'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download Markdown
          </button>
        </div>
      </div>

      <div className="relative">
        <pre className="w-full max-h-[520px] overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-800/80 leading-relaxed whitespace-pre-wrap select-all">
          {outputText}
        </pre>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Includes [FLOWCHART] labeled block without inline markdown fences</span>
        <span>Formatted for research logs, thesis citations & academic notebooks</span>
      </div>
    </div>
  );
}
