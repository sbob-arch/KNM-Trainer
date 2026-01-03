import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, List, Filter } from 'lucide-react';
import { Question } from '../types';
import ResultCard from './ResultCard';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: Record<string, number>;
  onHome: () => void;
  onRetry: () => void;
  isMistakeMode?: boolean;
  apiKey: string;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, onHome, onRetry, isMistakeMode, apiKey }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect'>('all');

  const score = questions.reduce((acc, q) => {
    return acc + (userAnswers[q.id] === q.correctOptionIndex ? 1 : 0);
  }, 0);
  const percentage = Math.round((score / questions.length) * 100);

  useEffect(() => {
    const incorrectIds = new Set<string>();
    questions.forEach(q => {
      if (userAnswers[q.id] !== q.correctOptionIndex) {
        incorrectIds.add(q.id);
      }
    });
    setExpandedIds(incorrectIds);
  }, [questions, userAnswers]);

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  const toggleExpandAll = () => {
    if (expandedIds.size === questions.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(questions.map(q => q.id)));
    }
  };

  const filteredQuestions = filterMode === 'all' 
    ? questions 
    : questions.filter(q => userAnswers[q.id] !== q.correctOptionIndex);

  const getFeedbackMessage = () => {
    if (percentage >= 80) return "Uitstekend! (Excellent)";
    if (percentage >= 60) return "Goed gedaan! (Well done)";
    if (percentage >= 50) return "Voldoende (Pass)";
    return "Oefening nodig (Needs practice)";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {isMistakeMode ? 'Mistake Review Complete' : 'Exam Results'}
          </h2>
          <div className="text-5xl font-black text-orange-600 mb-2">{percentage}%</div>
          <p className="text-slate-500 font-medium mb-4">{score} out of {questions.length} correct</p>
          
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6
            ${percentage >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {getFeedbackMessage()}
          </div>
          
          {isMistakeMode && (
            <div className="mb-6 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
               Correctly answered questions have been removed from your mistake log!
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onHome}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              Menu
            </button>
            <button 
              onClick={onRetry}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {isMistakeMode ? 'Continue Fixing' : 'Try Another'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-bold text-slate-900">Detailed Review</h3>
          <div className="flex gap-2 text-sm">
             <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border transition-colors ${filterMode === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              <List className="w-4 h-4" /> All
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border transition-colors ${filterMode === 'incorrect' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              <Filter className="w-4 h-4" /> Incorrect Only
            </button>
            <button
              onClick={toggleExpandAll}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {expandedIds.size === questions.length ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.length === 0 && (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
              No incorrect answers to show! Great job!
            </div>
          )}

          {filteredQuestions.map((q) => (
            <ResultCard 
              key={q.id}
              q={q} 
              userAnswer={userAnswers[q.id]}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              apiKey={apiKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;