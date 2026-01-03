import React from 'react';
import { 
  LogOut, 
  BrainCircuit, 
  Trophy, 
  BarChart3, 
  Building2, 
  HeartPulse, 
  History, 
  Scale, 
  Users, 
  Bus, 
  GraduationCap, 
  BookOpen 
} from 'lucide-react';
import { TESTS } from '../constants';

interface TestSelectionProps {
  onSelectTest: (testId: string) => void;
  onSelectMistakes: () => void;
  onViewProgress: () => void;
  onViewMaterials: () => void;
  onResetKey: () => void;
  mistakesCount: number;
}

const getIcon = (title: string) => {
  if (title.includes('Work')) return <Building2 className="w-6 h-6 text-orange-600" />;
  if (title.includes('Health')) return <HeartPulse className="w-6 h-6 text-red-500" />;
  if (title.includes('History')) return <History className="w-6 h-6 text-amber-700" />;
  if (title.includes('Politics')) return <Scale className="w-6 h-6 text-blue-700" />;
  if (title.includes('Social')) return <Users className="w-6 h-6 text-green-600" />;
  if (title.includes('Housing')) return <Bus className="w-6 h-6 text-indigo-600" />;
  if (title.includes('Simulation') || title.includes('Mixed')) return <GraduationCap className="w-6 h-6 text-orange-500" />;
  return <BookOpen className="w-6 h-6 text-slate-500" />;
};

const TestSelection: React.FC<TestSelectionProps> = ({ 
  onSelectTest, 
  onSelectMistakes, 
  onViewProgress, 
  onViewMaterials,
  onResetKey,
  mistakesCount 
}) => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">KNM Exam Trainer</h1>
          <p className="text-lg text-slate-600">
            Prepare for your Dutch Civic Integration Exam.
          </p>
        </div>
        <button 
          onClick={onResetKey}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
        >
          <LogOut className="w-4 h-4" /> Reset API Key
        </button>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <button
          onClick={onSelectMistakes}
          disabled={mistakesCount === 0}
          className={`relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-200 text-left flex flex-col items-start
            ${mistakesCount > 0 
              ? 'bg-red-50 border-red-200 hover:border-red-300 hover:shadow-md cursor-pointer' 
              : 'bg-slate-50 border-slate-200 opacity-75 cursor-not-allowed'}`}
        >
          <div className="bg-red-100 p-2 rounded-lg mb-3">
            <BrainCircuit className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Fix My Mistakes</h3>
          <p className="text-sm text-slate-600 mt-1">
            {mistakesCount === 0 
              ? "No mistakes recorded yet! Great job." 
              : `Review ${mistakesCount} questions you got wrong.`}
          </p>
          {mistakesCount > 0 && (
             <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
               {mistakesCount}
             </span>
          )}
        </button>

        <button
          onClick={onViewMaterials}
          className="p-6 rounded-xl border-2 border-yellow-100 bg-yellow-50/50 hover:bg-yellow-50 hover:border-yellow-200 hover:shadow-md transition-all duration-200 text-left flex flex-col items-start"
        >
          <div className="bg-yellow-100 p-2 rounded-lg mb-3">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Video Quests</h3>
          <p className="text-sm text-slate-600 mt-1">Watch, learn, and earn mastery badges.</p>
        </button>

        <button
          onClick={onViewProgress}
          className="p-6 rounded-xl border-2 border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-md transition-all duration-200 text-left flex flex-col items-start"
        >
          <div className="bg-emerald-100 p-2 rounded-lg mb-3">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">My Progress</h3>
          <p className="text-sm text-slate-600 mt-1">Check your scores and improvement.</p>
        </button>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4 px-1">Practice Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTS.map((test) => (
          <button
            key={test.id}
            onClick={() => onSelectTest(test.id)}
            className="flex flex-col text-left bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-200 hover:border-orange-300 transition-all duration-200 group"
          >
            <div className="bg-orange-50 p-3 rounded-lg w-fit mb-4 group-hover:bg-orange-100 transition-colors">
              {getIcon(test.title)}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{test.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{test.description}</p>
            <div className="mt-auto pt-4 flex items-center text-orange-600 font-medium text-sm">
              Start Practice &rarr;
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestSelection;