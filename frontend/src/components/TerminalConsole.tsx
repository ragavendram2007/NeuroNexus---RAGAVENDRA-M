import React, { useEffect, useRef } from 'react';
import { Terminal, Shield, Cpu, RefreshCw } from 'lucide-react';

export interface LogEntry {
  agent: 'SYSTEM' | 'AUDITOR' | 'VERIFIER' | 'SYNTHESIZER' | 'VISUALIZER';
  message: string;
  timestamp: string;
}

interface TerminalConsoleProps {
  logs: LogEntry[];
  isProcessing: boolean;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ logs, isProcessing }) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'SYSTEM':
        return 'text-slate-400';
      case 'AUDITOR':
        return 'text-amber-500 font-bold';
      case 'VERIFIER':
        return 'text-emerald-400 font-bold';
      case 'SYNTHESIZER':
        return 'text-cyan-400 font-bold';
      case 'VISUALIZER':
        return 'text-purple-400 font-bold';
      default:
        return 'text-zinc-300';
    }
  };

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'AUDITOR':
        return <Shield className="w-3.5 h-3.5 inline mr-1 text-amber-500 animate-pulse" />;
      case 'VERIFIER':
        return <Cpu className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />;
      default:
        return <Terminal className="w-3.5 h-3.5 inline mr-1 text-slate-500" />;
    }
  };

  const getMessageColor = (agent: string, message: string) => {
    switch (agent) {
      case 'SYSTEM':
        return 'text-slate-400';
      case 'AUDITOR':
        if (message.includes('WARNING') || message.includes('flaw') || message.includes('weakness')) {
          return 'text-amber-300 font-semibold';
        }
        return 'text-amber-100/90';
      case 'VERIFIER':
        if (message.includes('FAILED') || message.includes('Rejecting')) {
          return 'text-red-400 font-bold';
        }
        if (message.includes('Verified')) {
          return 'text-emerald-300 font-medium';
        }
        return 'text-emerald-100/90';
      case 'SYNTHESIZER':
        return 'text-cyan-200';
      case 'VISUALIZER':
        return 'text-purple-200';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="w-full h-80 glass-panel border border-slate-800 rounded-xl overflow-hidden flex flex-col font-mono shadow-2xl">
      {/* Header */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs text-slate-400 font-semibold tracking-wide ml-2 uppercase">
            Agentic CoT Terminal
          </span>
        </div>
        {isProcessing && (
          <div className="flex items-center text-cyber-cyan text-xs font-semibold animate-pulse">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            PROCESSING RUNTIME
          </div>
        )}
      </div>

      {/* Terminal logs body */}
      <div className="flex-1 bg-slate-900/90 p-4 overflow-y-auto space-y-2 text-xs leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-slate-500 flex flex-col items-center justify-center h-full space-y-2">
            <Terminal className="w-8 h-8 opacity-40 animate-pulse text-cyber-cyan" />
            <span>Awaiting paper ingestion to stream reasoning...</span>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="border-b border-slate-950/20 pb-1 animate-fade-in">
              <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
              <span className={`${getAgentColor(log.agent)} mr-2`}>
                {getAgentIcon(log.agent)}
                [{log.agent}]
              </span>
              <span className={`${getMessageColor(log.agent, log.message)} select-all`}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
