import { useState } from 'react';
import { CoreConcepts } from '../types/research';
import {
  BrainCircuit,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Sigma,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface CoreConceptViewProps {
  coreConcepts: CoreConcepts;
  paperTitle?: string;
}

export function CoreConceptView({ coreConcepts, paperTitle }: CoreConceptViewProps) {
  const [copied, setCopied] = useState(false);

  // Compute word count
  const calculatedWords = coreConcepts.plainSummary
    ? coreConcepts.plainSummary.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const wordCount = coreConcepts.wordCount || calculatedWords;
  const isUnder300 = wordCount <= 300;

  const handleCopySummary = async () => {
    const text = `1. CORE CONCEPT EXTRACTION (${paperTitle || 'Research Paper'}):
Problem Statement:
${coreConcepts.problemStatement}

Primary Methodology:
${coreConcepts.methodology}

Key Breakthroughs:
${coreConcepts.algorithmicBreakthroughs}

Plain Accessible Summary (${wordCount} words):
${coreConcepts.plainSummary}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Constraint & Accessible Language Guarantee */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400 border border-indigo-500/20">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Step 1: Core Concept Extraction
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Plain, Accessible Language
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Distilled in under 300 words without dense jargon.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-1.5 border border-slate-700/60">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-200">{wordCount}</span>
              <span className="text-[11px] text-slate-400"> / 300 words</span>
            </div>
            {isUnder300 ? (
              <span className="h-2 w-2 rounded-full bg-emerald-400" title="Under 300 words limit" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-amber-400" title="Close to or exceeds 300 words" />
            )}
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy Extraction'}
          </button>
        </div>
      </div>

      {/* Accessible Plain Language Synthesis */}
      <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-slate-900/90 p-5 shadow-xl">
        <div className="absolute top-0 right-0 h-28 w-28 rounded-bl-full bg-indigo-500/5 pointer-events-none" />
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Plain English Synthesis (Intuitive Metaphor & Impact)
          </h4>
        </div>
        <p className="text-sm leading-relaxed text-slate-200">
          {coreConcepts.plainSummary}
        </p>
      </div>

      {/* Structured Triad: Problem -> Method -> Breakthroughs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Problem Statement */}
        <div className="flex flex-col rounded-xl border border-rose-500/20 bg-slate-900/80 p-4 shadow-md hover:border-rose-500/30 transition-all">
          <div className="flex items-center gap-2 mb-2 text-rose-400">
            <div className="rounded-md bg-rose-500/10 p-1.5 border border-rose-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">The Problem Statement</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed flex-1">
            {coreConcepts.problemStatement}
          </p>
        </div>

        {/* 2. Primary Methodology */}
        <div className="flex flex-col rounded-xl border border-sky-500/20 bg-slate-900/80 p-4 shadow-md hover:border-sky-500/30 transition-all">
          <div className="flex items-center gap-2 mb-2 text-sky-400">
            <div className="rounded-md bg-sky-500/10 p-1.5 border border-sky-500/20">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Primary Methodology</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed flex-1">
            {coreConcepts.methodology}
          </p>
        </div>

        {/* 3. Mathematical / Algorithmic Breakthroughs */}
        <div className="flex flex-col rounded-xl border border-purple-500/20 bg-slate-900/80 p-4 shadow-md hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-2 mb-2 text-purple-400">
            <div className="rounded-md bg-purple-500/10 p-1.5 border border-purple-500/20">
              <Cpu className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Algorithmic Breakthroughs</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed flex-1">
            {coreConcepts.algorithmicBreakthroughs}
          </p>
        </div>
      </div>

      {/* Key Formulations & Mathematical Breakthroughs (if available) */}
      {coreConcepts.keyEquations && coreConcepts.keyEquations.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center gap-2 mb-3 text-slate-300">
            <Sigma className="h-4 w-4 text-violet-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Mathematical Formulations & Architectural Proofs
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {coreConcepts.keyEquations.map((eq, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-lg border border-slate-800/90 bg-slate-950/60 p-3"
              >
                <span className="text-[11px] font-semibold text-violet-300 mb-1">{eq.name}</span>
                <div className="my-1.5 overflow-x-auto rounded bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-amber-300 border border-slate-800">
                  {eq.formula}
                </div>
                <p className="text-[11px] text-slate-400 mt-auto leading-relaxed">{eq.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
