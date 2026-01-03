import React, { useState, useCallback, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { QuizState, ExamResult, MistakeRecord } from './types';
import { TESTS, STUDY_MATERIALS } from './constants';
import { generateQuestions } from './services/geminiService';
import { saveToStorage, loadFromStorage } from './utils/storage';

import ApiKeyScreen from './components/ApiKeyScreen';
import TestSelection from './components/TestSelection';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import StudyMaterialsScreen from './components/StudyMaterialsScreen';
import ProgressScreen from './components/ProgressScreen';

const INITIAL_STATE: QuizState = {
  currentTestId: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  status: 'idle',
  mistakeLog: {},
  examHistory: [],
  videoMastery: {}
};

export default function App() {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  
  const [state, setState] = useState<QuizState>(() => {
    const savedMistakes = loadFromStorage('knm_mistakes', {});
    const savedHistory = loadFromStorage('knm_history', []);
    const savedMastery = loadFromStorage('knm_mastery', {});
    return {
      ...INITIAL_STATE,
      mistakeLog: savedMistakes,
      examHistory: savedHistory,
      videoMastery: savedMastery
    };
  });

  useEffect(() => { saveToStorage('knm_mistakes', state.mistakeLog); }, [state.mistakeLog]);
  useEffect(() => { saveToStorage('knm_history', state.examHistory); }, [state.examHistory]);
  useEffect(() => { saveToStorage('knm_mastery', state.videoMastery); }, [state.videoMastery]);

  const startTest = useCallback(async (testId: string) => {
    const testConfig = TESTS.find((t) => t.id === testId);
    if (!testConfig) return;

    setState((prev) => ({ ...prev, status: 'loading', currentTestId: testId, error: undefined }));

    try {
      const count = testId === 'mixed' ? 30 : 15;
      const questions = await generateQuestions(testConfig.topicContext, count, apiKey);
      setState((prev) => ({
        ...prev,
        questions,
        status: 'active',
        currentQuestionIndex: 0,
        userAnswers: {},
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'idle',
        currentTestId: null,
        error: 'Failed to generate test. Please check your connection or API key and try again.',
      }));
    }
  }, [apiKey]);

  const startVideoTest = useCallback(async (video: typeof STUDY_MATERIALS[0]) => {
    setState((prev) => ({ ...prev, status: 'loading', currentTestId: `video_${video.id}`, error: undefined }));
    try {
      const questions = await generateQuestions(video.topicContext, 5, apiKey); 
      setState((prev) => ({
        ...prev,
        questions,
        status: 'active',
        currentQuestionIndex: 0,
        userAnswers: {},
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'study',
        error: 'Failed to generate video quiz. Please try again.',
      }));
    }
  }, [apiKey]);

  const startMistakesTest = useCallback(() => {
    const allMistakes = Object.values(state.mistakeLog) as MistakeRecord[];
    if (allMistakes.length === 0) return;

    const questionsToPractice = allMistakes
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, 20)
      .map(m => m.question);

    setState((prev) => ({
      ...prev,
      status: 'active',
      currentTestId: 'mistakes',
      questions: questionsToPractice,
      currentQuestionIndex: 0,
      userAnswers: {},
    }));
  }, [state.mistakeLog]);

  const handleAnswer = useCallback((questionId: string, optionIndex: number) => {
    setState((prev) => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [questionId]: optionIndex },
    }));
  }, []);

  const navigateQuestion = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentQuestionIndex: index }));
  }, []);

  const finishExam = useCallback(() => {
    setState((prev) => {
      const score = prev.questions.reduce((acc, q) => 
        acc + (prev.userAnswers[q.id] === q.correctOptionIndex ? 1 : 0)
      , 0);
      const percentage = (score / prev.questions.length) * 100;
      const isVideo = prev.currentTestId?.startsWith('video_');
      
      let newHistoryItem: ExamResult = {
        id: Date.now().toString(),
        date: Date.now(),
        testTitle: 'Exam',
        score,
        total: prev.questions.length
      };

      if (prev.currentTestId === 'mistakes') {
         newHistoryItem.testTitle = 'Mistake Review';
      } else if (isVideo) {
         const videoId = prev.currentTestId?.replace('video_', '');
         const videoData = STUDY_MATERIALS.find(v => v.id === videoId);
         newHistoryItem.testTitle = videoData ? `Quest: ${videoData.title}` : 'Video Quest';
      } else {
         newHistoryItem.testTitle = TESTS.find(t => t.id === prev.currentTestId)?.title || 'Exam';
      }

      let newMastery = { ...prev.videoMastery };
      if (isVideo && percentage >= 80) {
         const videoId = prev.currentTestId?.replace('video_', '') || '';
         if (videoId) newMastery[videoId] = true;
      }

      const newMistakeLog = { ...prev.mistakeLog };
      prev.questions.forEach(q => {
        const userAnswer = prev.userAnswers[q.id];
        const isCorrect = userAnswer === q.correctOptionIndex;
        if (!isCorrect) {
          const existing = newMistakeLog[q.id];
          newMistakeLog[q.id] = {
            questionId: q.id,
            question: q,
            errorCount: (existing?.errorCount || 0) + 1,
            lastIncorrect: Date.now()
          };
        } else if (prev.currentTestId === 'mistakes') {
          if (newMistakeLog[q.id]) {
            if (newMistakeLog[q.id].errorCount > 1) {
              newMistakeLog[q.id].errorCount -= 1;
            } else {
              delete newMistakeLog[q.id];
            }
          }
        }
      });

      return {
        ...prev,
        status: 'review',
        examHistory: [...prev.examHistory, newHistoryItem],
        mistakeLog: newMistakeLog,
        videoMastery: newMastery
      };
    });
  }, []);

  const abortExam = useCallback(() => { finishExam(); }, [finishExam]);

  const resetApp = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'idle', currentTestId: null, questions: [], userAnswers: {} }));
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
  };
  
  const handleResetKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    resetApp();
  };

  if (!apiKey) {
    return <ApiKeyScreen onSave={handleSaveKey} />;
  }

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Generating your test...</h2>
        <p className="text-slate-500 mt-2 text-center max-w-md">
          {state.currentTestId?.startsWith('video_') 
            ? 'Creating a custom challenge based on this video...' 
            : 'Consulting the AI tutor to create fresh questions based on the selected topic.'}
        </p>
      </div>
    );
  }

  if (state.status === 'active') {
    let title = 'Exam';
    let videoSourceId = undefined;

    if (state.currentTestId === 'mistakes') {
      title = 'Fixing Mistakes';
    } else if (state.currentTestId?.startsWith('video_')) {
       const videoId = state.currentTestId.replace('video_', '');
       const videoData = STUDY_MATERIALS.find(v => v.id === videoId);
       title = videoData ? `Quest: ${videoData.title}` : 'Video Quest';
       videoSourceId = videoId;
    } else {
       title = TESTS.find((t) => t.id === state.currentTestId)?.title || 'Exam';
    }

    return (
      <QuizScreen
        questions={state.questions}
        currentIndex={state.currentQuestionIndex}
        userAnswers={state.userAnswers}
        onAnswer={handleAnswer}
        onNavigate={navigateQuestion}
        onFinish={finishExam}
        onAbort={abortExam}
        testTitle={title}
        videoSourceId={videoSourceId}
        apiKey={apiKey}
      />
    );
  }

  if (state.status === 'review') {
    return (
      <ResultsScreen
        questions={state.questions}
        userAnswers={state.userAnswers}
        onHome={resetApp}
        onRetry={() => {
           if (state.currentTestId === 'mistakes') startMistakesTest();
           else if (state.currentTestId?.startsWith('video_')) {
              const vidId = state.currentTestId.replace('video_', '');
              const vidData = STUDY_MATERIALS.find(v => v.id === vidId);
              if (vidData) startVideoTest(vidData);
           }
           else if (state.currentTestId) startTest(state.currentTestId);
        }}
        isMistakeMode={state.currentTestId === 'mistakes'}
        apiKey={apiKey}
      />
    );
  }

  if (state.status === 'study') {
    return (
      <StudyMaterialsScreen 
        onHome={resetApp} 
        onStartVideoQuiz={startVideoTest}
        videoMastery={state.videoMastery}
      />
    );
  }

  if (state.status === 'progress') {
    return (
      <ProgressScreen 
        history={state.examHistory} 
        mistakes={state.mistakeLog} 
        onHome={resetApp}
        apiKey={apiKey}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100/50">
      {state.error && (
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{state.error}</p>
        </div>
      )}
      <TestSelection 
        onSelectTest={startTest} 
        onSelectMistakes={startMistakesTest}
        onViewMaterials={() => setState(prev => ({ ...prev, status: 'study' }))}
        onViewProgress={() => setState(prev => ({ ...prev, status: 'progress' }))}
        onResetKey={handleResetKey}
        mistakesCount={Object.keys(state.mistakeLog).length}
      />
    </div>
  );
}