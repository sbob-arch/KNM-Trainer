export interface Question {
  id: string;
  questionText: string;
  questionTextEn: string;
  options: string[];
  optionsEn: string[];
  correctOptionIndex: number;
  explanation: string;
  explanationEn: string;
  topic?: string;
}

export interface TestConfig {
  id: string;
  title: string;
  description: string;
  topicContext: string;
}

export interface MistakeRecord {
  questionId: string;
  question: Question;
  errorCount: number;
  lastIncorrect: number; // timestamp
}

export interface ExamResult {
  id: string;
  date: number;
  testTitle: string;
  score: number;
  total: number;
}

export interface QuizState {
  currentTestId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, number>;
  status: 'idle' | 'loading' | 'active' | 'review' | 'progress' | 'study';
  error?: string;
  mistakeLog: Record<string, MistakeRecord>;
  examHistory: ExamResult[];
  videoMastery: Record<string, boolean>; // videoId -> true if mastered
}