import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronUp, ChevronDown, Languages, Loader2, Lightbulb, Sparkles } from 'lucide-react';
import { Question } from '../types';
import { getAIDeepDive } from '../services/geminiService';

const ResultCard: React.FC<{
  q: Question;
  userAnswer?: number;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  apiKey: string;
}> = ({ q, userAnswer, expandedIds, toggleExpand, apiKey }) => {
  const [showEnglish, setShowEnglish] = useState(false);
  const [deepDive, setDeepDive] = useState<string | null>(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  const isCorrect = userAnswer === q.correctOptionIndex;
  const isUnanswered = userAnswer === undefined;
  const isExpanded = expandedIds.has(q.id);

  useEffect(() => {
    if (!isExpanded) {
       setShowEnglish(false);
       setDeepDive(null);
    }
  }, [isExpanded]);

  const handleDeepDive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deepDive) return;
    
    setLoadingDeepDive(true);
    const text = await getAIDeepDive(q, apiKey);
    setDeepDive(text);
    setLoadingDeepDive(false);
  };

  return (
    <div 
      className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden
        ${isCorrect ? 'border-green-200' : 'border-red-200'}
      `}
    >
      <button 
        onClick={() => toggleExpand(q.id)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-slate-50"
      >
        <div className="flex-shrink-0 mt-0.5">
          {isCorrect ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-slate-800 pr-4">{q.questionText}</h4>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
          <div className="flex gap-2 mt-2">
             <span className={`text-xs px-2 py-0.5 rounded font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
               {isCorrect ? 'Correct' : isUnanswered ? 'Skipped' : 'Incorrect'}
             </span>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-100 bg-slate-50/50">
          <div className="flex justify-end pt-3 gap-2">
             <button
              onClick={(e) => { e.stopPropagation(); setShowEnglish(!showEnglish); }}
              className="text-xs flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded border border-blue-100 hover:border-blue-200 transition-colors"
             >
               <Languages className="w-3 h-3" />
               {showEnglish ? 'Hide English' : 'Translate'}
             </button>
             <button
              onClick={handleDeepDive}
              disabled={loadingDeepDive}
              className="text-xs flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-medium bg-purple-50 px-2 py-1 rounded border border-purple-100 hover:border-purple-200 transition-colors"
             >
               {loadingDeepDive ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3 h-3" />}
               Deep Dive
             </button>
          </div>

          {showEnglish && (
             <div className="mb-4 mt-2 p-3 bg-indigo-50 text-indigo-900 text-sm rounded-lg border border-indigo-100 italic">
               <strong>EN:</strong> {q.questionTextEn}
             </div>
          )}

          {deepDive && (
             <div className="mb-4 mt-2 p-3 bg-purple-50 text-purple-900 text-sm rounded-lg border border-purple-100 animate-in fade-in slide-in-from-top-2">
               <div className="flex items-center gap-2 font-bold mb-1 text-purple-800">
                 <Sparkles className="w-3 h-3" /> Cultural Context
               </div>
               {deepDive}
             </div>
          )}

          <div className="mt-2 space-y-2">
            {q.options.map((opt, i) => {
              const isOptCorrect = i === q.correctOptionIndex;
              const isOptSelected = i === userAnswer;
              
              let className = "p-3 rounded-lg border text-sm flex flex-col justify-center ";
              if (isOptCorrect) className += "bg-green-50 border-green-200 text-green-800 font-medium ring-1 ring-green-200";
              else if (isOptSelected && !isCorrect) className += "bg-red-50 border-red-200 text-red-800 font-medium";
              else className += "bg-white border-slate-200 text-slate-600 opacity-70";

              return (
                <div key={i} className={className}>
                  <div className="flex justify-between items-center w-full">
                    <span>{opt}</span>
                    {isOptCorrect && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded ml-2 whitespace-nowrap">Correct Answer</span>}
                    {isOptSelected && !isOptCorrect && <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded ml-2 whitespace-nowrap">Your Answer</span>}
                  </div>
                  {showEnglish && q.optionsEn && q.optionsEn[i] && (
                    <div className="text-xs opacity-75 mt-1 pt-1 border-t border-black/5 italic">
                       {q.optionsEn[i]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 text-blue-900 rounded-lg text-sm border border-blue-100">
            <span className="font-bold block mb-1 flex items-center gap-2">
              Explanation
            </span>
            <p>{q.explanation}</p>
            {showEnglish && (
              <p className="mt-2 pt-2 border-t border-blue-200 italic opacity-80">
                {q.explanationEn}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;