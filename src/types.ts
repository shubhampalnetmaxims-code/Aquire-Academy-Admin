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
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  stars: number;
  starLessons: (string | null)[];
  createdAt: string;
}
