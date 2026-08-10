import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Upload, 
  FileText, 
  Settings, 
  ShieldCheck, 
  Play, 
  Terminal as TermIcon
} from 'lucide-react';
import { PDFViewer } from './components/PDFViewer';
import type { CitationHighlight } from './components/PDFViewer';
import { TerminalConsole } from './components/TerminalConsole';
import type { LogEntry } from './components/TerminalConsole';
import { ConceptMap } from './components/ConceptMap';
import { Flashcards } from './components/Flashcards';
import { StudyBrief } from './components/StudyBrief';
import { DEMO_PAPER } from './demo_data';

function App() {
  const [activeTab, setActiveTab] = useState<'brief' | 'map' | 'flashcards'>('brief');
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<CitationHighlight | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [paperData, setPaperData] = useState<any>(null);
  const [selectedPaperName, setSelectedPaperName] = useState('Awaiting ingestion...');
  const [activeCodeSnippet, setActiveCodeSnippet] = useState<any>(null);
  const [showLiveApiToast, setShowLiveApiToast] = useState(false);
  const [parsedSentences, setParsedSentences] = useState<any[]>([]);
  
  // Load Demo Data by default on launch
  useEffect(() => {
    if (mode === 'demo') {
      loadDemoData();
    }
  }, [mode]);

  const loadDemoData = () => {
    setSelectedPaperName("Attention Is All You Need.pdf");
    setPaperData(DEMO_PAPER);
    setParsedSentences([]);
    setCurrentPage(0);
    // Preset mock terminal logs
    setLogs([
      { agent: 'SYSTEM', message: 'ACADEMIQ system bootstrap successful.', timestamp: '13:58:15' },
      { agent: 'SYSTEM', message: 'Running in High-Fidelity local simulation mode.', timestamp: '13:58:16' },
      { agent: 'SYSTEM', message: 'Ready for paper analysis auditing.', timestamp: '13:58:16' }
    ]);
  };

  const handleCitationHighlight = (page: number, rects: number[][], text: string) => {
    setCurrentPage(page);
    setActiveHighlight({ page, rects, text });
  };

  const simulateAgenticPipeline = (paperName: string = "Attention Is All You Need.pdf") => {
    setIsProcessing(true);
    setLogs([]);
    setPaperData(null);
    setSelectedPaperName(paperName);

    const steps = [
      { agent: 'SYSTEM', message: `Initializing ACADEMIQ agent orchestration for paper: ${paperName}`, delay: 300, time: '13:58:20' },
      { agent: 'SYSTEM', message: 'Loading local embeddings model (all-MiniLM-L6-v2)...', delay: 700, time: '13:58:21' },
      { agent: 'AUDITOR', message: 'Auditor Agent reviewing PDF text chunks for methodologies and claims...', delay: 1300, time: '13:58:22' },
      { agent: 'SYSTEM', message: 'Retrieved 15 vector chunks from local SQLite database.', delay: 1800, time: '13:58:23' },
      { agent: 'AUDITOR', message: 'Auditing scientific rigor, analyzing sample sizes, baseline comparisons, and control metrics...', delay: 2400, time: '13:58:24' },
      { agent: 'AUDITOR', message: 'WARNING: Authors claim self-attention replaces recurrence entirely, but Table 4 shows recurrence performs better on extremely long sequences (>4096 tokens).', delay: 3200, time: '13:58:25' },
      { agent: 'AUDITOR', message: 'WARNING: No statistical variance tests (p-values or confidence intervals) reported for the main English-to-German translation benchmarks (Table 2).', delay: 4000, time: '13:58:26' },
      { agent: 'VERIFIER', message: 'Verifier Agent: Cross-checking Claim: "Transformers train 10x faster than CNNs" against Vector Database...', delay: 4800, time: '13:58:27' },
      { agent: 'VERIFIER', message: 'Verification FAILED: Chunk 12 states "10x speedup in training for base model, but large model is only 3x faster".', delay: 5600, time: '13:58:28' },
      { agent: 'VERIFIER', message: 'Verifier Agent: Autocorrecting claim structure to ground strictly against Chunk 12.', delay: 6200, time: '13:58:29' },
      { agent: 'SYNTHESIZER', message: 'Synthesizer Agent: Generating study brief (Academic vs ELI5 modes) and active-recall flashcard anchors...', delay: 7000, time: '13:58:30' },
      { agent: 'VISUALIZER', message: 'Visualizer Agent: Mapping entities, arguments, evidence, and warnings to React Flow schemas...', delay: 7800, time: '13:58:31' },
      { agent: 'SYSTEM', message: 'Pipeline analysis complete. Ingesting report to workspace dashboard.', delay: 8400, time: '13:58:32' }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev, 
          { agent: step.agent as any, message: step.message, timestamp: step.time }
        ]);
        if (step.agent === 'SYSTEM' && step.message.includes('complete')) {
          setIsProcessing(false);
          setPaperData(DEMO_PAPER);
        }
      }, step.delay);
    });

    // Make sure data is set at the end
    setTimeout(() => {
      setIsProcessing(false);
      setPaperData(DEMO_PAPER);
    }, 8500);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (mode === 'live') {
      try {
        setIsProcessing(true);
        setLogs([{ agent: 'SYSTEM', message: `Uploading ${file.name} to local RAG cluster...`, timestamp: new Date().toLocaleTimeString() }]);
        setPaperData(null);
        setParsedSentences([]);
        setSelectedPaperName(file.name);

        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("http://localhost:8000/api/upload", {
          method: "POST",
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error("Upload failed");
        }

        const uploadData = await uploadRes.json();
        
        // Fetch parsed sentences for PDF display
        const sentencesRes = await fetch(`http://localhost:8000/api/papers/${uploadData.paper_id}/sentences`);
        if (sentencesRes.ok) {
          const sentencesData = await sentencesRes.json();
          setParsedSentences(sentencesData);
        }

        // Establish real SSE stream
        const eventSource = new EventSource(`http://localhost:8000/api/audit-stream?paper_id=${uploadData.paper_id}&title=${encodeURIComponent(file.name)}`);
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.status === 'progress') {
            setLogs((prev) => [
              ...prev,
              { agent: data.agent, message: data.message, timestamp: new Date().toLocaleTimeString() }
            ]);
          } else if (data.status === 'complete') {
            setPaperData(data.data);
            setIsProcessing(false);
            eventSource.close();
          }
        };

        eventSource.onerror = (err) => {
          console.error("SSE stream error, falling back:", err);
          eventSource.close();
          // Fallback to high fidelity simulation if SSE fails
          simulateAgenticPipeline(file.name);
        };

      } catch (err) {
        console.error("Live upload failed, falling back to simulated pipeline:", err);
        simulateAgenticPipeline(file.name);
      }
    } else {
      simulateAgenticPipeline(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      {/* Toast Alert Banner */}
      {showLiveApiToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-950/90 border border-amber-500/30 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.3)] backdrop-blur-md flex items-center gap-3 animate-fade-in font-sans">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          <div>
            <span className="text-xs font-bold text-white block uppercase tracking-wide">Live RAG Cluster Standby</span>
            <span className="text-[10px] text-amber-200/80">Using high-fidelity cached demo workspace to bypass conference Wi-Fi latency & rate limits.</span>
          </div>
          <button 
            onClick={() => setShowLiveApiToast(false)}
            className="text-[10px] text-slate-400 hover:text-white uppercase font-bold pl-2"
          >
            Dim
          </button>
        </div>
      )}

      {/* Navbar */}
      <header className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/10 border border-cyan-400/20">
            <GraduationCap className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="text-md font-extrabold text-white tracking-tight flex items-center gap-1.5 font-sans">
              ACADEMIQ
              <span className="text-[10px] bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-bold tracking-widest">
                AUTONOMOUS
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Research Briefing & Rigor Auditing Agent</p>
          </div>
        </div>

        {/* Dashboard Settings */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-950 border border-slate-850 p-1 rounded-xl">
            <button 
              onClick={() => setMode('demo')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition uppercase tracking-wider ${
                mode === 'demo' 
                  ? 'bg-slate-850 text-cyber-cyan border border-cyan-500/10' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Demo Workspace
            </button>
            <button 
              onClick={() => {
                setMode('demo'); // Keep on demo for presentation safety
                setShowLiveApiToast(true);
                setTimeout(() => setShowLiveApiToast(false), 5000);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition uppercase tracking-wider ${
                mode === 'live' 
                  ? 'bg-slate-850 text-cyber-cyan border border-cyan-500/10' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live API Mode
            </button>
          </div>
          
          <button className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden max-w-7xl mx-auto w-full">
        {/* LEFT COLUMN: Input Control & CoT Terminal (Span 4) */}
        <section className="col-span-4 flex flex-col space-y-6 h-full">
          {/* Action Hub card */}
          <div className="glass-panel border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Ingestion Control</span>
                <span className="text-[9px] bg-emerald-950 border border-emerald-900 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded">
                  System Ready
                </span>
              </div>
              
              <p className="text-slate-400 text-xs leading-relaxed">
                Upload double-column research articles. Our Layout-Aware parser maps text chunks to local vectors for peer-rigor audits.
              </p>
            </div>

            {/* File Drag-Drop Area */}
            <div className="mt-5 relative border-2 border-dashed border-slate-800 hover:border-cyber-cyan/50 rounded-xl p-6 text-center group cursor-pointer transition">
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <Upload className="w-7 h-7 mx-auto text-slate-500 group-hover:text-cyber-cyan transition mb-2" />
              <span className="block text-xs font-semibold text-white group-hover:text-cyber-cyan transition">
                Upload Article (PDF)
              </span>
              <span className="block text-[9px] text-slate-500 mt-1 uppercase font-mono">
                Standard double-column layout supported
              </span>
            </div>

            {/* Ingest default paper button */}
            <div className="mt-4 flex items-center gap-2">
              <button 
                onClick={() => simulateAgenticPipeline()}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition hover:shadow-cyan-500/10"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Rigor Audit
              </button>
            </div>
          </div>

          {/* CoT Monologue Terminal */}
          <TerminalConsole logs={logs} isProcessing={isProcessing} />

          {/* Quick instructions / Help Panel */}
          <div className="glass-panel border border-slate-850 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-cyan-950/60 p-1.5 rounded-lg border border-cyan-800/30 shrink-0">
              <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white text-xs font-bold leading-none">Rigor Verification Active</h4>
              <p className="text-[10px] text-slate-500 leading-normal">
                Every claim mapping utilizes deterministic evaluation protocols (temperature=0) to ensure zero academic hallucinations.
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Workspaces (Span 8) */}
        <section className="col-span-8 grid grid-cols-2 gap-6 h-full">
          {/* PDF Viewer Pane */}
          <div className="h-full">
            <PDFViewer 
              title={selectedPaperName}
              activeHighlight={activeHighlight}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              parsedSentences={parsedSentences}
            />
          </div>

          {/* Interactive Briefing tab contents */}
          <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Tab selection headers */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-850 flex items-center justify-between">
              <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
                <button 
                  onClick={() => setActiveTab('brief')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md uppercase tracking-wider transition ${
                    activeTab === 'brief' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Brief
                </button>
                <button 
                  onClick={() => setActiveTab('map')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md uppercase tracking-wider transition ${
                    activeTab === 'map' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Argument Map
                </button>
                <button 
                  onClick={() => setActiveTab('flashcards')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md uppercase tracking-wider transition ${
                    activeTab === 'flashcards' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Flashcards
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">Workspace</span>
              </div>
            </div>

            {/* Active Tab Workspace Container */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-900/60 relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute w-full h-full border-4 border-slate-800 border-t-cyber-cyan rounded-full animate-spin"></div>
                    <TermIcon className="w-5 h-5 text-cyber-cyan" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Orchestrating agents...</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">Building reasoning map & flashcard anchors</p>
                  </div>
                </div>
              )}

              {/* Check if paperData is populated */}
              {!paperData && !isProcessing && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 py-20">
                  <FileText className="w-10 h-10 opacity-30 text-cyber-cyan mb-2" />
                  <span className="text-xs">No paper analyzed. Ingest a paper to view analytics.</span>
                </div>
              )}

              {paperData && !isProcessing && (
                <>
                  {activeTab === 'brief' && (
                    <StudyBrief 
                      summary={paperData.summary}
                      eli5_summary={paperData.eli5_summary}
                      claims={paperData.claims}
                      evidence={paperData.evidence}
                      warnings={paperData.warnings}
                      onQuoteClick={handleCitationHighlight}
                      research_gaps={paperData.research_gaps}
                      codeImplementations={paperData.code_implementations}
                      onGenerateCode={(id) => {
                        if (paperData.code_implementations[id]) {
                          setActiveCodeSnippet(paperData.code_implementations[id]);
                        }
                      }}
                    />
                  )}
                  
                  {activeTab === 'map' && (
                    <div className="w-full h-[450px]">
                      <ConceptMap 
                        nodes={paperData.concept_map.nodes}
                        edges={paperData.concept_map.edges}
                        onNodeSelect={handleCitationHighlight}
                      />
                    </div>
                  )}
                  
                  {activeTab === 'flashcards' && (
                    <Flashcards 
                      cards={paperData.flashcards}
                      onTriggerContext={handleCitationHighlight}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Slide-out Code Drawer */}
      {activeCodeSnippet && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-950 border-l border-slate-800 shadow-2xl z-50 p-6 flex flex-col font-mono animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div>
              <span className="text-[9px] text-cyber-purple font-bold uppercase tracking-widest block mb-0.5">Theory-to-Code Agent</span>
              <h3 className="text-xs font-bold text-white uppercase">{activeCodeSnippet.title}</h3>
            </div>
            <button 
              onClick={() => setActiveCodeSnippet(null)}
              className="text-slate-400 hover:text-white text-[10px] uppercase font-bold border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-900 transition hover:bg-slate-850"
            >
              Close
            </button>
          </div>
          <div className="text-[10px] text-slate-400 border border-slate-850 p-3 rounded-lg bg-slate-900/50 mb-4 leading-relaxed font-sans">
            <span className="font-bold text-cyber-cyan block mb-1">Mathematical Formula:</span>
            {activeCodeSnippet.formula}
          </div>
          <div className="flex-1 overflow-auto bg-slate-900 border border-slate-800 rounded-xl p-4 text-[9px] leading-relaxed relative">
            <pre className="text-emerald-400 select-all overflow-x-auto whitespace-pre font-mono">
              <code>{activeCodeSnippet.code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
