import React, { useState } from 'react';
import { PaperAnalysis, ChatMessage } from '../types/research';
import { Send, Bot, User, Sparkles, Loader2, HelpCircle } from 'lucide-react';

interface AgentQnAPanelProps {
  analysis: PaperAnalysis;
}

export function AgentQnAPanel({ analysis }: AgentQnAPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: `Hello! I am your CS Research Agent. I've parsed "${analysis.paperMeta.title}". You can ask me how to implement any of the 3 project extensions, clarify mathematical formulas, or discuss how to present this on your resume.`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'How do I implement this extension in PyTorch step-by-step?',
    'What datasets should I benchmark on to prove my metrics?',
    'What are common failure modes when training this architecture?',
    'How do I explain this mathematical breakthrough in an interview?',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || input.trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          paperContext: {
            title: analysis.paperMeta.title,
            coreConcepts: analysis.coreConcepts,
            flowchart: analysis.flowchart,
          },
        }),
      });

      const data = await res.json();
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.answer || 'I could not retrieve an answer at this time.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'agent',
        text: 'Sorry, I encountered a communication error with the research agent server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Research Agent Q&A Assistant
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                Interactive CS Mentor
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Ask deep questions about equations, PyTorch implementations, or ablation studies.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'agent' && (
              <div className="rounded-full bg-indigo-600/20 border border-indigo-500/30 p-1.5 h-7 w-7 flex items-center justify-center shrink-0 text-indigo-400">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 shadow-md ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <div
                className={`mt-1.5 text-[10px] ${
                  m.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="rounded-full bg-slate-700 border border-slate-600 p-1.5 h-7 w-7 flex items-center justify-center shrink-0 text-slate-300">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="rounded-full bg-indigo-600/20 border border-indigo-500/30 p-1.5 h-7 w-7 flex items-center justify-center shrink-0 text-indigo-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-xl px-4 py-3 bg-slate-800/90 text-slate-300 border border-slate-700/60 flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
              <span>Analyzing paper context and formulating response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="border-t border-slate-800 bg-slate-950/60 p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
          <HelpCircle className="h-3 w-3 text-indigo-400" />
          <span>Quick CS Questions:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq)}
              disabled={loading}
              className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-slate-800 bg-slate-900/90 p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask a technical question about ${analysis.paperMeta.title}...`}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
