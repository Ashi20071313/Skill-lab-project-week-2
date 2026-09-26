import { TokenBudget } from '../types/research';
import { ShieldCheck, Activity, Search, Sparkles } from 'lucide-react';

interface TokenEfficiencyMonitorProps {
  tokenBudget?: TokenBudget;
}

export function TokenEfficiencyMonitor({ tokenBudget }: TokenEfficiencyMonitorProps) {
  const budget = tokenBudget || {
    promptTokens: 1420,
    candidatesTokens: 2180,
    totalTokens: 3600,
    tokenLimit: 25000,
    utilizationPercent: 14.4,
    isUnder25kLimit: true,
    status: 'Optimal Efficiency',
  };

  const percentage = Math.min(budget.utilizationPercent, 100);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-emerald-500/10 p-1.5 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              Operational Constraint Monitor
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                &lt; 25,000 Token Cap
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Guaranteed token efficiency via targeted ingestion & Google Search context grounding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <strong className="text-emerald-400 font-bold">{budget.totalTokens.toLocaleString()}</strong>
            <span className="text-slate-500">/ 25,000 tokens</span>
            <span className="text-[10px] text-emerald-400/90 ml-1">({percentage}%)</span>
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80 border border-slate-700/50">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage < 50
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : percentage < 80
                ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                : 'bg-gradient-to-r from-rose-500 to-red-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-3">
            <span>
              Prompt: <strong className="text-slate-300 font-mono">{budget.promptTokens.toLocaleString()}</strong>
            </span>
            <span>•</span>
            <span>
              Generated: <strong className="text-slate-300 font-mono">{budget.candidatesTokens.toLocaleString()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Search className="h-3 w-3 text-sky-400" />
              Web Search Grounding Fallback: <strong className="text-slate-200">Active</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="h-3 w-3" />
              {budget.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
