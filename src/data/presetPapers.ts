import { PresetPaper } from '../types/research';

export const PRESET_PAPERS: PresetPaper[] = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
    year: '2017',
    tag: 'Foundational LLM / NLP',
    arxivUrl: 'https://arxiv.org/abs/1706.03762',
    shortDesc: 'Replaced recurrent networks with Multi-Head Self-Attention, powering modern Transformers.',
    preloadedAnalysis: {
      paperMeta: {
        title: 'Attention Is All You Need',
        authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
        year: '2017',
        venue: 'NeurIPS 2017',
        arxivId: '1706.03762',
        url: 'https://arxiv.org/abs/1706.03762',
        oneSentenceHook: 'Eliminates recurrence and convolutions entirely, relying solely on an attention mechanism to model global dependencies in sequence-to-sequence tasks.',
      },
      coreConcepts: {
        problemStatement: 'Dominant sequence transduction models relied on complex recurrent (RNN/LSTM) or convolutional neural networks. Because recurrent models compute hidden states sequentially (h_t from h_{t-1}), their sequential nature prevents parallelization across training tokens, creating massive training bottlenecks on long sequences and struggling to retain long-range token relationships due to vanishing gradients.',
        methodology: 'The paper introduces the Transformer, an encoder-decoder architecture based entirely on multi-head self-attention. Instead of stepping through words sequentially, the model consumes entire sequences simultaneously. Tokens compare themselves against every other token in parallel using Queries, Keys, and Values, while sinusoidal positional encodings inject sequence order without recurring connections.',
        algorithmicBreakthroughs: 'Scaled Dot-Product Attention introduces a scaling factor 1/√d_k to prevent dot products from growing excessively large in high dimensions (which would push softmax into regions with vanishing gradients). Multi-Head Attention enables the model to simultaneously attend to information from different representation subspaces at different positions.',
        plainSummary: 'Before this paper, AI processed sentences one word at a time like reading with a magnifying glass, which made training slow and caused models to forget early words in long passages. The Transformer throws away this step-by-step reading and instead analyzes all words at once. It uses an attention mechanism where every word looks at every other word simultaneously to figure out context, like how "it" in "the animal didn\'t cross the street because it was tired" refers to "animal". By pairing this with multi-head attention and mathematical position markers, it unlocks massive parallel GPU training and serves as the bedrock of modern language models.',
        wordCount: 104,
        keyEquations: [
          {
            name: 'Scaled Dot-Product Attention',
            formula: 'Attention(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
            description: 'Computes affinity matrix between queries and keys, scales by reciprocal root dimension to stabilize gradients, and aggregates values.',
          },
          {
            name: 'Multi-Head Attention',
            formula: '\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O',
            description: 'Projects queries, keys, and values into h distinct d_k dimensional subspaces to capture syntactic and semantic interactions.',
          },
          {
            name: 'Sinusoidal Positional Encoding',
            formula: 'PE_{(pos, 2i)} = \\sin(pos / 10000^{2i/d_{\\text{model}}}), \\; PE_{(pos, 2i+1)} = \\cos(pos / 10000^{2i/d_{\\text{model}}})',
            description: 'Injects relative and absolute position order without learnable recurring states.',
          },
        ],
      },
      flowchart: {
        mermaidCode: `graph TD
  subgraph Input_Processing["1. Input Sequence & Embeddings"]
    InputTokens["Source Tokens (X_in)"] --> InpEmbed["Input Token Embedding (d=512)"]
    InpEmbed --> AddPE["Element-wise Add (+)"]
    PosEncode["Sinusoidal Positional Encodings"] --> AddPE
  end

  subgraph Encoder_Stack["2. Transformer Encoder Stack (N=6 layers)"]
    AddPE --> Norm1["LayerNorm & Residual 1"]
    Norm1 --> MHA_Enc["Multi-Head Self-Attention (h=8 heads)"]
    MHA_Enc --> QKV_Enc["Q = X*W_q, K = X*W_k, V = X*W_v"]
    QKV_Enc --> Softmax_Enc["Softmax(QK^T / sqrt(d_k)) * V"]
    Softmax_Enc --> PostMHA["LayerNorm + Residual Connection"]
    PostMHA --> FFN_Enc["Position-Wise Feed-Forward (d_ff=2048, ReLU)"]
    FFN_Enc --> EncOut["Encoder Memory Representation (K, V)"]
  end

  subgraph Target_Processing["3. Target Sequence (Shifted Right)"]
    TgtTokens["Target Tokens (Y_in)"] --> TgtEmbed["Target Token Embedding"]
    TgtEmbed --> TgtAddPE["Element-wise Add (+)"]
    TgtPE["Target Positional Encodings"] --> TgtAddPE
  end

  subgraph Decoder_Stack["4. Transformer Decoder Stack (N=6 layers)"]
    TgtAddPE --> MaskedMHA["Masked Multi-Head Self-Attention (Causal Mask)"]
    MaskedMHA --> DecNorm1["LayerNorm + Residual"]
    DecNorm1 --> CrossMHA["Cross-Attention Layer"]
    EncOut --> CrossMHA
    CrossMHA --> DecFFN["Position-Wise Feed-Forward (d_ff=2048)"]
    DecFFN --> DecNorm2["Final LayerNorm"]
  end

  subgraph Output_Head["5. Output Probability Generation"]
    DecNorm2 --> LinearProj["Linear Projection Layer (d_vocab)"]
    LinearProj --> SoftmaxOut["Softmax Activation"]
    SoftmaxOut --> OutTokens["Target Probabilities / Generated Token (Y_out)"]
  end

  style InputTokens fill:#10b981,stroke:#059669,stroke-width:2px,color:#ffffff
  style OutTokens fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
  style MHA_Enc fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#ffffff
  style CrossMHA fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#ffffff
  style MaskedMHA fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#ffffff`,
        labeledSegment: `[FLOWCHART]
graph TD
  subgraph Input_Processing["1. Input Sequence & Embeddings"]
    InputTokens["Source Tokens (X_in)"] --> InpEmbed["Input Token Embedding (d=512)"]
    InpEmbed --> AddPE["Element-wise Add (+)"]
    PosEncode["Sinusoidal Positional Encodings"] --> AddPE
  end

  subgraph Encoder_Stack["2. Transformer Encoder Stack (N=6 layers)"]
    AddPE --> Norm1["LayerNorm & Residual 1"]
    Norm1 --> MHA_Enc["Multi-Head Self-Attention (h=8 heads)"]
    MHA_Enc --> QKV_Enc["Q = X*W_q, K = X*W_k, V = X*W_v"]
    QKV_Enc --> Softmax_Enc["Softmax(QK^T / sqrt(d_k)) * V"]
    Softmax_Enc --> PostMHA["LayerNorm + Residual Connection"]
    PostMHA --> FFN_Enc["Position-Wise Feed-Forward (d_ff=2048, ReLU)"]
    FFN_Enc --> EncOut["Encoder Memory Representation (K, V)"]
  end

  subgraph Target_Processing["3. Target Sequence (Shifted Right)"]
    TgtTokens["Target Tokens (Y_in)"] --> TgtEmbed["Target Token Embedding"]
    TgtEmbed --> TgtAddPE["Element-wise Add (+)"]
    TgtPE["Target Positional Encodings"] --> TgtAddPE
  end

  subgraph Decoder_Stack["4. Transformer Decoder Stack (N=6 layers)"]
    TgtAddPE --> MaskedMHA["Masked Multi-Head Self-Attention (Causal Mask)"]
    MaskedMHA --> DecNorm1["LayerNorm + Residual"]
    DecNorm1 --> CrossMHA["Cross-Attention Layer"]
    EncOut --> CrossMHA
    CrossMHA --> DecFFN["Position-Wise Feed-Forward (d_ff=2048)"]
    DecFFN --> DecNorm2["Final LayerNorm"]
  end

  subgraph Output_Head["5. Output Probability Generation"]
    DecNorm2 --> LinearProj["Linear Projection Layer (d_vocab)"]
    LinearProj --> SoftmaxOut["Softmax Activation"]
    SoftmaxOut --> OutTokens["Target Probabilities / Generated Token (Y_out)"]
  end`,
      },
      studentProjects: [
        {
          title: 'Linear Attention & State Space (Mamba) Hybrid Block Replacement',
          exactExtension: 'Replacing the quadratic O(N²) standard self-attention encoder layers with a linear-time selective state-space block (Mamba SSM) for edge-device sequence modeling.',
          targetedMetric: 'Inference latency reduction from 120ms to 32ms on 4K context sequences and 68% decrease in GPU VRAM consumption while preserving >97% of standard transformer perplexity.',
          recommendedTechStack: ['PyTorch 2.3', 'Triton Kernel DSL', 'HuggingFace Transformers', 'ONNX Runtime', 'Weights & Biases'],
          difficulty: 'Advanced',
          estimatedDuration: '4 weeks',
          resumeBullet: 'Architected a hybrid Mamba-Transformer encoder in PyTorch, reducing inference latency by 73% on 4K token sequences while maintaining 97.4% baseline validation accuracy.',
          interviewTalkingPoint: 'Discuss how standard self-attention calculates an N-by-N attention matrix which bottlenecks memory on long contexts, whereas state space models compress history into recurrent continuous hidden states with linear complexity.',
          milestoneRoadmap: [
            { phase: 'Week 1', focus: 'Baseline Reproduction', deliverables: ['Implement 6-layer toy Transformer in PyTorch', 'Train on Shakespeare/Wikitext-2 benchmark', 'Record baseline tokens/sec & VRAM peak'] },
            { phase: 'Week 2', focus: 'Architecture Swap', deliverables: ['Implement Selective State Space (S6) layer', 'Replace attention layers 2 through 5 with SSM blocks', 'Verify forward/backward gradient flows'] },
            { phase: 'Week 3', focus: 'Quantization & Profiling', deliverables: ['Profile memory footprint across sequence lengths (512 to 8192)', 'Convert to ONNX runtime and benchmark CPU/GPU latency'] },
            { phase: 'Week 4', focus: 'Evaluation & Demo', deliverables: ['Plot Pareto frontier of Perplexity vs Latency', 'Package into interactive Streamlit demo with live speedup metrics'] },
          ],
        },
        {
          title: 'Structured Head Pruning & FlashAttention IO-Aware Speedup',
          exactExtension: 'Evaluating multi-head importance via Taylor expansion gradient attribution to prune 50% of redundant attention heads, paired with FlashAttention-2 tiling.',
          targetedMetric: '2.4x throughput speedup (tokens/sec) with less than 0.8 BLEU score loss on WMT translation benchmarks.',
          recommendedTechStack: ['PyTorch', 'FlashAttention-2', 'HuggingFace Datasets', 'TorchScript / TensorRT'],
          difficulty: 'Intermediate',
          estimatedDuration: '3 weeks',
          resumeBullet: 'Engineered gradient-based head pruning pipeline for multi-head attention models, stripping 45% of uninformative attention heads and achieving 2.4x inference speedup with zero noticeable accuracy degradation.',
          interviewTalkingPoint: 'Explain how many attention heads in deep models learn redundant syntactic patterns, and how IO-aware tiling keeps queries and keys within fast SRAM instead of reading from high-latency HBM.',
          milestoneRoadmap: [
            { phase: 'Week 1', focus: 'Attribution Profiling', deliverables: ['Implement head mask variables with L0 regularization', 'Calculate Fisher information matrix per head on validation set'] },
            { phase: 'Week 2', focus: 'Structured Pruning', deliverables: ['Iteratively zero out lowest 40% of heads', 'Perform 1-epoch fine-tuning distillation recovery'] },
            { phase: 'Week 3', focus: 'Engine Optimization', deliverables: ['Export to ONNX and run with TensorRT optimization', 'Produce comparative latency graphs across batch sizes'] },
          ],
        },
        {
          title: '8-Bit Dynamic Post-Training Quantization with Weight Tying',
          exactExtension: 'Applying dynamic 8-bit integer quantization (INT8) to the feed-forward projection matrices (W1, W2) combined with tie-weight embeddings for microcontrollers.',
          targetedMetric: '75% reduction in model checkpoint size (from 240MB down to 60MB) with <1% degradation in top-1 accuracy on edge microprocessors (e.g. Raspberry Pi).',
          recommendedTechStack: ['PyTorch FX Graph Mode Quantization', 'BitsAndBytes', 'ONNX Runtime', 'C++ libtorch'],
          difficulty: 'Intermediate',
          estimatedDuration: '3 weeks',
          resumeBullet: 'Built an INT8 dynamic quantization pipeline for transformer encoder layers using PyTorch FX, slashing model memory by 75% and enabling real-time edge execution on ARM Cortex devices.',
          interviewTalkingPoint: 'Explain asymmetric vs symmetric quantization, how scales and zero-points are calibrated, and why the large outlier activations in transformers require special attention during quantization.',
          milestoneRoadmap: [
            { phase: 'Week 1', focus: 'Quantization Setup', deliverables: ['Instrument PyTorch FX Graph observer modules', 'Collect activation calibration statistics on evaluation subset'] },
            { phase: 'Week 2', focus: 'INT8 Engine Build', deliverables: ['Quantize linear weights to QInt8 with dynamic activation scaling', 'Verify numeric stability and avoid overflow'] },
            { phase: 'Week 3', focus: 'Edge Deployment', deliverables: ['Deploy and benchmark on Raspberry Pi 4 / ARM Mac', 'Publish reproducible GitHub repo with Docker setup'] },
          ],
        },
      ],
      rawAgentOutput: `1. CORE CONCEPT EXTRACTION:
The paper solves the fundamental scalability bottleneck of recurrent neural networks (RNNs/LSTMs), which process sequences token-by-token and prevent parallel GPU training. The authors introduce the Transformer, an architecture relying solely on multi-head self-attention without recurrence or convolutions. It allows every token in a sequence to attend to every other token simultaneously. Key algorithmic breakthroughs include Scaled Dot-Product Attention, which normalizes dot products by 1/√d_k to prevent gradient vanishing at high dimensions, Multi-Head Attention to attend to information from distinct representation subspaces, and sinusoidal positional encodings to inject sequence order.

2. ARCHITECTURAL FLOWCHART (Mermaid.js):
[FLOWCHART]
graph TD
  In[Input Tokens] --> Emb[Embedding + Positional Encoding]
  Emb --> MHA[Multi-Head Self-Attention]
  MHA --> Norm1[Add & LayerNorm]
  Norm1 --> FFN[Feed-Forward Network]
  FFN --> Norm2[Add & LayerNorm]
  Norm2 --> Out[Output Probabilities]

3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:
- Extension: Replacing the quadratic self-attention encoder with a linear-time Mamba selective state space layer.
  Targeted Metric: Latency reduction from 120ms to 32ms on 4K sequences, 68% VRAM reduction with >97% retained perplexity.
  Tech Stack: PyTorch 2.3, Triton, ONNX Runtime.

- Extension: Structured head pruning via gradient attribution to eliminate redundant attention heads.
  Targeted Metric: 2.4x inference throughput speedup with <0.8 BLEU score loss on translation benchmarks.
  Tech Stack: PyTorch, FlashAttention-2, TensorRT.

- Extension: INT8 dynamic post-training quantization on feed-forward projections with weight tying.
  Targeted Metric: 75% memory footprint reduction (240MB to 60MB) for Raspberry Pi deployment.
  Tech Stack: PyTorch FX Quantization, BitsAndBytes, libtorch C++.`,
    },
  },
  {
    id: 'lora-low-rank-adaptation',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: ['Edward J. Hu', 'Yelong Shen', 'Phillip Wallis', 'Zeyuan Allen-Zhu', 'Yuanzhi Li', 'Shean Wang', 'Lu Wang', 'Weizhu Chen'],
    year: '2021',
    tag: 'Parameter-Efficient Fine-Tuning (PEFT)',
    arxivUrl: 'https://arxiv.org/abs/2106.09685',
    shortDesc: 'Freezes pre-trained model weights and injects trainable rank decomposition matrices into Transformer layers.',
  },
  {
    id: 'flash-attention',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: ['Tri Dao', 'Daniel Y. Fu', 'Stefano Ermon', 'Atri Rudra', 'Christopher Ré'],
    year: '2022',
    tag: 'Systems for ML / GPU Acceleration',
    arxivUrl: 'https://arxiv.org/abs/2205.14135',
    shortDesc: 'Tiled exact attention algorithm that accounts for GPU memory hierarchy (SRAM vs HBM) for 2-4x speedup.',
  },
  {
    id: 'rag-retrieval-augmented-generation',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: ['Patrick Lewis', 'Ethan Perez', 'Aleksandra Piktus', 'Fabio Petroni', 'Vladimir Karpukhin', 'et al.'],
    year: '2020',
    tag: 'Information Retrieval & LLMs',
    arxivUrl: 'https://arxiv.org/abs/2005.11401',
    shortDesc: 'Combines pre-trained parametric memory (seq2seq) with non-parametric memory (dense vector index).',
  },
  {
    id: 'mamba-linear-time-sequence',
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    authors: ['Albert Gu', 'Tri Dao'],
    year: '2023',
    tag: 'Next-Gen Architectures / SSM',
    arxivUrl: 'https://arxiv.org/abs/2312.00752',
    shortDesc: 'Selective state space model with hardware-aware parallel scan that achieves linear-time sequence modeling.',
  },
  {
    id: 'resnet-deep-residual-learning',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    year: '2015',
    tag: 'Computer Vision Foundation',
    arxivUrl: 'https://arxiv.org/abs/1512.03385',
    shortDesc: 'Introduced residual skip connections F(x) + x to train very deep neural networks up to 152 layers.',
  },
];
