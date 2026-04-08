export interface ContentBlock {
  id: string;
  type: 'reading' | 'video' | 'short_answer' | 'mcq' | 'fill_blanks' | 'true_false' | 'drag_drop' | 'long_text';
  data: any;
}

export interface Chapter {
  id: string;
  name: string;
  content: string;
  blocks: ContentBlock[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  thumbnail: string;
  chapters: Chapter[];
  createdAt: string;
  isSkillLesson?: boolean;
  learningPathId?: string;
  starNumber?: number;
}

export interface PathStarData {
  star: number;
  mainLessonId: string | null;
  skillLessonIds: string[];
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  stars: number;
  starLessons: (string | null)[];
  starsData?: PathStarData[];
  createdAt: string;
}

export interface QuestionBankItem {
  id: string;
  type: 'mcq' | 'true_false' | 'fill_blanks' | 'short_answer' | 'long_text' | 'section';
  question: string;
  description?: string;
  options?: any[];
  correctAnswer?: any;
  answers?: string[];
  expectedAnswer?: string;
  keywords?: string;
  marks: number;
  required: boolean;
  image?: string;
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questions: QuestionBankItem[];
  createdAt: string;
}
