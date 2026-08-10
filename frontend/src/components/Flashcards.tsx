import React, { useState } from 'react';
import { HelpCircle, RefreshCw, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  supporting_text: string;
  page: number;
  rects: number[][];
}

interface FlashcardsProps {
  cards: FlashcardData[];
  onTriggerContext: (page: number, rects: number[][], text: string) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ cards, onTriggerContext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [showFinished, setShowFinished] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-slate-500">
        <GraduationCap className="w-12 h-12 opacity-35 text-cyber-cyan mb-2" />
        <span>No study cards generated for this paper.</span>
      </div>
    );
  }

  const activeCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    // Record rating stats
    setStats((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
    
    // Trigger confetti on Good or Easy
    if (rating === 'easy' || rating === 'good') {
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#a855f7', '#10b981']
      });
    }

    // Handle Contextual Intervention
    if (rating === 'again' || rating === 'hard') {
      onTriggerContext(activeCard.page, activeCard.rects, activeCard.supporting_text);
    }

    // Go to next card or finish
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowFinished(true);
      }
    }, 200);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowFinished(false);
    setStats({ again: 0, hard: 0, good: 0, easy: 0 });
  };

  if (showFinished) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-6 flex flex-col items-center justify-center h-96 shadow-2xl animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Sparkles className="w-8 h-8 text-emerald-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">Active Recall Complete!</h3>
          <p className="text-xs text-slate-400">You have completed all flashcards generated for this paper.</p>
        </div>

        {/* Statistics grid */}
        <div className="grid grid-cols-4 gap-4 w-full max-w-sm bg-slate-950 p-4 rounded-xl border border-slate-850">
          <div className="text-center">
            <div className="text-xs text-red-400 font-bold">{stats.again}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Again</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-amber-500 font-bold">{stats.hard}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Hard</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-cyan-400 font-bold">{stats.good}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Good</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-emerald-400 font-bold">{stats.easy}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Easy</div>
          </div>
        </div>

        <button 
          onClick={resetDeck}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 text-xs transition uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Study Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in flex flex-col items-center">
      {/* Cards header progress */}
      <div className="flex justify-between items-center w-full max-w-md px-1">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
          Active Recall Deck
        </span>
        <span className="text-[10px] text-cyber-cyan font-mono font-bold bg-cyan-950/40 border border-cyan-850 px-2 py-0.5 rounded-full">
          {currentIndex + 1} / {cards.length} Cards
        </span>
      </div>

      {/* 3D Flashcard Container */}
      <div className="w-full max-w-md h-64 [perspective:1000px] cursor-pointer" onClick={handleFlip}>
        <div className={`relative w-full h-full duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* FRONT (Question) */}
          <div className="absolute inset-0 w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl [backface-visibility:hidden]">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-950 border border-slate-850 px-2.5 py-0.5 rounded-md">
                Question
              </span>
              <HelpCircle className="w-4 h-4 text-cyber-cyan" />
            </div>
            
            <p className="text-white text-sm font-semibold text-center leading-relaxed font-sans">
              {activeCard.question}
            </p>
            
            <span className="text-[10px] text-slate-500 text-center select-none animate-pulse">
              Click card to reveal answer
            </span>
          </div>

          {/* BACK (Answer) */}
          <div className="absolute inset-0 w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-950 border border-emerald-900/40 px-2.5 py-0.5 rounded-md text-emerald-400">
                Answer
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            
            <div className="overflow-y-auto max-h-36 pr-1 space-y-2">
              <p className="text-slate-100 text-xs leading-relaxed text-center font-sans font-medium">
                {activeCard.answer}
              </p>
            </div>
            
            <span className="text-[10px] text-slate-500 text-center select-none">
              Rate your memory recall below
            </span>
          </div>
          
        </div>
      </div>

      {/* Intervention Prompt */}
      <div className="w-full max-w-md text-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onTriggerContext(activeCard.page, activeCard.rects, activeCard.supporting_text);
          }}
          className="text-[10px] text-cyber-purple hover:text-purple-400 font-semibold border-b border-purple-500/20 hover:border-purple-400 pb-0.5 uppercase tracking-wider transition"
        >
          💡 Struggling? Auto-scroll PDF context & highlight
        </button>
      </div>

      {/* Recall grading buttons */}
      <div className="grid grid-cols-4 gap-2.5 w-full max-w-md pt-2">
        <button 
          onClick={(e) => { e.stopPropagation(); handleRating('again'); }}
          className="px-2.5 py-2 bg-red-950/40 hover:bg-red-950/80 border border-red-500/30 text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-wider transition hover:scale-[1.03] shadow-md shadow-red-950/20"
        >
          Again
          <span className="block text-[8px] text-slate-500 font-normal mt-0.5">Scroll PDF</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleRating('hard'); }}
          className="px-2.5 py-2 bg-amber-950/40 hover:bg-amber-950/80 border border-amber-500/30 text-amber-400 rounded-xl text-[10px] font-bold uppercase tracking-wider transition hover:scale-[1.03] shadow-md shadow-amber-950/20"
        >
          Hard
          <span className="block text-[8px] text-slate-500 font-normal mt-0.5">Hint & Scroll</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleRating('good'); }}
          className="px-2.5 py-2 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 rounded-xl text-[10px] font-bold uppercase tracking-wider transition hover:scale-[1.03] shadow-md shadow-cyan-950/20"
        >
          Good
          <span className="block text-[8px] text-slate-500 font-normal mt-0.5">Pass</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleRating('easy'); }}
          className="px-2.5 py-2 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-wider transition hover:scale-[1.03] shadow-md shadow-emerald-950/20"
        >
          Easy
          <span className="block text-[8px] text-slate-500 font-normal mt-0.5">Confetti</span>
        </button>
      </div>
    </div>
  );
};
