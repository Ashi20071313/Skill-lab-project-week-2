import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI client with telemetry header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to extract arXiv metadata
async function fetchArxivMetadata(arxivId: string) {
  try {
    const cleanId = arxivId.replace(/v\d+$/, '');
    const apiUrl = `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(cleanId)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) return null;
    const xml = await response.text();

    const titleMatch = xml.match(/<entry>[\s\S]*?<title>([\s\S]*?)<\/title>/);
    const summaryMatch = xml.match(/<summary>([\s\S]*?)<\/summary>/);
    const publishedMatch = xml.match(/<published>([\s\S]*?)<\/published>/);
    const authors = Array.from(xml.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>/g)).map(m => m[1].trim());

    if (titleMatch && summaryMatch) {
      return {
        title: titleMatch[1].replace(/\s+/g, ' ').trim(),
        abstract: summaryMatch[1].replace(/\s+/g, ' ').trim(),
        published: publishedMatch ? publishedMatch[1].trim().slice(0, 10) : undefined,
        authors: authors.slice(0, 5),
        arxivId: cleanId,
      };
    }
  } catch (err) {
    console.warn('Failed to fetch arXiv metadata directly:', err);
  }
  return null;
}

// Clean mermaid string helper
function cleanMermaidCode(raw: string): string {
  if (!raw) return 'graph TD\n  Input[Input Data] --> Model[Architecture Layer] --> Output[Output Prediction]';
  let cleaned = raw.trim();
  // Remove markdown code fences if present
  cleaned = cleaned.replace(/^```mermaid\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  // Remove [FLOWCHART] label if prepended
  cleaned = cleaned.replace(/^\[FLOWCHART\]\s*/i, '');
  cleaned = cleaned.trim();
  if (!cleaned.startsWith('graph ') && !cleaned.startsWith('flowchart ')) {
    cleaned = `graph TD\n${cleaned}`;
  }
  return cleaned;
}

// Extract arXiv ID from URL
function extractArxivId(url: string): string | null {
  const match = url.match(/arxiv\.org\/(?:abs|pdf)\/([0-9]+\.[0-9]+(?:v[0-9]+)?)/i);
  return match ? match[1] : null;
}

// API endpoint to analyze a paper
app.post('/api/analyze-paper', async (req: Request, res: Response) => {
  try {
    const { paperUrl, paperTitle, paperText } = req.body;

    if (!paperUrl && !paperTitle && !paperText) {
      return res.status(400).json({ error: 'Please provide a paper URL, title, or abstract.' });
    }

    let extractedContext = '';
    let fetchedMeta: { title?: string; abstract?: string; authors?: string[]; published?: string; arxivId?: string } | null = null;

    if (paperUrl) {
      const arxivId = extractArxivId(paperUrl);
      if (arxivId) {
        fetchedMeta = await fetchArxivMetadata(arxivId);
        if (fetchedMeta) {
          extractedContext += `\n[Official arXiv Metadata]\nTitle: ${fetchedMeta.title}\nAuthors: ${fetchedMeta.authors?.join(', ')}\nPublished: ${fetchedMeta.published}\nAbstract: ${fetchedMeta.abstract}\n`;
        }
      }
    }

    if (paperText) {
      extractedContext += `\n[Provided Paper Excerpt / Abstract]:\n${paperText.slice(0, 12000)}`;
    }

    const systemPrompt = `You are an advanced Computer Science Research Agent specializing in parsing academic papers, extracting system architectures, and identifying student development opportunities.

OPERATIONAL CONSTRAINTS:
- You must always prioritize token efficiency. Ensure your total analysis and tool execution stays well under 25,000 tokens.
- If a paper is too long to ingest entirely, use the Web Search tool to look up summaries, abstracts, and open-source implementations (e.g., GitHub) of the paper's title to gather context efficiently.

When a user provides a research paper URL or reference, execute these exact steps:

1. CORE CONCEPT EXTRACTION:
Summarize the problem statement, the primary methodology introduced, and the key mathematical/algorithmic breakthroughs in under 300 words using plain, accessible language.

2. ARCHITECTURAL FLOWCHART (Mermaid.js):
Generate a clean, syntactically correct Mermaid.js flowchart (graph TD) that charts the components, data inputs, model layers, and data outputs of the system described in the paper. Do not use Markdown code blocks inside the Mermaid string itself; output it as a clear text segment labeled [FLOWCHART]

3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:
Brainstorm 3 concrete, realistic ways a 3rd-year CS student could build upon, extend, or optimize this paper for a resume project. For each idea provide:
- The exact extension (e.g., "Replacing the heavy transformer layer with a lightweight Mamba block for edge deployment").
- The targeted performance metric (e.g., latency reduction, accuracy trade-off).
- The recommended tech stack (e.g., PyTorch, ONNX Runtime).

FORMAT INSTRUCTION:
Return your response as a valid JSON object matching the following structure:
{
  "paperMeta": {
    "title": "string",
    "authors": ["string"],
    "year": "string",
    "venue": "string",
    "oneSentenceHook": "string"
  },
  "coreConcepts": {
    "problemStatement": "string",
    "methodology": "string",
    "algorithmicBreakthroughs": "string",
    "plainSummary": "string (strictly under 300 words, plain accessible language explaining the problem, method, and breakthrough)",
    "wordCount": 150,
    "keyEquations": [
      {
        "name": "string (e.g. Scaled Dot-Product Attention)",
        "formula": "string (LaTeX or ASCII e.g. Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V)",
        "description": "string"
      }
    ]
  },
  "flowchart": {
    "mermaidCode": "string (clean syntactically correct graph TD Mermaid definition without markdown quotes)",
    "labeledSegment": "[FLOWCHART]\\ngraph TD\\n..."
  },
  "studentProjects": [
    {
      "title": "string",
      "exactExtension": "string",
      "targetedMetric": "string",
      "recommendedTechStack": ["string", "string"],
      "difficulty": "Intermediate or Advanced",
      "estimatedDuration": "3-4 weeks",
      "resumeBullet": "string (Action verb + quantifiable impact + tech stack)",
      "interviewTalkingPoint": "string",
      "milestoneRoadmap": [
        { "phase": "Week 1", "focus": "string", "deliverables": ["string", "string"] },
        { "phase": "Week 2", "focus": "string", "deliverables": ["string", "string"] },
        { "phase": "Week 3", "focus": "string", "deliverables": ["string", "string"] },
        { "phase": "Week 4", "focus": "string", "deliverables": ["string", "string"] }
      ]
    }
  ],
  "rawAgentOutput": "string (The complete text following the exact 3-step prompt format with [FLOWCHART] label)"
}`;

    const userPrompt = `Analyze the following academic paper according to your operational constraints:
${paperUrl ? `Paper URL: ${paperUrl}` : ''}
${paperTitle ? `Paper Title / Query: ${paperTitle}` : ''}
${extractedContext ? `Extracted Context:\n${extractedContext}` : ''}

Remember:
1. Summarize under 300 words with plain accessible language.
2. Generate syntactically valid Mermaid.js graph TD. Segment labeled [FLOWCHART].
3. 3 concrete resume project opportunities for 3rd-year CS students with exact extension, targeted metric, and tech stack.
4. Output valid JSON as requested.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.warn('Failed to parse Gemini JSON directly, attempting regex repair...', parseError);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON received from analysis model');
      }
    }

    // Clean up mermaid code
    if (parsedData.flowchart?.mermaidCode) {
      parsedData.flowchart.mermaidCode = cleanMermaidCode(parsedData.flowchart.mermaidCode);
    }

    // Merge fetched meta if not populated
    if (fetchedMeta) {
      parsedData.paperMeta = {
        title: parsedData.paperMeta?.title || fetchedMeta.title,
        authors: parsedData.paperMeta?.authors?.length ? parsedData.paperMeta.authors : fetchedMeta.authors,
        year: parsedData.paperMeta?.year || fetchedMeta.published?.slice(0, 4) || 'Recent',
        venue: parsedData.paperMeta?.venue || 'arXiv',
        arxivId: fetchedMeta.arxivId,
        url: paperUrl,
        ...parsedData.paperMeta,
      };
    }

    // Add token usage tracking
    const usage = response.usageMetadata || {};
    const promptTokens = usage.promptTokenCount || 0;
    const candidatesTokens = usage.candidatesTokenCount || 0;
    const totalTokens = usage.totalTokenCount || (promptTokens + candidatesTokens);

    const tokenBudget = {
      promptTokens,
      candidatesTokens,
      totalTokens,
      tokenLimit: 25000,
      utilizationPercent: Number(((totalTokens / 25000) * 100).toFixed(1)),
      isUnder25kLimit: totalTokens < 25000,
      status: totalTokens < 10000 ? 'Optimal Efficiency' : totalTokens < 25000 ? 'Within Safe Limits' : 'Exceeded Limit',
    };

    return res.json({
      success: true,
      analysis: parsedData,
      tokenBudget,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-paper:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred during paper analysis.',
    });
  }
});

// Follow-up Q&A endpoint for deeper academic exploration
app.post('/api/ask-question', async (req: Request, res: Response) => {
  try {
    const { question, paperContext } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const prompt = `You are an advanced Computer Science Research Agent specializing in parsing academic papers and guiding 3rd-year CS students.
Paper Context:
Title: ${paperContext?.title || 'Analyzed Research Paper'}
Core Problem & Breakthrough: ${paperContext?.coreConcepts?.plainSummary || ''}
Architecture: ${paperContext?.flowchart?.mermaidCode || ''}

Student's Question:
"${question}"

Provide a crisp, rigorous, and student-focused answer. If providing code examples, use modern Python / PyTorch / standard CS libraries. Keep explanation concise and actionable.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    return res.json({
      answer: response.text || 'Unable to generate response.',
    });
  } catch (error: any) {
    console.error('Error in /api/ask-question:', error);
    return res.status(500).json({ error: error.message || 'Failed to answer question.' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CS Research Agent API' });
});

// Mount Vite or serve static
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CS Research Agent server running on http://localhost:${PORT}`);
  });
}

startServer();
