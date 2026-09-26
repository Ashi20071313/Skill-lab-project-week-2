import { useState } from 'react';
import { StudentProject } from '../types/research';
import {
  GraduationCap,
  Sparkles,
  Target,
  Layers,
  Wrench,
  Calendar,
  Briefcase,
  MessageSquare,
  Copy,
  Check,
  ChevronRight,
  Award,
  Terminal,
} from 'lucide-react';

interface StudentProjectsViewProps {
  projects: StudentProject[];
  paperTitle?: string;
}

export function StudentProjectsView({ projects, paperTitle }: StudentProjectsViewProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const activeProject = projects[activeTab] || projects[0];

  const handleCopyBullet = async (bulletText: string, index: number) => {
    await navigator.clipboard.writeText(bulletText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    let text = `3. FUTURE WORK & INTERNSHIP OPPORTUNITIES (${paperTitle || 'Research Paper'}):\n\n`;
    projects.forEach((p, idx) => {
      text += `Project ${idx + 1}: ${p.title}\n`;
      text += `- Exact Extension: ${p.exactExtension}\n`;
      text += `- Targeted Metric: ${p.targetedMetric}\n`;
      text += `- Recommended Tech Stack: ${p.recommendedTechStack.join(', ')}\n`;
      text += `- Resume Bullet: ${p.resumeBullet}\n\n`;
    });

    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Step 3: Future Work & Internship Resume Projects
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                Tailored for 3rd-Year CS Students
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              3 concrete, realistic ways to extend this paper into high-impact portfolio projects.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copiedAll ? 'Copied 3 Ideas' : 'Copy All 3 Ideas'}
        </button>
      </div>

      {/* Project Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {projects.map((project, idx) => {
          const isSelected = activeTab === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg ring-1 ring-emerald-500/30'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
              )}
              <div className="flex items-center justify-between w-full mb-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="h-3 w-3" />
                  Idea {idx + 1}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                  {project.difficulty || 'Intermediate'}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 mb-2">
                {project.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-auto">
                {project.exactExtension}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Project Deep Dive */}
      {activeProject && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
          {/* Title & Metadata Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  Project Blueprint #{activeTab + 1}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  Estimated: {activeProject.estimatedDuration || '3-4 weeks'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{activeProject.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyBullet(activeProject.resumeBullet, activeTab)}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                title="Copy Resume Bullet"
              >
                {copiedIndex === activeTab ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedIndex === activeTab ? 'Copied Bullet!' : 'Copy Resume Bullet'}
              </button>
            </div>
          </div>

          {/* Core Mandated Fields: Extension, Metric, Tech Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Exact Extension */}
            <div className="flex flex-col rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Layers className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">The Exact Extension</h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeProject.exactExtension}
              </p>
            </div>

            {/* 2. Targeted Performance Metric */}
            <div className="flex flex-col rounded-xl border border-teal-500/20 bg-teal-950/20 p-4">
              <div className="flex items-center gap-2 text-teal-400 mb-2">
                <Target className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Targeted Performance Metric</h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeProject.targetedMetric}
              </p>
            </div>

            {/* 3. Recommended Tech Stack */}
            <div className="flex flex-col rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Wrench className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Recommended Tech Stack</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {activeProject.recommendedTechStack.map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 px-2 py-1 text-[11px] font-mono font-medium text-amber-300 border border-slate-700/80 shadow-sm"
                  >
                    <Terminal className="h-2.5 w-2.5 text-amber-400/80" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Resume Pitch Box */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Briefcase className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Ready-to-Use Resume Bullet Point (ATS-Optimized)
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400/80 uppercase font-mono">
                Action Verb + Impact + Stack
              </span>
            </div>
            <div className="relative rounded-lg bg-slate-950/90 p-3.5 font-mono text-xs text-emerald-200 border border-emerald-900/50 leading-relaxed">
              &quot;{activeProject.resumeBullet}&quot;
            </div>
          </div>

          {/* Interview Prep / Talking Point */}
          {activeProject.interviewTalkingPoint && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <MessageSquare className="h-4 w-4 text-sky-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  How to Explain in an Interview
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeProject.interviewTalkingPoint}
              </p>
            </div>
          )}

          {/* 4-Week Milestone Roadmap (if available) */}
          {activeProject.milestoneRoadmap && activeProject.milestoneRoadmap.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                Student Sprint Roadmap (4 Weeks)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeProject.milestoneRoadmap.map((mile, mIdx) => (
                  <div
                    key={mIdx}
                    className="flex flex-col rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-bold text-indigo-400">
                        {mile.phase}
                      </span>
                      <Award className="h-3 w-3 text-slate-500" />
                    </div>
                    <span className="font-semibold text-slate-200 mb-2">{mile.focus}</span>
                    <ul className="space-y-1 text-[11px] text-slate-400 mt-auto">
                      {mile.deliverables.map((deliv, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1">
                          <ChevronRight className="h-3 w-3 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
