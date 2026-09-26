import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Download,
  Code2,
  Eye,
  Maximize2,
  Minimize2,
  AlertCircle,
  FileCode,
} from 'lucide-react';

interface MermaidViewerProps {
  chartCode: string;
  labeledSegment?: string;
  paperTitle?: string;
}

export function MermaidViewer({ chartCode, labeledSegment, paperTitle }: MermaidViewerProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'diagram' | 'code'>('diagram');
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      themeVariables: {
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        fontSize: '13px',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#3b82f6',
        lineColor: '#60a5fa',
        secondaryColor: '#0f172a',
        tertiaryColor: '#1e1b4b',
      },
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function renderChart() {
      if (!chartCode) return;
      try {
        setRenderError(null);
        // Ensure valid ID
        const uniqueId = `mermaid-canvas-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        let cleaned = chartCode.trim();
        // Remove markdown block if model wrapped it
        cleaned = cleaned.replace(/^```mermaid\s*/i, '');
        cleaned = cleaned.replace(/^```\s*/i, '');
        cleaned = cleaned.replace(/\s*```$/i, '');
        // Remove [FLOWCHART] label if prepended
        cleaned = cleaned.replace(/^\[FLOWCHART\]\s*/i, '');
        cleaned = cleaned.trim();

        if (!cleaned.startsWith('graph') && !cleaned.startsWith('flowchart')) {
          cleaned = `graph TD\n${cleaned}`;
        }

        const { svg } = await mermaid.render(uniqueId, cleaned);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setRenderError(err?.message || 'Could not parse Mermaid flowchart syntax.');
        }
      }
    }

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chartCode]);

  const handleCopyCode = async (withLabel: boolean = false) => {
    const textToCopy = withLabel
      ? (labeledSegment || `[FLOWCHART]\n${chartCode}`)
      : chartCode;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanName = (paperTitle || 'system-architecture').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `${cleanName}-architecture.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl border border-slate-700/80 bg-slate-900/90 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-hidden bg-slate-950 p-6' : 'w-full'
      }`}
    >
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Mermaid.js Flowchart (graph TD)
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Components • Data Inputs • Model Layers • Outputs
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg bg-slate-800/80 p-0.5 border border-slate-700/60">
            <button
              onClick={() => setViewMode('diagram')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'diagram'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Rendered Diagram"
            >
              <Eye className="h-3.5 w-3.5" />
              Diagram
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'code'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mermaid Source Code"
            >
              <Code2 className="h-3.5 w-3.5" />
              Raw Source
            </button>
          </div>

          {/* Zoom controls (diagram mode only) */}
          {viewMode === 'diagram' && (
            <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
              <button
                onClick={() => setScale((s) => Math.min(s + 0.15, 2.5))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700/60 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-1 select-none">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.max(s - 0.15, 0.4))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700/60 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setScale(1)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700/60 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Copy Flowchart Segment */}
          <button
            onClick={() => handleCopyCode(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Copy labeled [FLOWCHART] text segment as specified in prompt"
          >
            {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {isCopied ? 'Copied [FLOWCHART]' : 'Copy [FLOWCHART]'}
          </button>

          {/* Download SVG */}
          {viewMode === 'diagram' && svgContent && (
            <button
              onClick={handleDownloadSvg}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Export as vector SVG"
            >
              <Download className="h-3.5 w-3.5" />
              Export SVG
            </button>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-slate-700/70 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        ref={containerRef}
        className={`relative overflow-auto p-4 flex items-center justify-center min-h-[380px] ${
          isFullscreen ? 'h-[calc(100vh-140px)]' : 'max-h-[580px]'
        }`}
      >
        {renderError ? (
          <div className="flex flex-col items-center justify-center p-6 text-center max-w-md">
            <AlertCircle className="h-10 w-10 text-amber-400 mb-3" />
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Mermaid Syntax Warning</h4>
            <p className="text-xs text-slate-400 mb-4">{renderError}</p>
            <button
              onClick={() => setViewMode('code')}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
            >
              <FileCode className="h-4 w-4" />
              View & Edit Raw Code
            </button>
          </div>
        ) : viewMode === 'diagram' ? (
          <div
            className="transition-transform duration-150 origin-center flex items-center justify-center w-full"
            style={{ transform: `scale(${scale})` }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between pb-2 text-xs text-slate-400">
              <span>Labeled Mermaid Block Segment</span>
              <button
                onClick={() => handleCopyCode(false)}
                className="text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy raw code
              </button>
            </div>
            <pre className="w-full flex-1 overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-800 leading-relaxed selection:bg-indigo-500/30">
              <code>{labeledSegment || `[FLOWCHART]\n${chartCode}`}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-300">Flowchart Key:</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 inline-block" />
            Data Inputs & Tokens
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500 inline-block" />
            Model Layers & Attention
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-purple-500 inline-block" />
            Math & Feed-Forward
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-500 inline-block" />
            Output Predictions
          </span>
        </div>

        <span className="text-[11px] text-slate-500">
          Clean string • Syntactically correct Mermaid graph TD
        </span>
      </div>
    </div>
  );
}
