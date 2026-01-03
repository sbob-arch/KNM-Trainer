import React, { useState, useMemo } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Sparkles, Loader2, FileText, BrainCircuit } from 'lucide-react';
import { ExamResult, MistakeRecord } from '../types';
import { generateAIStudyPlan } from '../services/geminiService';

const ProgressScreen: React.FC<{ 
  history: ExamResult[], 
  mistakes: Record<string, MistakeRecord>, 
  onHome: () => void,
  apiKey: string
}> = ({ history, mistakes, onHome, apiKey }) => {
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  
  const averageScore = useMemo(() => {
    if (history.length === 0) return 0;
    const total = history.reduce((acc, h) => acc + (h.score / h.total) * 100, 0);
    return Math.round(total / history.length);
  }, [history]);

  const recentTrend = useMemo(() => {
    if (history.length < 2) return 'stable';
    const last3 = history.slice(-3);
    const firstScore = (last3[0].score / last3[0].total) * 100;
    const lastScore = (last3[last3.length - 1].score / last3[last3.length - 1].total) * 100;
    if (lastScore > firstScore + 5) return 'up';
    if (lastScore < firstScore - 5) return 'down';
    return 'stable';
  }, [history]);

  const mistakesCount = Object.keys(mistakes).length;
  const hardMistakes = (Object.values(mistakes) as MistakeRecord[]).filter(m => m.errorCount >= 3).length;

  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    const plan = await generateAIStudyPlan(mistakes, apiKey);
    setStudyPlan(plan);
    setLoadingPlan(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onHome}
          className="flex items-center gap-2 text-slate-600 mb-6 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Progress</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-500 font-medium mb-1">Average Score</div>
            <div className="text-3xl font-black text-slate-900">{averageScore}%</div>
            <div className="mt-2 text-xs text-slate-400">Based on {history.length} exams</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-500 font-medium mb-1">Performance Trend</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-black text-slate-900">
                {recentTrend === 'up' ? 'Improving' : recentTrend === 'down' ? 'Needs Focus' : 'Stable'}
              </div>
              {recentTrend === 'up' && <TrendingUp className="w-6 h-6 text-green-500" />}
              {recentTrend === 'down' && <TrendingDown className="w-6 h-6 text-red-500" />}
              {recentTrend === 'stable' && <Minus className="w-6 h-6 text-slate-400" />}
            </div>
            <div className="mt-2 text-xs text-slate-400">Last 3 exams</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-500 font-medium mb-1">Mistakes Logged</div>
            <div className="text-3xl font-black text-slate-900">{mistakesCount}</div>
            <div className="mt-2 text-xs text-red-500 font-medium">{hardMistakes} questions wrong 3+ times</div>
          </div>
        </div>

        {/* AI Study Coach Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-indigo-900 text-lg">AI Study Coach</h3>
                </div>
                {!studyPlan && (
                  <button 
                    onClick={handleGeneratePlan}
                    disabled={loadingPlan}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loadingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    {loadingPlan ? "Thinking..." : "Generate Personal Plan"}
                  </button>
                )}
             </div>
             
             {studyPlan ? (
               <div className="bg-white/80 p-4 rounded-lg text-slate-700 text-sm leading-relaxed whitespace-pre-wrap border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                 {studyPlan}
                 <div className="mt-4 flex justify-end">
                   <button 
                    onClick={() => setStudyPlan(null)}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                   >
                     Regenerate
                   </button>
                 </div>
               </div>
             ) : (
               <p className="text-indigo-700/80 text-sm">
                 Need guidance? Get a customized study plan based on your recent mistakes and weak topics.
               </p>
             )}
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BrainCircuit className="w-32 h-32" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-4">Exam History</h2>
        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
            No exams taken yet. Start practicing!
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {history.slice().reverse().map((exam, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <div>
                  <div className="font-semibold text-slate-900">{exam.testTitle}</div>
                  <div className="text-xs text-slate-500">{new Date(exam.date).toLocaleDateString()} • {new Date(exam.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {Math.round((exam.score / exam.total) * 100)}%
                    </div>
                    <div className="text-xs text-slate-500">{exam.score}/{exam.total}</div>
                  </div>
                  <div className={`w-2 h-10 rounded-full ${
                    (exam.score / exam.total) >= 0.8 ? 'bg-green-500' : 
                    (exam.score / exam.total) >= 0.6 ? 'bg-orange-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressScreen;