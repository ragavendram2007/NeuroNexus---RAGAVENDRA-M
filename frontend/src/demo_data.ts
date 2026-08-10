export const DEMO_PAPER = {
  paper_id: "attention_is_all_you_need",
  title: "Attention Is All You Need",
  summary: "The paper proposes the Transformer, a novel network architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. The model achieves 28.4 BLEU on English-to-German and 41.8 BLEU on English-to-French, establishing a new state-of-the-art.",
  eli5_summary: "Imagine a crowded cocktail party. Instead of listening to everyone from left to right (like RNNs do), you immediately focus only on the people talking about topics relevant to you. That's Self-Attention. The Transformer architecture replaces the slow 'word-by-word' processing of older models with a parallel system where words can 'talk' to all other words simultaneously. It's like reading an entire page of a book at once rather than scanning it word-by-word with a magnifying glass.",
  claims: [
    {
      id: "claim_1",
      text: "The Transformer is the first transduction model relying entirely on self-attention to compute representations of its input and output without using sequence-aligned RNNs or convolution.",
      page: 1,
      rects: [[80, 120, 500, 160]]
    },
    {
      id: "claim_2",
      text: "Self-attention layers in the Transformer allow for significantly faster training times compared to recurrent or convolutional layers, reaching state-of-the-art results in just 12 hours.",
      page: 5,
      rects: [[90, 240, 510, 280]]
    },
    {
      id: "claim_3",
      text: "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions.",
      page: 4,
      rects: [[100, 310, 480, 350]]
    }
  ],
  evidence: [
    {
      id: "ev_1",
      text: "The Transformer achieves a state-of-the-art translation quality of 28.4 BLEU on English-to-German and 41.8 BLEU on English-to-French translation benchmarks (Table 2).",
      target_claim_id: "claim_1",
      page: 7,
      rects: [[120, 210, 480, 260]]
    },
    {
      id: "ev_2",
      text: "On English-to-German, the Transformer base model achieves 27.3 BLEU after 100,000 steps, which required only 10 minutes of training on 8 GPUs compared to days for ByteNet or ConvS2S.",
      target_claim_id: "claim_2",
      page: 5,
      rects: [[100, 400, 490, 450]]
    }
  ],
  warnings: [
    {
      id: "warn_1",
      text: "No statistical significance tests, variance intervals, or multiple run averages are reported for the BLEU scores. A single peak run is utilized to claim state-of-the-art superiority.",
      target_claim_id: "claim_1",
      page: 7,
      rects: [[120, 320, 480, 360]],
      severity: "high" as const
    },
    {
      id: "warn_2",
      text: "While training complexity is O(1) in sequential steps, the memory complexity of self-attention scales quadratically O(n^2) with sequence length, making long-context processing highly memory prohibitive.",
      target_claim_id: "claim_2",
      page: 5,
      rects: [[90, 600, 510, 650]],
      severity: "medium" as const
    }
  ],
  flashcards: [
    {
      id: "fc_1",
      question: "How does the computational complexity per layer of Self-Attention compare to Recurrent layers for sequence length n and dimension d?",
      answer: "Self-attention layers have a complexity of O(n^2 * d) per layer, whereas Recurrent layers have a complexity of O(n * d^2). Self-attention is faster when the sequence length n is smaller than the representation dimension d.",
      supporting_text: "Self-Attention complexity per layer is O(n^2 * d) compared to Recurrent which is O(n * d^2) as shown in Table 1.",
      page: 5,
      rects: [[85, 520, 500, 570]]
    },
    {
      id: "fc_2",
      question: "What primary translation dataset was used for training the English-to-German models?",
      answer: "The models were trained on the standard WMT 2014 English-to-German dataset containing approximately 4.5 million sentence pairs.",
      supporting_text: "We trained on the standard WMT 2014 English-to-German dataset consisting of about 4.5 million sentence pairs.",
      page: 6,
      rects: [[90, 150, 490, 190]]
    },
    {
      id: "fc_3",
      question: "What optimizer and learning rate schedule were used for training the Transformer?",
      answer: "The Adam optimizer was used with beta1=0.9, beta2=0.98, and epsilon=1e-9. The learning rate was varied warm-up style: increasing linearly for 4,000 steps and then decreasing proportionally to the inverse square root of the step number.",
      supporting_text: "We used the Adam optimizer with beta_1 = 0.9, beta_2 = 0.98 and epsilon = 10^-9. We varied the learning rate over the course of training according to the formula.",
      page: 7,
      rects: [[80, 110, 500, 170]]
    }
  ],
  concept_map: {
    nodes: [
      {
        id: "claim_1",
        type: "custom",
        data: { 
          title: "CLAIM 1: Pure Self-Attention",
          type: "claim",
          description: "Replaces recurrence/convolutions entirely to compute input/output representations.",
          page: 1,
          rects: [[80, 120, 500, 160]]
        },
        position: { x: 50, y: 50 }
      },
      {
        id: "ev_1",
        type: "custom",
        data: { 
          title: "EVIDENCE: SOTA BLEU Scores",
          type: "evidence",
          description: "Achieved 28.4 BLEU (En-De) and 41.8 BLEU (En-Fr) outperforming existing models.",
          page: 7,
          rects: [[120, 210, 480, 260]]
        },
        position: { x: 50, y: 250 }
      },
      {
        id: "warn_1",
        type: "custom",
        data: { 
          title: "AUDIT: Missing Significance Tests",
          type: "warning",
          description: "No confidence intervals or variance metrics are provided. Claims rely on peak score runs.",
          page: 7,
          rects: [[120, 320, 480, 360]]
        },
        position: { x: 380, y: 250 }
      },
      {
        id: "claim_2",
        type: "custom",
        data: { 
          title: "CLAIM 2: Fast Parallel Training",
          type: "claim",
          description: "Highly parallelizable layers translate to dramatically faster training times.",
          page: 5,
          rects: [[90, 240, 510, 280]]
        },
        position: { x: 750, y: 50 }
      },
      {
        id: "ev_3",
        type: "custom",
        data: { 
          title: "VISUAL DATA: Figure 1 Multi-Head Attention",
          type: "evidence",
          description: "Vision Analysis: The Y-axis dimensions show the multi-head subspace projection (h=8, d_k=64). However, the linear mapping layers represent 98% of parameter volume compared to the self-attention matrices.",
          page: 4,
          rects: [[100, 300, 500, 750]] // Bounding box for the Multi-Head Attention diagram
        },
        position: { x: 750, y: 250 }
      },
      {
        id: "warn_2",
        type: "custom",
        data: { 
          title: "AUDIT: Quadratic Scalability",
          type: "warning",
          description: "O(n^2) scaling per layer relative to sequence length makes it memory prohibitive for long documents.",
          page: 5,
          rects: [[90, 600, 510, 650]]
        },
        position: { x: 380, y: 50 }
      }
    ],
    edges: [
      { id: "e1", source: "claim_1", target: "ev_1", label: "supported_by", animated: true, style: { stroke: '#10b981' } },
      { id: "e2", source: "ev_1", target: "warn_1", label: "weakened_by", style: { stroke: '#f97316' } },
      { id: "e3", source: "claim_2", target: "ev_3", label: "supported_by", animated: true, style: { stroke: '#10b981' } },
      { id: "e4", source: "claim_2", target: "warn_2", label: "refined_by", style: { stroke: '#a855f7' } }
    ]
  },
  
  // Theory-to-code implementations list
  code_implementations: {
    "claim_3": {
      title: "Multi-Head Attention",
      formula: "MultiHead(Q, K, V) = Concat(head_1, ..., head_h)W^O",
      code: `import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        assert d_model % num_heads == 0
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        # Projections for Q, K, V and Output W^O
        self.q_linear = nn.Linear(d_model, d_model)
        self.k_linear = nn.Linear(d_model, d_model)
        self.v_linear = nn.Linear(d_model, d_model)
        self.out_linear = nn.Linear(d_model, d_model)
        
    def forward(self, q, k, v, mask=None):
        batch_size = q.size(0)
        
        # 1. Project and split into 'num_heads'
        q = self.q_linear(q).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        k = self.k_linear(k).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        v = self.v_linear(v).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        # 2. Scaled Dot-Product Attention
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attention_weights = torch.softmax(scores, dim=-1)
        output = torch.matmul(attention_weights, v)
        
        # 3. Concatenate heads and project output
        output = output.transpose(1, 2).contiguous().view(batch_size, -1, self.num_heads * self.d_k)
        return self.out_linear(output)`
    },
    "claim_1": {
      title: "Scaled Dot-Product Attention",
      formula: "Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V",
      code: `import torch
import math

def scaled_dot_product_attention(q, k, v, mask=None):
    """
    Computes Scaled Dot-Product Attention as described in Section 3.2.1
    Inputs:
        q: Query tensor of shape [batch, heads, seq_len_q, d_k]
        k: Key tensor of shape [batch, heads, seq_len_k, d_k]
        v: Value tensor of shape [batch, heads, seq_len_v, d_v]
        mask: Optional binary mask for padding/causal masking
    """
    d_k = q.size(-1)
    
    # Compute similarity matrix: Q K^T
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    
    # Apply attention mask (e.g. for decoder causal mask)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
        
    # Softmax along keys dimension to get weights
    attention_weights = torch.softmax(scores, dim=-1)
    
    # Multiply by values: weights x V
    output = torch.matmul(attention_weights, v)
    
    return output, attention_weights`
    }
  },

  // Research Gaps Predictor (Ideation Engine)
  research_gaps: [
    {
      id: "gap_1",
      title: "Empirical Evaluation of Transformer Scaling on Morphological Languages",
      drawback: "The authors benchmarked primarily on English, German, and French, which have relatively simple, non-agglutinative structures. There is a research gap in testing self-attention scaling on highly agglutinative languages (e.g., Turkish, Finnish) or morphologically rich languages (e.g., Arabic) where subword tokenization degrades representation.",
      project_proposal: "Deploy the open-source Transformer architecture using character-level or byte-level tokenizers (like CANINE or Mamba-style byte encodings) on WMT translation datasets for Arabic/Turkish and compare BLEU scores against standard subword BPE baselines.",
      impact: "Saves up to 40% parameter vocabulary overhead while improving vocabulary out-of-domain translation robustness on morphologically rich languages."
    },
    {
      id: "gap_2",
      title: "Mitigating Self-Attention Quadratic Scaling via Sparse Linear Routing",
      drawback: "Memory complexity of self-attention scales quadratically O(n^2) with sequence length, causing severe bottlenecks for context sizes larger than 4096 tokens, limiting long document retrieval.",
      project_proposal: "Replace the standard soft-max full attention matrix with random Fourier feature approximations (like Performer) or local block-wise sliding attention mechanisms. Benchmark token generation throughput and perplexity.",
      impact: "Reduces memory footprint from O(n^2) to linear O(n), enabling real-time processing of entire books/clinical trials on commodity GPU hardware."
    },
    {
      id: "gap_3",
      title: "Ablation of Multi-Head Dimension vs Head Count Under Fixed Parameter Budgets",
      drawback: "Section 6.2 asserts fixed parameter configurations (d_model=512) but doesn't mathematically isolate why 8 heads of 64 dimensions is optimal compared to 16 heads of 32 dimensions under identical parameter volumes.",
      project_proposal: "Train a matrix of base Transformers on the Multi30k translation dataset, holding total parameters constant while scaling head count from 2 to 32. Analyze performance variance to verify if representation subspace diversity is essential.",
      impact: "Provides definitive dimensional optimization rules for LLM architectures, preventing expensive hyperparameter sweep trials."
    }
  ]
};
