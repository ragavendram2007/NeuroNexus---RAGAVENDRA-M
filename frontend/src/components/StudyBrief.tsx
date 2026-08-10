import React, { useState } from 'react';
import { ShieldAlert, CheckSquare, Sparkles, FileSearch, Terminal as CodeIcon } from 'lucide-react';

interface Claim {
  id: string;
  text: string;
  page: number;
  rects: number[][];
}

interface Evidence {
  id: string;
  text: string;
  target_claim_id: string;
  page: number;
  rects: number[][];
}

interface Warning {
  id: string;
  text: string;
  target_claim_id: string;
  page: number;
  rects: number[][];
  severity: 'high' | 'medium' | 'low';
}

interface StudyBriefProps {
  summary: string;
  eli5_summary: string;
  claims: Claim[];
  evidence: Evidence[];
  warnings: Warning[];
  onQuoteClick: (page: number, rects: number[][], text: string) => void;
  research_gaps?: any[];
  onGenerateCode?: (claimId: string) => void;
  codeImplementations?: Record<string, any>;
}

export const StudyBrief: React.FC<StudyBriefProps> = ({
  summary,
  eli5_summary,
  claims,
  evidence,
  warnings,
  onQuoteClick,
  research_gaps = [],
  onGenerateCode,
  codeImplementations = {},
}) => {
  const [isELI5, setIsELI5] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'claims' | 'audits' | 'gaps'>('summary');

  return (
    <div className="space-y-6 animate-fade-in text-slate-300">
      {/* ELI5 / Jargon Toggle Switch */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <div>
            <span className="text-xs font-bold text-white block uppercase tracking-wider">Comprehension Level</span>
            <span className="text-[10px] text-slate-500">Toggle simple terms translation & analogies</span>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <button 
          onClick={() => setIsELI5(!isELI5)}
          className="relative inline-flex h-6 w-24 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-850 hover:bg-slate-800 select-none"
        >
          <span 
            className={`pointer-events-none inline-block h-5 w-12 transform rounded-full bg-gradient-to-r ${
              isELI5 ? 'from-purple-600 to-cyan-500 translate-x-10 text-white' : 'from-slate-700 to-slate-600 translate-x-0 text-slate-300'
            } shadow ring-0 transition duration-200 ease-in-out text-[9px] font-bold uppercase tracking-wider flex items-center justify-center`}
          >
            {isELI5 ? 'ELI5' : 'ACADEMIC'}
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-850 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('summary')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
            activeTab === 'summary' ? 'border-cyber-cyan text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Summary Brief
        </button>
        <button 
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
            activeTab === 'claims' ? 'border-cyber-cyan text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Claims & Evidence ({claims.length + evidence.length})
        </button>
        <button 
          onClick={() => setActiveTab('audits')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
            activeTab === 'audits' ? 'border-cyber-orange text-white animate-pulse' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Peer Audits ({warnings.length})
        </button>
        <button 
          onClick={() => setActiveTab('gaps')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
            activeTab === 'gaps' ? 'border-purple-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          🔬 Research Gaps ({research_gaps.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        {activeTab === 'summary' && (
          <div className="space-y-4 leading-relaxed font-sans text-sm font-medium animate-fade-in">
            {isELI5 ? (
              <div className="bg-purple-950/20 border border-purple-900/30 p-5 rounded-2xl relative shadow-inner">
                <div className="absolute top-3 right-3 text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-widest">
                  Analogy Mode
                </div>
                <p className="text-purple-100 text-xs leading-relaxed italic">
                  "{eli5_summary}"
                </p>
              </div>
            ) : (
              <p className="text-slate-300 text-xs leading-relaxed text-justify">
                {summary}
              </p>
            )}
            
            <div className="border-t border-slate-850 pt-4 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <FileSearch className="w-3.5 h-3.5 text-cyber-cyan" />
                Click claims below to verify in source PDF
              </span>
              <span className="font-semibold text-emerald-400">Grounded in Vector DB</span>
            </div>
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="space-y-4 animate-fade-in">
            {claims.map((claim) => (
              <div key={claim.id} className="space-y-2 border border-slate-850 rounded-xl p-4 bg-slate-900/30 hover:border-slate-800 transition">
                {/* Claim Box */}
                <div 
                  onClick={() => onQuoteClick(claim.page, claim.rects, claim.text)}
                  className="border-l-2 border-cyan-500 pl-3 cursor-pointer hover:bg-slate-850/40 p-1.5 rounded transition relative group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400">CLAIM ASSERTION</span>
                    <div className="flex items-center space-x-2">
                      {codeImplementations[claim.id] && onGenerateCode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onGenerateCode(claim.id);
                          }}
                          className="text-[9px] font-mono bg-purple-950/40 hover:bg-purple-900/60 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded transition uppercase tracking-wider flex items-center gap-1 hover:text-white"
                        >
                          <CodeIcon className="w-2.5 h-2.5" />
                          Code Implementation
                        </button>
                      )}
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-cyber-cyan transition">Jump to Source →</span>
                    </div>
                  </div>
                  <p className="text-white text-xs leading-relaxed">{claim.text}</p>
                </div>
                
                {/* Evidence matching the claim */}
                {evidence.filter(ev => ev.target_claim_id === claim.id).map(ev => (
                  <div 
                    key={ev.id}
                    onClick={() => onQuoteClick(ev.page, ev.rects, ev.text)}
                    className="border-l-2 border-emerald-500 pl-3 ml-4 cursor-pointer hover:bg-slate-850/40 p-1.5 rounded transition relative group bg-emerald-950/10"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <CheckSquare className="w-3 h-3" />
                        Grounded Evidence
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-emerald-400 transition">Jump to Source →</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed italic">"{ev.text}"</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audits' && (
          <div className="space-y-4 animate-fade-in">
            {warnings.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No rigor warnings detected by the Auditor Agent.
              </div>
            ) : (
              warnings.map((warn) => (
                <div 
                  key={warn.id}
                  onClick={() => onQuoteClick(warn.page, warn.rects, warn.text)}
                  className="border-l-2 border-orange-500 pl-3 cursor-pointer bg-orange-950/10 border border-orange-950/20 rounded-xl p-4 hover:bg-orange-950/20 transition relative group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5 animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Auditor Peer Critique
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 group-hover:text-orange-400 transition">Inspect Bounding Box →</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed font-sans font-medium mb-2">
                    {warn.text}
                  </p>
                  <div className="flex justify-between items-center text-[9px] text-slate-500">
                    <span>Severity: <span className="text-orange-400 font-bold uppercase">{warn.severity}</span></span>
                    <span className="font-semibold text-cyber-purple uppercase tracking-widest bg-purple-950/30 border border-purple-800/20 px-2 py-0.5 rounded">
                      Grounded
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="space-y-4 animate-fade-in">
            {research_gaps.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No research gaps identified.
              </div>
            ) : (
              research_gaps.map((gap) => (
                <div key={gap.id} className="border border-slate-800 rounded-xl p-4 bg-slate-900/30 space-y-3 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                      🔬 Predicted Research Gap
                    </span>
                    <span className="text-[9px] bg-purple-950/60 border border-purple-900/30 text-purple-400 font-mono font-bold px-2 py-0.5 rounded">
                      Impact: High
                    </span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight leading-snug">
                    {gap.title}
                  </h4>
                  
                  <div className="space-y-2.5 text-[11px] leading-relaxed text-slate-300">
                    <p><strong className="text-slate-400 uppercase tracking-wide text-[9px] block mb-0.5">Scientific Drawback:</strong> {gap.drawback}</p>
                    <p><strong className="text-cyber-cyan uppercase tracking-wide text-[9px] block mb-0.5">Proposed Hackathon / Thesis Project:</strong> {gap.project_proposal}</p>
                  </div>
                  
                  <div className="text-[9px] text-slate-500 flex justify-between items-center border-t border-slate-850/60 pt-2">
                    <span>Scope: Open Research</span>
                    <span className="text-purple-400 font-semibold italic">{gap.impact}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
