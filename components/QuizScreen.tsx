import React, { useState } from 'react';
import { Eye, ArrowLeft, ArrowRight, Flag } from 'lucide-react';
import { Question } from '../types';

interface QuizScreenProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, number>;
  onAnswer: (questionId: string, optionIndex: number) => void;
  onNavigate: (index: number) => void;
  onFinish: () => void;
  onAbort: () => void;
  testTitle: string;
  videoSourceId?: string;
  apiKey: string; // Passed down if needed for future features
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  currentIndex,
  userAnswers,
  onAnswer,
  onNavigate,
  onFinish,
  onAbort,
  testTitle,
  videoSourceId,
}) => {
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const [showVideoPeek, setShowVideoPeek] = useState(false);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="font-semibold text-slate-700 truncate max-w-[200px] md:max-w-md">
            {testTitle}
          </h2>
          <button
            onClick={onAbort}
            className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            End Exam
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col justify-center">
        {videoSourceId && (
          <div className="mb-4 flex justify-end">
            <button 
              onClick={() => setShowVideoPeek(!showVideoPeek)}
              className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full font-medium transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showVideoPeek ? 'Hide Video' : 'Peek at Video'}
            </button>
          </div>
        )}

        {showVideoPeek && videoSourceId && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-md aspect-video">
             <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${videoSourceId}`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <div className="mb-6 flex items-center justify-between text-sm text-slate-400 font-medium uppercase tracking-wider">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            {currentQuestion.topic && (
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
                {currentQuestion.topic}
              </span>
            )}
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-tight">
            {currentQuestion.questionText}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = userAnswers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => onAnswer(currentQuestion.id, idx)}
                  className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-3
                    ${isSelected 
                      ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-sm' 
                      : 'border-slate-200 hover:border-orange-200 hover:bg-slate-50 text-slate-700'
                    }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
                    ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}
                  `}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-lg">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${currentIndex === 0 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="hidden md:flex gap-1 overflow-x-auto max-w-[200px] md:max-w-xs">
             {questions.length > 20 ? (
               <div className="text-xs text-slate-400 font-medium">
                 {Object.keys(userAnswers).length} answered
               </div>
             ) : (
                questions.map((q, i) => (
                  <div 
                    key={q.id}
                    className={`w-2 h-2 flex-shrink-0 rounded-full ${i === currentIndex ? 'bg-orange-500' : (userAnswers[q.id] !== undefined ? 'bg-slate-400' : 'bg-slate-200')}`}
                  />
                ))
             )}
          </div>

          <button
            onClick={() => {
              if (isLastQuestion) {
                onFinish();
              } else {
                onNavigate(currentIndex + 1);
              }
            }}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-transform active:scale-95"
          >
            {isLastQuestion ? 'Finish' : 'Next'}
            {!isLastQuestion && <ArrowRight className="w-5 h-5" />}
            {isLastQuestion && <Flag className="w-5 h-5" />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default QuizScreen;