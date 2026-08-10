import React, { useEffect, useRef } from 'react';
import { FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

export interface CitationHighlight {
  page: number;
  rects: number[][]; // [[x0, y0, x1, y1], ...]
  text?: string;
}

interface PDFViewerProps {
  title: string;
  activeHighlight: CitationHighlight | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  parsedSentences?: any[];
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  title,
  activeHighlight,
  currentPage,
  onPageChange,
  parsedSentences = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the highlight coordinate when it changes
  useEffect(() => {
    if (activeHighlight && containerRef.current) {
      onPageChange(activeHighlight.page);
      
      // Delay slightly to allow page rendering before scrolling
      setTimeout(() => {
        const highlightEl = document.getElementById('active-pdf-highlight');
        if (highlightEl) {
          highlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [activeHighlight]);

  // Determine dynamic total pages
  const totalPages = parsedSentences.length > 0 
    ? Math.max(...parsedSentences.map(s => s.page)) + 1 
    : 8;

  // Mock paper pages content matching 'Attention Is All You Need'
  const getPageContent = (page: number) => {
    // If we have dynamic parsed sentences, render them in double column flow!
    if (parsedSentences && parsedSentences.length > 0) {
      const pageSentences = parsedSentences.filter(s => s.page === page);
      if (pageSentences.length > 0) {
        const half = Math.ceil(pageSentences.length / 2);
        const leftCol = pageSentences.slice(0, half);
        const rightCol = pageSentences.slice(half);

        return (
          <div className="space-y-6 text-slate-800 font-serif relative">
            {/* Header banner inside document */}
            <div className="flex justify-between border-b border-slate-200 pb-1 text-[9px] text-slate-400 font-sans font-bold">
              <span>Page {page + 1}</span>
              <span className="uppercase">{title.replace(".pdf", "")}</span>
            </div>

            <div className="grid grid-cols-2 gap-6 text-[10px] leading-relaxed text-justify">
              {/* Left Column */}
              <div className="space-y-3">
                {leftCol.map((sentence, sIdx) => {
                  const isHighlighted = activeHighlight && 
                    activeHighlight.page === page && 
                    activeHighlight.text === sentence.text;

                  return (
                    <span 
                      key={sIdx}
                      className="relative inline p-0.5 rounded transition-all"
                    >
                      {isHighlighted && (
                        <span 
                          id="active-pdf-highlight"
                          className="absolute inset-0 bg-purple-500/20 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                        />
                      )}
                      <span className="relative z-0">{sentence.text} </span>
                    </span>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {rightCol.map((sentence, sIdx) => {
                  const isHighlighted = activeHighlight && 
                    activeHighlight.page === page && 
                    activeHighlight.text === sentence.text;

                  return (
                    <span 
                      key={sIdx}
                      className="relative inline p-0.5 rounded transition-all"
                    >
                      {isHighlighted && (
                        <span 
                          id="active-pdf-highlight"
                          className="absolute inset-0 bg-purple-500/20 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                        />
                      )}
                      <span className="relative z-0">{sentence.text} </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 font-sans space-y-2 py-40">
            <FileText className="w-12 h-12 opacity-30 text-slate-400" />
            <p className="text-xs">Page {page + 1}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">No structural text on this sheet</p>
          </div>
        );
      }
    }

    // Default static template content if no custom parsed sentences loaded
    switch (page) {
      case 0:
        return (
          <div className="space-y-6 text-slate-800 font-serif">
            <div className="text-center space-y-2 border-b border-slate-200 pb-4">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest block mb-1">ArXiv Preprint Archive</span>
              <h1 className="text-lg font-bold text-black uppercase tracking-tight leading-snug">Attention Is All You Need</h1>
              <p className="text-xs text-slate-600 font-sans">Ashish Vaswani*, Noam Shazeer*, Niki Parmar*, Jakob Uszkoreit*, Llion Jones*</p>
              <p className="text-[9px] text-slate-500 font-sans font-semibold">Google Brain / Google Research</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-[10.5px] leading-relaxed text-justify">
              <div className="space-y-3">
                <h3 className="font-sans font-bold text-black text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">Abstract</h3>
                <p className="italic text-slate-600 font-medium">
                  The dominant sequence transduction models are based on complex recurrent or convolutional neural networks 
                  in an encoder-decoder configuration. The best performing models also connect the encoder and decoder 
                  through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely 
                  on attention mechanisms, dispensing with recurrence and convolutions entirely.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-sans font-bold text-black text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">1. Introduction</h3>
                <p>
                  Recurrent neural networks, long short-term memory (LSTM) and gated recurrent (GRU) neural networks 
                  have been firmly established as state of the art approaches in sequence modeling. However, sequential 
                  computation inhibits parallel training within training examples, which becomes critical at longer sequence lengths.
                </p>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 text-slate-800 font-serif relative">
            <div className="flex justify-between border-b border-slate-200 pb-1 text-[9px] text-slate-400 font-sans font-bold">
              <span>Page 2</span>
              <span>ATTENTION IS ALL YOU NEED</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-[10.5px] leading-relaxed text-justify">
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-black text-[11px] uppercase border-b border-slate-200 pb-1">2. Background</h3>
                <p>
                  The goal of reducing sequential computation also goals the Extended Neural GPU, ByteNet and ConvS2S. 
                  In these models, the number of operations required to relate signals from two arbitrary input or output positions 
                  grows in the distance between positions, linearly for ConvS2S and logarithmically for ByteNet. 
                  This makes it more difficult to learn dependencies between distant positions.
                </p>
                
                {/* Active Highlight area */}
                <div className="relative p-1 rounded transition-colors duration-300">
                  {activeHighlight && activeHighlight.page === 1 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute inset-0 bg-purple-500/15 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                    />
                  )}
                  <p className="relative z-0">
                    <span className="font-bold text-black">The Transformer</span> is the first transduction model relying entirely on self-attention to compute representations of its input and output without using sequence-aligned RNNs or convolution.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <p>
                  Self-attention, sometimes called intra-attention, is an attention mechanism relating different positions of a single sequence 
                  in order to compute a representation of the sequence. Self-attention has been used successfully in a variety of tasks 
                  including reading comprehension, abstractive summarization, textual entailment and learning task-independent sentence representations.
                </p>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 text-slate-800 font-serif relative">
            <div className="flex justify-between border-b border-slate-200 pb-1 text-[9px] text-slate-400 font-sans font-bold">
              <span>Page 5</span>
              <span>ATTENTION IS ALL YOU NEED</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-[10.5px] leading-relaxed text-justify">
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-black text-[11px] uppercase border-b border-slate-200 pb-1">3.2 Multi-Head Attention</h3>
                
                <div className="relative p-1 rounded">
                  {activeHighlight && activeHighlight.page === 4 && activeHighlight.rects[0][1] !== 300 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute inset-0 bg-purple-500/15 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                    />
                  )}
                  <p className="relative z-0">
                    Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.
                  </p>
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-center">
                {/* Print style diagram container */}
                <div className="border border-slate-300 rounded-lg bg-slate-50/50 p-4 space-y-2 relative shadow-sm">
                  {activeHighlight && activeHighlight.page === 4 && activeHighlight.rects[0][1] === 300 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute -inset-1.5 border-2 border-dashed border-cyan-500 rounded-lg animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.5)] z-10"
                    />
                  )}
                  <div className="text-[9px] text-slate-600 font-sans font-bold uppercase tracking-wider text-center border-b border-slate-200 pb-1">
                    Figure 1: Multi-Head Attention Schema
                  </div>
                  <div className="h-28 flex items-center justify-center space-x-2 text-center text-[10px] font-sans">
                    <div className="bg-white border border-slate-350 p-1.5 rounded flex flex-col justify-between h-full shadow-sm text-slate-800 font-semibold">
                      <span className="text-slate-900">Linear</span>
                      <span className="text-slate-500 text-[8px] font-normal">Scaled Dot-Product</span>
                      <span className="text-slate-900">Concat</span>
                    </div>
                    <div className="text-slate-400">→</div>
                    <div className="bg-white border border-slate-350 p-2 rounded flex items-center justify-center font-bold text-slate-800 shadow-sm">
                      Linear Projection
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 text-slate-800 font-serif relative">
            <div className="flex justify-between border-b border-slate-200 pb-1 text-[9px] text-slate-400 font-sans font-bold">
              <span>Page 6</span>
              <span>ATTENTION IS ALL YOU NEED</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-[10.5px] leading-relaxed text-justify">
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-black text-[11px] uppercase border-b border-slate-200 pb-1">4. Complexity & Training</h3>
                <p>
                  We compare self-attention layers to recurrent and convolutional layers commonly used for mapping one variable-length 
                  sequence of symbol representations to another sequence of equal length.
                </p>
                
                <div className="relative p-1 rounded">
                  {activeHighlight && activeHighlight.page === 5 && activeHighlight.rects[0][1] < 300 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute inset-0 bg-purple-500/15 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                    />
                  )}
                  <p className="relative z-0">
                    Self-attention layers in the Transformer allow for significantly faster training times compared to recurrent or convolutional layers, reaching state-of-the-art results in just 12 hours.
                  </p>
                </div>
                
                <div className="relative p-1 rounded mt-4">
                  {activeHighlight && activeHighlight.page === 5 && activeHighlight.rects[0][1] >= 400 && activeHighlight.rects[0][1] < 500 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute inset-0 bg-purple-500/15 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                    />
                  )}
                  <p className="relative z-0">
                    On English-to-German, the Transformer base model achieves 27.3 BLEU after 100,000 steps, which required only 10 minutes of training on 8 GPUs compared to days for ByteNet or ConvS2S.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative p-1 rounded">
                  {activeHighlight && activeHighlight.page === 5 && activeHighlight.rects[0][1] >= 500 && activeHighlight.rects[0][1] < 600 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute inset-0 bg-purple-500/15 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                    />
                  )}
                  <p className="relative z-0">
                    Table 1: Complexity per Layer. Self-Attention complexity per layer is O(n^2 * d) compared to Recurrent which is O(n * d^2) as shown in Table 1.
                  </p>
                </div>
                
                <div className="relative p-1 rounded">
                  {activeHighlight && activeHighlight.page === 5 && activeHighlight.rects[0][1] >= 600 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute inset-0 bg-purple-500/15 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                    />
                  )}
                  <p className="relative z-0 text-slate-700">
                    While self-attention complexity per layer is computationally efficient when sequence length is smaller than dimensional projections, long document scaling introduces severe quadratic bottlenecks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 text-slate-800 font-serif relative">
            <div className="flex justify-between border-b border-slate-200 pb-1 text-[9px] text-slate-400 font-sans font-bold">
              <span>Page 7</span>
              <span>ATTENTION IS ALL YOU NEED</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-[10.5px] leading-relaxed text-justify">
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-black text-[11px] uppercase border-b border-slate-200 pb-1">5. Training Details</h3>
                <p>This section describes the training regime for our models.</p>
                
                <div className="relative p-1 rounded">
                  {activeHighlight && activeHighlight.page === 6 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute inset-0 bg-purple-500/15 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                    />
                  )}
                  <p className="relative z-0">
                    We trained on the standard WMT 2014 English-to-German dataset consisting of about 4.5 million sentence pairs. For English-to-French, we used the significantly larger WMT 2014 English-to-French dataset.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-black">5.1 Hardware and Schedule</h4>
                <p>
                  We trained our models on one machine with 8 NVIDIA P100 GPUs. For the base models, 
                  each training step took about 0.4 seconds. We trained the base models for a total of 100,000 steps 
                  or 12 hours. For our large models, paper constraints required 300,000 steps.
                </p>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 text-slate-800 font-serif relative">
            <div className="flex justify-between border-b border-slate-200 pb-1 text-[9px] text-slate-400 font-sans font-bold">
              <span>Page 8</span>
              <span>ATTENTION IS ALL YOU NEED</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-[10.5px] leading-relaxed text-justify">
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-black text-[11px] uppercase border-b border-slate-200 pb-1">6. Results</h3>
                
                <div className="relative p-1 rounded">
                  {activeHighlight && activeHighlight.page === 7 && activeHighlight.rects[0][1] < 300 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute inset-0 bg-purple-500/15 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                    />
                  )}
                  <p className="relative z-0">
                    The Transformer achieves a state-of-the-art translation quality of 28.4 BLEU on English-to-German and 41.8 BLEU on English-to-French translation benchmarks (Table 2).
                  </p>
                </div>

                <div className="relative p-1 rounded mt-4">
                  {activeHighlight && activeHighlight.page === 7 && activeHighlight.rects[0][1] >= 300 && (
                    <div 
                      id="active-pdf-highlight" 
                      className="absolute inset-0 bg-purple-500/15 border border-purple-500/30 rounded animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.3)] z-10"
                    />
                  )}
                  <p className="relative z-0">
                    We compare our translation benchmarks with other models. Our final large configuration establishes superior score distributions on English-to-German translation tasks.
                  </p>
                </div>
              </div>
              <div className="space-y-4 font-sans text-black">
                {/* Academic styled print table */}
                <div className="py-2 text-[9.5px]">
                  <div className="text-center font-bold text-black pb-2">
                    Table 2: BLEU Translation Benchmarks
                  </div>
                  <table className="w-full text-left border-t border-b border-black">
                    <thead>
                      <tr className="border-b border-black text-slate-700">
                        <th className="py-1">Model</th>
                        <th className="py-1">En-De</th>
                        <th className="py-1">En-Fr</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-800">
                      <tr>
                        <td className="py-0.5">ByteNet</td>
                        <td>26.3</td>
                        <td>39.2</td>
                      </tr>
                      <tr>
                        <td className="py-0.5">ConvS2S</td>
                        <td>26.36</td>
                        <td>41.29</td>
                      </tr>
                      <tr className="font-semibold text-black bg-slate-100">
                        <td className="py-0.5">Transformer (base)</td>
                        <td>27.3</td>
                        <td>38.1</td>
                      </tr>
                      <tr className="font-bold text-black bg-slate-200">
                        <td className="py-0.5">Transformer (big)</td>
                        <td>28.4</td>
                        <td>41.8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 font-sans space-y-2 py-20">
            <FileText className="w-12 h-12 opacity-30 text-slate-400" />
            <p>Page {page + 1} of parsed PDF structure.</p>
            <p className="text-[10px] text-slate-500">Dynamic coordinate highlights active on pages 2, 5, 6, 7 and 8.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Viewer Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="bg-purple-950/60 p-1.5 rounded-lg border border-purple-500/30">
            <FileText className="w-4 h-4 text-cyber-purple" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white line-clamp-1">{title}</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold font-sans">Active Document Workspace</p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 font-sans">
            <button 
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-300 font-mono px-3 font-semibold">
              {currentPage + 1} / {totalPages}
            </span>
            <button 
              onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-1 border-l border-slate-800 pl-3 font-sans">
            <button className="p-1 text-slate-500 hover:text-slate-300"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="text-[10px] font-mono text-slate-500 font-bold">100%</span>
            <button className="p-1 text-slate-500 hover:text-slate-300"><ZoomIn className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Pages Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-8 bg-slate-950 flex justify-center border-b border-slate-800 relative scroll-smooth"
      >
        {/* Highlight Alert Layer (PULSING) */}
        {activeHighlight && (
          <div className="absolute top-2 left-2 right-2 bg-purple-950/80 border border-purple-500/30 px-3 py-1.5 rounded-lg text-[10px] text-purple-200 backdrop-blur-md flex justify-between items-center z-20 shadow-lg animate-pulse">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyber-purple animate-spin" />
              <span className="font-bold text-cyber-purple uppercase tracking-wider mr-1.5">Grounded Citation:</span>
              Page {activeHighlight.page + 1} highlighted in neon purple.
            </span>
            <span className="text-[9px] bg-purple-900/60 border border-purple-500/20 px-1.5 py-0.5 rounded text-white font-semibold">
              SECURE
            </span>
          </div>
        )}

        {/* Paper Page Sheet - Crisp White Serif Document Layout */}
        <div className="w-[595px] min-h-[842px] bg-white border border-slate-200 rounded-lg p-12 shadow-2xl relative font-serif text-slate-800 text-[10.5px]">
          {getPageContent(currentPage)}
        </div>
      </div>
    </div>
  );
};
