import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
} from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AlertCircle, CheckCircle2, ShieldAlert, BookOpen } from 'lucide-react';

export interface ConceptNodeData {
  title: string;
  type: 'claim' | 'evidence' | 'warning' | 'limitation';
  description: string;
  page: number;
  rects: number[][];
}

// Custom Node Component to render gorgeous cyber-cards
const CustomConceptNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as ConceptNodeData;
  
  const getStyleClass = () => {
    switch (nodeData.type) {
      case 'claim':
        return {
          border: 'border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] bg-slate-900',
          badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          icon: <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
        };
      case 'evidence':
        return {
          border: 'border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)] bg-slate-900',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        };
      case 'warning':
        return {
          border: 'border-orange-500/45 shadow-[0_0_12px_rgba(249,115,22,0.2)] bg-slate-900 animate-pulse',
          badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
        };
      case 'limitation':
        return {
          border: 'border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.15)] bg-slate-900',
          badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          icon: <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
        };
      default:
        return {
          border: 'border-slate-800 bg-slate-900',
          badge: 'bg-slate-850 text-slate-400',
          icon: <BookOpen className="w-3.5 h-3.5" />
        };
    }
  };

  const style = getStyleClass();

  return (
    <div className={`p-4 rounded-xl border max-w-xs font-sans text-left transition duration-200 hover:scale-[1.02] ${style.border}`}>
      <Handle type="target" position={Position.Top} className="!bg-slate-700" />
      
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${style.badge} flex items-center gap-1`}>
          {style.icon}
          {nodeData.type}
        </span>
        <span className="text-[10px] font-mono text-slate-500">Page {nodeData.page + 1}</span>
      </div>
      
      <h4 className="text-white text-xs font-bold leading-snug mb-1 line-clamp-1">
        {nodeData.title}
      </h4>
      <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-3">
        {nodeData.description}
      </p>
      
      <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[9px] text-slate-500">
        <span>Click node to target citation</span>
        <span className="font-semibold text-cyber-purple">Ground Checked</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-700" />
    </div>
  );
};

interface ConceptMapProps {
  nodes: any[];
  edges: any[];
  onNodeSelect: (page: number, rects: number[][], text: string) => void;
}

export const ConceptMap: React.FC<ConceptMapProps> = ({ nodes, edges, onNodeSelect }) => {
  const nodeTypes = useMemo(() => ({ custom: CustomConceptNode }), []);

  const handleNodeClick = (_event: React.MouseEvent, node: any) => {
    if (node.data) {
      onNodeSelect(node.data.page, node.data.rects, node.data.description);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Legend overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex flex-col space-y-1.5 backdrop-blur-md shadow-xl">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-850 pb-1 mb-1">
          Argument Mapping Schema
        </span>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></span>
          <span className="text-white font-medium">Claims</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          <span className="text-white font-medium">Evidence / Benchmarks</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
          <span className="text-white font-medium">Audit Warnings (Warnings)</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
          <span className="text-white font-medium">Limitations / Constraints</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        className="w-full h-full"
      >
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-400 hover:!text-white [&>button]:!border-slate-800 hover:[&>button]:!bg-slate-800" />
        <MiniMap 
          nodeColor={(n) => {
            const data = n.data as any;
            if (data?.type === 'claim') return 'rgba(6, 182, 212, 0.4)';
            if (data?.type === 'evidence') return 'rgba(16, 185, 129, 0.4)';
            if (data?.type === 'warning') return 'rgba(249, 115, 22, 0.4)';
            if (data?.type === 'limitation') return 'rgba(168, 85, 247, 0.4)';
            return '#1e293b';
          }}
          className="!bg-slate-900/90 !border-slate-800 !rounded-xl"
          maskColor="rgba(8, 11, 17, 0.7)"
        />
        <Background color="#334155" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};
