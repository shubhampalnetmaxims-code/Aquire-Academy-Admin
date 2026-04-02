export interface ContentBlock {
  id: string;
  type: 'reading' | 'video' | 'short_answer' | 'mcq' | 'fill_blanks' | 'true_false' | 'drag_drop';
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
  grade: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  thumbnail: string;
  grade: string;
  chapters: Chapter[];
  createdAt: string;
}
