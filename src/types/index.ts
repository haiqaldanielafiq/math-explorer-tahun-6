export type ContentBlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'callout'
  | 'example'
  | 'formula'
  | 'divider';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string;
  body?: string;
  mediaUrl?: string;
  calloutType?: 'info' | 'tip' | 'warning' | 'success';
  order: number;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  type?: 'intro' | 'explanation' | 'angles' | 'interpretation' | 'practice';
  mediaUrl?: string;
  order: number;
  blocks: ContentBlock[];
}

export type QuestionType = 'mcq' | 'true_false' | 'matching' | 'short_answer';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  image?: string;
  options: string[]; // Options array for MCQ or matching
  correctAnswer: string; // Correct option text or exact answer
  explanation: string;
  marks: number;
  difficulty?: 'mudah' | 'sederhana' | 'sukar';
}

export interface QuizData {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  questions: Question[];
}

export interface PieChartActivityData {
  id: string;
  title: string;
  description: string;
  initialData: {
    category: string;
    value: number;
    angle: number;
    color: string;
  }[];
  totalQuantity: number;
  questions: {
    id: string;
    prompt: string;
    targetAngle?: number;
    targetCategory?: string;
    correctAnswer: string | number;
    options?: string[];
    explanation: string;
  }[];
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  code: string; // e.g., "8.1"
  standardKandungan: string; // e.g., "8.1 Carta pai"
  standardPembelajaran: string; // e.g., "8.1.1 Melengkapkan carta pai..."
  description: string;
  objectives: string[];
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  sections: LessonSection[];
  activity: PieChartActivityData;
  quiz: QuizData;
}

export interface UserProgress {
  topicId: string;
  completed: boolean;
  quizScore: number;
  completedAt?: string;
}
