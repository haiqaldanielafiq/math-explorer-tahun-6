export type ContentBlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'callout'
  | 'example'
  | 'formula'
  | 'divider';

export interface LocalizedString {
  ms: string;
  en?: string;
}

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string | LocalizedString;
  body?: string | LocalizedString;
  mediaUrl?: string;
  calloutType?: 'info' | 'tip' | 'warning' | 'success';
  order: number;
}

export interface LessonSection {
  id: string;
  title: string | LocalizedString;
  content: string | LocalizedString;
  type?: 'intro' | 'explanation' | 'angles' | 'interpretation' | 'practice';
  mediaUrl?: string;
  order: number;
  blocks: ContentBlock[];
}

export type QuestionType = 'mcq' | 'true_false' | 'matching' | 'short_answer';

export interface Question {
  id: string;
  type: QuestionType;
  question: string | LocalizedString;
  image?: string;
  options: (string | LocalizedString)[];
  correctAnswer: string; // Plain string matching answer text
  explanation: string | LocalizedString;
  marks: number;
  difficulty?: 'mudah' | 'sederhana' | 'sukar';
}

export interface QuizData {
  id: string;
  title: string | LocalizedString;
  description?: string | LocalizedString;
  passingScore: number;
  questions: Question[];
}

export interface PieChartActivityData {
  id: string;
  title: string | LocalizedString;
  description: string | LocalizedString;
  initialData: {
    category: string | LocalizedString;
    value: number;
    angle: number;
    color: string;
  }[];
  totalQuantity: number;
  questions: {
    id: string;
    prompt: string | LocalizedString;
    targetAngle?: number;
    targetCategory?: string;
    correctAnswer: string | number;
    options?: (string | LocalizedString)[];
    explanation: string | LocalizedString;
  }[];
}

export interface Topic {
  id: string;
  slug: string;
  title: string | LocalizedString;
  code: string; // e.g., "8.1", "1.1", "2.1", "4.1"
  standardKandungan: string | LocalizedString;
  standardPembelajaran: string | LocalizedString;
  description: string | LocalizedString;
  objectives: (string | LocalizedString)[];
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

export interface UserSession {
  user: {
    name: string;
    email: string;
    image?: string;
    role: 'ADMIN' | 'STUDENT';
    isDelima: boolean;
  };
}
