import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  PlayCircle,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  Book,
  FileText,
  ChevronDown,
  ArrowLeft,
  LayoutGrid,
  List,
  GraduationCap,
  Eye,
  Layers,
  Star,
  Sparkles,
  Trophy,
  Database,
  ClipboardList,
  Copy,
  FileJson,
  Download,
  Upload
} from "lucide-react";
import ModuleModal from "./ModuleModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import LessonModal from "./LessonModal";
import { Module, Lesson, Chapter, ContentBlock, LearningPath, QuestionBank } from "../types";
import ChapterModal from "./ChapterModal";
import ChapterEditor from "./ChapterEditor";
import StudentPreview from "./StudentPreview";
import LearningPathModal from "./LearningPathModal";
import LearningPathPreview from "./LearningPathPreview";
import LearningPathZigZagPreview from "./LearningPathZigZagPreview";
import QuestionBankModal from "./QuestionBankModal";
import QuestionBankPreview from "./QuestionBankPreview";
import SkillLessonModal from "./SkillLessonModal";

interface DashboardContentProps {
  activeTab: string;
  showToast: (message: string, type: "success" | "error") => void;
}

const INITIAL_MODULES: Module[] = [
  { id: "m1", name: "Narrative Writing", description: "Master the art of storytelling, from character creation to plot development.", createdAt: new Date().toISOString() },
  { id: "m2", name: "Punctuation", description: "Learn the essential rules of punctuation to make your writing clear and effective.", createdAt: new Date().toISOString() },
  { id: "m3", name: "Editing", description: "Develop the skills to review, revise, and refine your own writing and others'.", createdAt: new Date().toISOString() },
  { id: "m4", name: "Persuasive Writing", description: "Learn how to build strong arguments and convince your audience through writing.", createdAt: new Date().toISOString() },
];

const generateLessons = (): Lesson[] => {
  const lessons: Lesson[] = [];
  const moduleData = [
    { 
      id: "m1", 
      name: "Narrative Writing",
      lessonNames: [
        "Introduction to Story Writing", "Characters and Setting", "Plot Development", 
        "Beginning, Middle, End", "Creative Story Writing", "Writing Short Stories", 
        "Adding Emotions", "Dialogue Writing", "Seed Data Test"
      ]
    },
    { 
      id: "m2", 
      name: "Punctuation",
      lessonNames: [
        "Introduction to Punctuation", "Full Stops & Commas", "Question & Exclamation Marks", 
        "Apostrophes", "Capitalization Rules", "Quotation Marks", 
        "Common Mistakes", "Practice Exercises"
      ]
    },
    { 
      id: "m3", 
      name: "Editing",
      lessonNames: [
        "Introduction to Editing", "Spelling Mastery", "Grammar Essentials", 
        "Sentence Structure", "Paragraph Flow", "Proofreading Techniques", 
        "Style and Tone", "Final Review"
      ]
    },
    { 
      id: "m4", 
      name: "Persuasive Writing",
      lessonNames: [
        "Introduction to Persuasive Writing", "Forming Opinions", "Building Arguments", 
        "Persuasive Vocabulary", "Structuring Your Essay", "Debate and Counter-arguments", 
        "Emotional Appeals", "Final Persuasive Piece"
      ]
    }
  ];

  const getChapterData = (type: string, modName: string, lessonName: string, chapterIdx: number) => {
    switch (type) {
      case 'reading':
        return {
          name: `📖 Understanding ${lessonName}`,
          blocks: [{
            id: `b-reading-${Math.random()}`,
            type: 'reading' as const,
            data: {
              text: `<h3>Overview of ${lessonName}</h3><p>${lessonName} is a critical component of ${modName}. It involves understanding the core principles and applying them effectively in your writing.</p><p><b>Key Concepts:</b></p><ul><li>Clarity and Precision</li><li>Engagement with the Reader</li><li>Structural Integrity</li></ul>`,
              examples: `Example 1: A well-crafted sentence in ${lessonName}.\nExample 2: How to avoid common pitfalls in ${lessonName}.\nExample 3: Advanced techniques for ${lessonName} mastery.`
            }
          }]
        };
      case 'video':
        return {
          name: `🎥 ${lessonName} Visual Guide`,
          blocks: [{
            id: `b-video-${Math.random()}`,
            type: 'video' as const,
            data: {
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
              description: `Watch this comprehensive video guide to master the concepts of ${lessonName} in ${modName}.`
            }
          }]
        };
      case 'short_answer':
        return {
          name: `✍️ ${lessonName} Practice`,
          blocks: [{
            id: `b-sa-${Math.random()}`,
            type: 'short_answer' as const,
            data: {
              questions: [
                { q: `What is the primary goal of ${lessonName}?`, a: `To improve the quality and impact of writing within the context of ${modName}.` },
                { q: `Name one key element of ${lessonName}.`, a: `Consistency and attention to detail.` },
                { q: `How does ${lessonName} benefit the reader?`, a: `It makes the content more accessible and engaging.` }
              ]
            }
          }]
        };
      case 'mcq':
        return {
          name: `✅ ${lessonName} Quiz`,
          blocks: [{
            id: `b-mcq-${Math.random()}`,
            type: 'mcq' as const,
            data: {
              question: `Which of the following is MOST important for ${lessonName}?`,
              options: [
                { text: "Speed of writing", isCorrect: false },
                { text: "Clarity of thought", isCorrect: true },
                { text: "Length of the document", isCorrect: false },
                { text: "Use of complex words", isCorrect: false },
                { text: "Following the rules of grammar", isCorrect: true }
              ]
            }
          }]
        };
      case 'fill_blanks':
        return {
          name: `🧩 ${lessonName} Completion`,
          blocks: [{
            id: `b-fb-${Math.random()}`,
            type: 'fill_blanks' as const,
            data: {
              text: `${lessonName} requires a [blank] approach to ensure [blank] and [blank] in every sentence.`,
              answers: ["systematic", "accuracy", "flow"],
              options: [
                ["random", "systematic", "haphazard"],
                ["accuracy", "speed", "length"],
                ["flow", "complexity", "volume"]
              ]
            }
          }]
        };
      case 'true_false':
        return {
          name: `✔️ ${lessonName} Fact Check`,
          blocks: [{
            id: `b-tf-${Math.random()}`,
            type: 'true_false' as const,
            data: {
              statement: `${lessonName} is only necessary for professional writers and doesn't apply to students.`,
              isTrue: false
            }
          }]
        };
      case 'drag_drop':
        return {
          name: `🔀 ${lessonName} Organization`,
          blocks: [{
            id: `b-dd-${Math.random()}`,
            type: 'drag_drop' as const,
            data: {
              paragraph: `Arrange the steps of ${lessonName} in the correct order: [blank], [blank], [blank].`,
              items: ["Planning", "Drafting", "Reviewing"],
              answers: ["Planning", "Drafting", "Reviewing"]
            }
          }]
        };
      case 'long_text':
        let question = `Explain the importance of ${lessonName} in your own words.`;
        let description = "Provide a detailed explanation with examples.";
        let expected = `The importance of ${lessonName} lies in its ability to enhance the overall quality of writing within ${modName}. By focusing on these principles, writers can create more engaging and effective content.`;
        let keywords = `${lessonName.toLowerCase()}, ${modName.toLowerCase()}, writing, quality`;

        if (modName === "Narrative Writing") {
          if (lessonName.includes("Character")) {
            question = "Describe your favorite character from a book or movie in detail.";
            description = "Focus on their personality, motivations, and physical appearance. Use descriptive language.";
            expected = "A good character description should include both internal and external traits. For example, Harry Potter is known for his bravery (internal) and his lightning-shaped scar (external).";
            keywords = "character, personality, motivation, appearance, traits";
          } else if (lessonName.includes("Plot")) {
            question = "Explain the standard plot structure of a narrative story.";
            description = "Include the introduction, rising action, climax, falling action, and resolution.";
            expected = "The plot structure typically follows a curve starting with the exposition, followed by rising action leading to the climax, then falling action, and finally the resolution.";
            keywords = "plot, structure, climax, resolution, exposition";
          } else if (lessonName.includes("Story")) {
            question = "Write a persuasive paragraph about why reading is important.";
            description = "Use at least three strong arguments to support your point of view.";
            expected = "Reading is essential because it expands knowledge, improves vocabulary, and reduces stress. It allows us to experience different perspectives and cultures.";
            keywords = "persuasive, reading, knowledge, vocabulary, stress";
          }
        }

        return {
          name: `📝 ${lessonName} Essay`,
          blocks: [{
            id: `b-lt-${Math.random()}`,
            type: 'long_text' as const,
            data: {
              question,
              description,
              expected_answer: expected,
              keywords,
              marks: 10
            }
          }]
        };
      default:
        return { name: "Chapter", blocks: [] };
    }
  };

  const chapterTypes = ['reading', 'video', 'short_answer', 'mcq', 'fill_blanks', 'true_false', 'drag_drop', 'long_text'];

  moduleData.forEach((mod) => {
    mod.lessonNames.forEach((lessonName, lessonIdx) => {
      const lessonId = `l-${mod.id}-${lessonIdx + 1}`;
      const chapters: Chapter[] = [];
      
      if (lessonName === "Seed Data Test") {
        chapters.push({
          id: `c-${lessonId}-mixed`,
          name: "Mixed Question Types Test",
          content: "",
          blocks: [
            {
              id: `b-mcq-seed`,
              type: 'mcq' as const,
              data: {
                question: "Which of the following is a key element of a story's setting?",
                options: [
                  { text: "Time and place", isCorrect: true },
                  { text: "The main character's name", isCorrect: false },
                  { text: "The number of pages", isCorrect: false },
                  { text: "The author's biography", isCorrect: false }
                ],
                marks: 5
              }
            },
            {
              id: `b-lt-seed`,
              type: 'long_text' as const,
              data: {
                question: "Describe a character who is brave but also very clumsy.",
                description: "Think about how their clumsiness might affect their brave actions.",
                expected_answer: "A brave but clumsy character might rush into danger to save someone, but trip over their own feet in the process. This adds a layer of relatability and humor to their heroism.",
                keywords: "brave, clumsy, character, description",
                marks: 15
              }
            },
            {
              id: `b-fb-seed`,
              type: 'fill_blanks' as const,
              data: {
                text: "A [blank] is used to separate items in a list, while a [blank] is used at the end of a sentence.",
                answers: ["comma", "full stop"],
                options: [
                  ["comma", "colon", "dash"],
                  ["full stop", "question mark", "exclamation mark"]
                ],
                marks: 5
              }
            },
            {
              id: `b-sa-seed`,
              type: 'short_answer' as const,
              data: {
                questions: [
                  { q: "What is the 'climax' of a story?", a: "The most intense or exciting point of the story." },
                  { q: "What follows the climax in a standard plot structure?", a: "Falling action" }
                ],
                marks: 10
              }
            },
            {
              id: `b-tf-seed`,
              type: 'true_false' as const,
              data: {
                statement: "Using 'repetition' is a common persuasive technique to emphasize a point.",
                isTrue: true,
                marks: 5
              }
            }
          ]
        });
      } else {
        chapterTypes.forEach((type, cIdx) => {
          const chapterId = `c-${lessonId}-${cIdx + 1}`;
          const { name, blocks } = getChapterData(type, mod.name, lessonName, cIdx);
          chapters.push({ id: chapterId, name, content: "", blocks });
        });
      }

      const isSkillLesson = lessonIdx % 3 === 0;
      lessons.push({
        id: lessonId,
        moduleId: mod.id,
        name: lessonName,
        description: `Comprehensive guide to ${lessonName} for grades 3-7.`,
        thumbnail: `https://picsum.photos/seed/${lessonId}/400/300`,
        createdAt: new Date().toISOString(),
        chapters,
        isSkillLesson: isSkillLesson,
        starNumber: isSkillLesson ? (lessonIdx % 5) + 1 : undefined,
        learningPathId: isSkillLesson ? (mod.id === 'm1' ? 'lp1' : (mod.id === 'm2' ? 'lp2' : 'lp3')) : undefined
      });
    });
  });

  return lessons;
};

const INITIAL_LESSONS: Lesson[] = generateLessons();

const INITIAL_QUESTION_BANKS: QuestionBank[] = [
  {
    id: "qb1",
    name: "Writing Skills Assessment",
    description: "A comprehensive test covering various aspects of narrative and persuasive writing.",
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "What is the main purpose of the 'climax' in a story?",
        options: [
          { text: "To introduce the characters", isCorrect: false },
          { text: "To provide the resolution", isCorrect: false },
          { text: "To reach the point of highest tension", isCorrect: true },
          { text: "To describe the setting", isCorrect: false }
        ],
        marks: 5,
        required: true
      },
      {
        id: "q2",
        type: "true_false",
        question: "Persuasive writing should always include a counter-argument.",
        correctAnswer: true,
        marks: 5,
        required: true
      },
      {
        id: "q3",
        type: "fill_blanks",
        question: "A [blank] is used to separate items in a list, while a [blank] is used at the end of a sentence.",
        answers: ["comma", "full stop"],
        marks: 5,
        required: true
      },
      {
        id: "q4",
        type: "short_answer",
        question: "What is 'alliteration'?",
        expectedAnswer: "The repetition of the same letter or sound at the beginning of adjacent or closely connected words.",
        marks: 10,
        required: true
      },
      {
        id: "q5",
        type: "long_text",
        question: "Write a short narrative about a time you felt brave.",
        description: "Focus on using descriptive language and showing emotions.",
        expectedAnswer: "The student should describe a specific situation, their internal feelings of fear, and the action they took to overcome it.",
        keywords: "brave, fear, courage, narrative, emotions",
        marks: 20,
        required: true
      }
    ]
  },
  {
    id: "qb2",
    name: "Punctuation Mastery Test",
    description: "Test your knowledge of essential punctuation rules.",
    createdAt: new Date().toISOString(),
    questions: [
      { id: "p1", type: "section", question: "Basic Punctuation", marks: 0, required: false },
      { id: "p2", type: "mcq", question: "Which mark is used to end a question?", options: [{text: "?", isCorrect: true}, {text: "!", isCorrect: false}], marks: 2, required: true },
      { id: "p3", type: "section", question: "Advanced Punctuation", marks: 0, required: false },
      { id: "p4", type: "true_false", question: "Semicolons can join two independent clauses.", correctAnswer: true, marks: 5, required: true }
    ]
  }
];

const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: "lp1",
    name: "Writing Mastery",
    description: "Master the art of narrative and persuasive writing through a series of progressive challenges.",
    moduleId: "m1",
    stars: 5,
    starLessons: ["l-m1-1", "l-m1-2", "l-m1-3", "l-m1-4", "l-m1-5"],
    starsData: [
      { star: 1, mainLessonId: "l-m1-1", skillLessonIds: ["l-m2-1", "l-m2-2"] },
      { star: 2, mainLessonId: "l-m1-2", skillLessonIds: ["l-m2-3", "l-m2-4"] },
      { star: 3, mainLessonId: "l-m1-3", skillLessonIds: ["l-m2-5"] },
      { star: 4, mainLessonId: "l-m1-4", skillLessonIds: ["l-m2-6", "l-m2-7"] },
      { star: 5, mainLessonId: "l-m1-5", skillLessonIds: ["l-m2-8"] }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "lp2",
    name: "Punctuation Pro",
    description: "Become a punctuation expert by mastering every mark from commas to semicolons.",
    moduleId: "m2",
    stars: 4,
    starLessons: ["l-m2-1", "l-m2-2", "l-m2-3", "l-m2-4"],
    starsData: [
      { star: 1, mainLessonId: "l-m2-1", skillLessonIds: ["l-m3-1", "l-m3-2"] },
      { star: 2, mainLessonId: "l-m2-2", skillLessonIds: ["l-m3-3"] },
      { star: 3, mainLessonId: "l-m2-3", skillLessonIds: ["l-m3-4", "l-m3-5"] },
      { star: 4, mainLessonId: "l-m2-4", skillLessonIds: ["l-m3-6"] }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "lp3",
    name: "Edit Expert",
    description: "Learn the professional techniques to review and refine any piece of writing.",
    moduleId: "m3",
    stars: 6,
    starLessons: ["l-m3-1", "l-m3-2", "l-m3-3", "l-m3-4", "l-m3-5", "l-m3-6"],
    starsData: [
      { star: 1, mainLessonId: "l-m3-1", skillLessonIds: ["l-m1-1"] },
      { star: 2, mainLessonId: "l-m3-2", skillLessonIds: ["l-m1-2"] },
      { star: 3, mainLessonId: "l-m3-3", skillLessonIds: ["l-m1-3"] },
      { star: 4, mainLessonId: "l-m3-4", skillLessonIds: ["l-m1-4"] },
      { star: 5, mainLessonId: "l-m3-5", skillLessonIds: ["l-m1-5"] },
      { star: 6, mainLessonId: "l-m3-6", skillLessonIds: ["l-m1-6"] }
    ],
    createdAt: new Date().toISOString()
  }
];

export default function DashboardContent({ activeTab, showToast }: DashboardContentProps) {
  // Modules State
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [starFilter, setStarFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [editingChapterInEditor, setEditingChapterInEditor] = useState<Chapter | null>(null);
  const itemsPerPage = 10;

  // Modal States
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLearningPathModalOpen, setIsLearningPathModalOpen] = useState(false);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);
  const [isSkillLessonModalOpen, setIsSkillLessonModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "module" | "lesson" | "chapter" | "learning-path" | "assessments" } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [previewChapterIndex, setPreviewChapterIndex] = useState(0);
  const [isPathPreviewOpen, setIsPathPreviewOpen] = useState(false);
  const [isPreviewZigZag, setIsPreviewZigZag] = useState(true);
  const [previewPath, setPreviewPath] = useState<LearningPath | null>(null);
  const [isBankPreviewOpen, setIsBankPreviewOpen] = useState(false);
  const [previewBank, setPreviewBank] = useState<QuestionBank | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedModules = localStorage.getItem("aquire_modules");
    const savedLessons = localStorage.getItem("aquire_lessons");
    const savedPaths = localStorage.getItem("aquire_learning_paths");
    const savedBanks = localStorage.getItem("aquire_question_banks");
    
    // Check if we need to force update to the new writing curriculum
    let needsUpdate = true;
    try {
      if (savedModules && savedLessons && savedBanks) {
        const parsedModules = JSON.parse(savedModules);
        const parsedLessons = JSON.parse(savedLessons);
        const parsedBanks = JSON.parse(savedBanks);
        if (Array.isArray(parsedModules) && parsedModules.length > 0 && parsedModules.some(m => m.name === "Narrative Writing")) {
          // Check if any lesson has a long_text block
          const hasLongText = parsedLessons.some((l: any) => 
            l.chapters.some((c: any) => 
              c.blocks.some((b: any) => b.type === 'long_text')
            )
          );
          // Check for Seed Data Test lesson
          const hasSeedData = parsedLessons.some((l: any) => l.name === "Seed Data Test");
          // Check for Question Banks
          const hasBanks = Array.isArray(parsedBanks) && parsedBanks.length > 0;
          // Check for Skill Lessons
          const hasSkillLessons = parsedLessons.some((l: any) => l.isSkillLesson === true);

          if (hasLongText && hasSeedData && hasBanks && hasSkillLessons) {
            needsUpdate = false;
          }
        }
      }
    } catch (e) {
      needsUpdate = true;
    }

    if (needsUpdate) {
      setModules(INITIAL_MODULES);
      setLessons(INITIAL_LESSONS);
      setLearningPaths(INITIAL_LEARNING_PATHS);
      setQuestionBanks(INITIAL_QUESTION_BANKS);
      localStorage.setItem("aquire_modules", JSON.stringify(INITIAL_MODULES));
      localStorage.setItem("aquire_lessons", JSON.stringify(INITIAL_LESSONS));
      localStorage.setItem("aquire_learning_paths", JSON.stringify(INITIAL_LEARNING_PATHS));
      localStorage.setItem("aquire_question_banks", JSON.stringify(INITIAL_QUESTION_BANKS));
    } else {
      setModules(JSON.parse(savedModules!));
      setLessons(JSON.parse(savedLessons!));
      if (savedPaths) setLearningPaths(JSON.parse(savedPaths));
      if (savedBanks) setQuestionBanks(JSON.parse(savedBanks));
    }
  }, []);

  // Save data to localStorage
  const saveModules = (updatedModules: Module[]) => {
    setModules(updatedModules);
    localStorage.setItem("aquire_modules", JSON.stringify(updatedModules));
  };

  const saveLessons = (updatedLessons: Lesson[]) => {
    setLessons(updatedLessons);
    localStorage.setItem("aquire_lessons", JSON.stringify(updatedLessons));
  };

  const saveLearningPaths = (updatedPaths: LearningPath[]) => {
    setLearningPaths(updatedPaths);
    localStorage.setItem("aquire_learning_paths", JSON.stringify(updatedPaths));
  };

  const saveQuestionBanks = (updatedBanks: QuestionBank[]) => {
    setQuestionBanks(updatedBanks);
    localStorage.setItem("aquire_question_banks", JSON.stringify(updatedBanks));
  };

  // CRUD Handlers - Modules
  const handleSaveModule = (data: Omit<Module, "id" | "createdAt">) => {
    if (editingModule) {
      const updated = modules.map(m => m.id === editingModule.id ? { ...m, ...data } : m);
      saveModules(updated);
      showToast("Module updated successfully!", "success");
    } else {
      const newModule: Module = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      saveModules([newModule, ...modules]);
      showToast("Module created successfully!", "success");
    }
    setIsModuleModalOpen(false);
    setEditingModule(null);
  };

  const handleSaveSkillLesson = (lessonId: string, data: { isSkillLesson: boolean; learningPathId: string; starNumber: number }) => {
    const updated = lessons.map(l => l.id === lessonId ? { ...l, ...data } : l);
    saveLessons(updated);
    showToast("Skill lesson assignment saved!", "success");
    
    // Also update the learning path group if needed
    const savedLesson = updated.find(l => l.id === lessonId);
    if (savedLesson && savedLesson.isSkillLesson && savedLesson.learningPathId) {
      const updatedPaths = learningPaths.map(p => {
        if (p.id === savedLesson.learningPathId) {
          const starsData = p.starsData || [];
          const starIdx = starsData.findIndex(s => s.star === savedLesson.starNumber);
          
          if (starIdx > -1) {
            const updatedStarsData = [...starsData];
            if (!updatedStarsData[starIdx].skillLessonIds.includes(savedLesson.id)) {
              updatedStarsData[starIdx].skillLessonIds = [...updatedStarsData[starIdx].skillLessonIds, savedLesson.id];
            }
            return { ...p, starsData: updatedStarsData };
          } else {
            return {
              ...p,
              starsData: [...starsData, {
                star: savedLesson.starNumber!,
                mainLessonId: null,
                skillLessonIds: [savedLesson.id]
              }]
            };
          }
        }
        return p;
      });
      saveLearningPaths(updatedPaths);
    }
  };

  // CRUD Handlers - Lessons
  const handleSaveLesson = (data: Omit<Lesson, "id" | "chapters" | "createdAt">) => {
    let savedLesson: Lesson;
    if (editingLesson) {
      savedLesson = { ...editingLesson, ...data };
      const updated = lessons.map(l => l.id === editingLesson.id ? savedLesson : l);
      saveLessons(updated);
      showToast("Lesson updated successfully!", "success");
    } else {
      savedLesson = {
        id: "l" + Math.random().toString(36).substr(2, 9),
        ...data,
        chapters: [],
        createdAt: new Date().toISOString(),
      };
      saveLessons([savedLesson, ...lessons]);
      showToast("Lesson created successfully!", "success");
    }

    // Update Learning Path if it's a skill lesson
    if (savedLesson.isSkillLesson && savedLesson.learningPathId) {
      const updatedPaths = learningPaths.map(p => {
        if (p.id === savedLesson.learningPathId) {
          const starsData = p.starsData || [];
          const starIdx = starsData.findIndex(s => s.star === savedLesson.starNumber);
          
          if (starIdx > -1) {
            const updatedStarsData = [...starsData];
            if (!updatedStarsData[starIdx].skillLessonIds.includes(savedLesson.id)) {
              updatedStarsData[starIdx].skillLessonIds = [...updatedStarsData[starIdx].skillLessonIds, savedLesson.id];
            }
            return { ...p, starsData: updatedStarsData };
          } else {
            return {
              ...p,
              starsData: [...starsData, {
                star: savedLesson.starNumber!,
                mainLessonId: null,
                skillLessonIds: [savedLesson.id]
              }]
            };
          }
        }
        return p;
      });
      saveLearningPaths(updatedPaths);
    }

    setIsLessonModalOpen(false);
    setEditingLesson(null);
  };

  // CRUD Handlers - Chapters
  const handleSaveChapter = (data: Omit<Chapter, "id">) => {
    if (!selectedLessonId) return;
    const updated = lessons.map(l => {
      if (l.id === selectedLessonId) {
        if (editingChapter) {
          return {
            ...l,
            chapters: (l.chapters || []).map(c => c.id === editingChapter.id ? { ...c, ...data } : c)
          };
        } else {
          return {
            ...l,
            chapters: [...l.chapters, { ...data, id: "c" + Math.random().toString(36).substr(2, 9), blocks: [] }]
          };
        }
      }
      return l;
    });
    saveLessons(updated);
    showToast(editingChapter ? "Chapter updated!" : "Chapter added!", "success");
    setIsChapterModalOpen(false);
    setEditingChapter(null);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (itemToDelete.type === "module") {
      const updatedModules = modules.filter(m => m.id !== itemToDelete.id);
      const updatedLessons = lessons.filter(l => l.moduleId !== itemToDelete.id);
      saveModules(updatedModules);
      saveLessons(updatedLessons);
      showToast("Module and associated lessons deleted.", "success");
    } else if (itemToDelete.type === "lesson") {
      const updated = lessons.filter(l => l.id !== itemToDelete.id);
      saveLessons(updated);
      showToast("Lesson deleted successfully!", "success");
    } else if (itemToDelete.type === "chapter" && selectedLessonId) {
      const updated = lessons.map(l => {
        if (l.id === selectedLessonId) {
          return { ...l, chapters: l.chapters.filter(c => c.id !== itemToDelete.id) };
        }
        return l;
      });
      saveLessons(updated);
      showToast("Chapter deleted successfully!", "success");
    } else if (itemToDelete.type === "learning-path") {
      const updated = learningPaths.filter(p => p.id !== itemToDelete.id);
      saveLearningPaths(updated);
      showToast("Learning Path deleted successfully!", "success");
    } else if (itemToDelete.type === "assessments") {
      const updated = questionBanks.filter(b => b.id !== itemToDelete.id);
      saveQuestionBanks(updated);
      showToast("Assessment deleted successfully!", "success");
    }

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleSaveLearningPath = (data: Omit<LearningPath, "id" | "createdAt">) => {
    if (editingPath) {
      const updated = learningPaths.map(p => p.id === editingPath.id ? { ...p, ...data } : p);
      saveLearningPaths(updated);
      showToast("Learning Path updated successfully!", "success");
    } else {
      const newPath: LearningPath = {
        id: "lp" + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      saveLearningPaths([newPath, ...learningPaths]);
      showToast("Learning Path created successfully!", "success");
    }
    setIsLearningPathModalOpen(false);
    setEditingPath(null);
  };

  const handleSaveQuestionBank = (data: Omit<QuestionBank, "id" | "createdAt">) => {
    if (editingBank) {
      const updated = questionBanks.map(b => b.id === editingBank.id ? { ...b, ...data } : b);
      saveQuestionBanks(updated);
      showToast("Question Bank updated successfully!", "success");
    } else {
      const newBank: QuestionBank = {
        id: "qb" + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      saveQuestionBanks([newBank, ...questionBanks]);
      showToast("Question Bank created successfully!", "success");
    }
    setIsQuestionBankModalOpen(false);
    setEditingBank(null);
  };

  // Filtering & Sorting
  const filteredModules = useMemo(() => {
    let result = modules.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return result;
  }, [modules, searchQuery, sortOrder]);

  const filteredLessons = useMemo(() => {
    let result = lessons.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = moduleFilter === "all" || l.moduleId === moduleFilter;
      return matchesSearch && matchesModule;
    });
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return result;
  }, [lessons, searchQuery, moduleFilter, sortOrder]);

  const filteredLearningPaths = useMemo(() => {
    let result = learningPaths.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = moduleFilter === "all" || p.moduleId === moduleFilter;
      const matchesStars = starFilter === "all" || p.stars.toString() === starFilter;
      return matchesSearch && matchesModule && matchesStars;
    });
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return result;
  }, [learningPaths, searchQuery, moduleFilter, starFilter, sortOrder]);

  // Pagination
  const currentItems = activeTab === "modules" ? filteredModules : 
                      activeTab === "lessons" ? filteredLessons : 
                      activeTab === "learning-paths" ? filteredLearningPaths : [];
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const paginatedItems = currentItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder, moduleFilter, activeTab]);

  const selectedLesson = useMemo(() => 
    lessons.find(l => l.id === selectedLessonId), 
  [lessons, selectedLessonId]);

  const stats = [
    { label: "Total Students", value: "1,284", change: "+12%", icon: <Users className="text-aquire-primary" />, color: "bg-aquire-primary/10" },
    { label: "Active Modules", value: modules.length.toString(), change: "+3", icon: <Layers className="text-emerald-500" />, color: "bg-emerald-500/10" },
    { label: "Total Lessons", value: lessons.length.toString(), change: "+8%", icon: <BookOpen className="text-amber-500" />, color: "bg-amber-500/10" },
    { label: "Completion Rate", value: "89%", change: "+2%", icon: <TrendingUp className="text-purple-500" />, color: "bg-purple-500/10" },
  ];

  const renderDashboard = () => (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 group hover:border-aquire-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                stat.change.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              }`}>
                {stat.change}
              </span>
            </div>
            <h4 className="text-aquire-grey-med font-semibold text-sm uppercase tracking-wider mb-1">{stat.label}</h4>
            <p className="text-3xl font-bold text-aquire-black tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-aquire-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-aquire-black">Recent Activity</h3>
              <button className="text-aquire-primary font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="p-0">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className={`p-6 flex items-center gap-4 hover:bg-aquire-grey-light transition-colors ${i !== 2 ? 'border-b border-aquire-border' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-aquire-grey-light flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-aquire-grey-med" />
                  </div>
                  <div className="flex-1">
                    <p className="text-aquire-text-heading font-bold">New lesson added to "Advanced Algebra"</p>
                    <p className="text-aquire-grey-med text-sm">2 hours ago • by Admin</p>
                  </div>
                  <button className="p-2 hover:bg-white rounded-lg transition-all text-aquire-grey-med">
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-8 bg-aquire-black text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-aquire-primary/20 blur-3xl rounded-full" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => {
                    setEditingModule(null);
                    setIsModuleModalOpen(true);
                  }}
                  className="btn-primary w-full"
                >
                  <Plus size={20} />
                  Add New Module
                </button>
                <button 
                  onClick={() => {
                    setEditingLesson(null);
                    setIsLessonModalOpen(true);
                  }}
                  className="btn-secondary w-full !bg-white/5 !border-white/10 !text-white hover:!bg-white/10"
                >
                  <GraduationCap size={20} />
                  Add New Lesson
                </button>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-aquire-black mb-4">Storage Usage</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-aquire-grey-med font-medium">Video Content</span>
                <span className="text-aquire-black font-bold">4.2 GB / 10 GB</span>
              </div>
              <div className="w-full h-3 bg-aquire-grey-light rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "42%" }}
                  className="h-full bg-aquire-primary rounded-full"
                />
              </div>
              <p className="text-xs text-aquire-grey-med">You have used 42% of your total storage capacity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
            <span>Academic</span>
            <ChevronRight size={12} />
            <span className="text-aquire-primary">Modules</span>
          </div>
          <h2 className="text-3xl font-bold text-aquire-black">Modules Management</h2>
          <p className="text-aquire-grey-med">Create, edit, and organize your academic modules.</p>
        </div>
        <button 
          onClick={() => {
            setEditingModule(null);
            setIsModuleModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={20} />
          Add New Module
        </button>
      </div>

      <div className="card p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or description..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2 px-6 py-4 bg-aquire-grey-light rounded-xl text-aquire-grey-dark hover:bg-aquire-border transition-all text-sm font-bold border border-aquire-border"
            >
              <ArrowUpDown size={18} />
              Sort: {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-aquire-border text-aquire-grey-med text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-6 py-4">Module Details</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <AnimatePresence mode="popLayout">
                {paginatedItems.length > 0 ? (
                  (paginatedItems as Module[]).map((mod) => (
                    <motion.tr 
                      key={mod.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border-b border-aquire-border hover:bg-aquire-grey-light transition-colors group"
                    >
                      <td className="px-6 py-6 max-w-md">
                        <div className="flex flex-col">
                          <span className="text-aquire-text-heading font-bold text-lg mb-1 group-hover:text-aquire-primary transition-colors cursor-pointer">
                            {mod.name}
                          </span>
                          <span className="text-aquire-grey-med text-xs line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: mod.description }}>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-aquire-grey-med">
                          <Calendar size={14} className="text-aquire-primary/50" />
                          <span className="text-xs font-medium">
                            {new Date(mod.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingModule(mod);
                              setIsModuleModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-primary/10 transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setItemToDelete({ id: mod.id, type: "module" });
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center">
                      <p className="text-aquire-grey-med">No modules found.</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>
    </motion.div>
  );

  const renderLessons = () => {
    if (isPreviewOpen && previewLesson) {
      return (
        <StudentPreview 
          lesson={previewLesson}
          initialChapterIndex={previewChapterIndex}
          onClose={() => setIsPreviewOpen(false)}
        />
      );
    }

    if (editingChapterInEditor) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest">
              <span>Lessons</span>
              <ChevronRight size={12} />
              <span>{selectedLesson?.name}</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Editor</span>
            </div>
            <button 
              onClick={() => {
                setPreviewLesson(selectedLesson || null);
                setPreviewChapterIndex(selectedLesson?.chapters.findIndex(c => c.id === editingChapterInEditor.id) || 0);
                setIsPreviewOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-dark hover:bg-aquire-grey-light transition-all text-sm font-bold shadow-sm"
            >
              <Eye size={18} />
              Preview Chapter
            </button>
          </div>
          <ChapterEditor 
            chapter={editingChapterInEditor}
            onBack={() => setEditingChapterInEditor(null)}
            onUpdate={(updatedChapter) => {
              if (!selectedLessonId) return;
              setLessons(prev => prev.map(l => {
                if (l.id === selectedLessonId) {
                  return {
                    ...l,
                    chapters: (l.chapters || []).map(c => c.id === updatedChapter.id ? updatedChapter : c)
                  };
                }
                return l;
              }));
            }}
            onSave={(updatedChapter) => {
              if (!selectedLessonId) return;
              setLessons(prev => prev.map(l => {
                if (l.id === selectedLessonId) {
                  return {
                    ...l,
                    chapters: (l.chapters || []).map(c => c.id === updatedChapter.id ? updatedChapter : c)
                  };
                }
                return l;
              }));
              showToast("Chapter saved successfully", "success");
              setEditingChapterInEditor(null);
            }}
            showToast={showToast}
          />
        </div>
      );
    }

    if (selectedLessonId) return renderLessonDetail();

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Academic</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Lessons</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">Lessons Management</h2>
            <p className="text-aquire-grey-med">Manage your course lessons and their chapters.</p>
          </div>
          <button 
            onClick={() => {
              setEditingLesson(null);
              setIsLessonModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={20} />
            Add New Lesson
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4" />
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="pl-10 pr-10 py-4 bg-white border border-aquire-border rounded-xl text-aquire-grey-dark text-sm font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-aquire-primary/20"
              >
                <option value="all">All Modules</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4 pointer-events-none" />
            </div>
            <div className="flex bg-white rounded-xl p-1 border border-aquire-border shadow-sm">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg transition-all ${viewMode === "grid" ? "bg-aquire-primary text-white" : "text-aquire-grey-med hover:bg-aquire-grey-light"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg transition-all ${viewMode === "list" ? "bg-aquire-primary text-white" : "text-aquire-grey-med hover:bg-aquire-grey-light"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {(paginatedItems as Lesson[]).map((lesson) => (
                <motion.div
                  key={lesson.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card overflow-hidden group hover:border-aquire-primary/30 transition-all cursor-pointer"
                  onClick={() => setSelectedLessonId(lesson.id)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={lesson.thumbnail} 
                      alt={lesson.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-aquire-black/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-aquire-primary/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
                        {modules.find(m => m.id === lesson.moduleId)?.name || "Module"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-aquire-black mb-2 group-hover:text-aquire-primary transition-colors">{lesson.name}</h3>
                    <p className="text-aquire-grey-med text-xs line-clamp-2 mb-6" dangerouslySetInnerHTML={{ __html: lesson.description }}></p>
                    <div className="flex items-center justify-between pt-4 border-t border-aquire-border">
                      <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-medium">
                        <Book size={14} className="text-aquire-primary" />
                        {lesson.chapters?.length || 0} Chapters
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingLesson(lesson);
                            setIsLessonModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-aquire-grey-light text-aquire-grey-med hover:text-aquire-primary transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete({ id: lesson.id, type: "lesson" });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-aquire-grey-light text-aquire-grey-med hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-aquire-border text-aquire-grey-med text-[10px] uppercase tracking-[0.2em] font-bold">
                    <th className="px-6 py-4">Lesson Details</th>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">Chapters</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <AnimatePresence mode="popLayout">
                    {(paginatedItems as Lesson[]).map((lesson) => (
                      <motion.tr 
                        key={lesson.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-b border-aquire-border hover:bg-aquire-grey-light transition-colors group cursor-pointer"
                        onClick={() => setSelectedLessonId(lesson.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={lesson.thumbnail} 
                              alt="" 
                              className="w-12 h-10 rounded-lg object-cover border border-aquire-border"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="text-aquire-text-heading font-bold">{lesson.name}</h4>
                              <p className="text-aquire-grey-med text-xs line-clamp-1" dangerouslySetInnerHTML={{ __html: lesson.description }}></p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-aquire-grey-light text-aquire-grey-dark text-[10px] font-bold uppercase tracking-widest border border-aquire-border">
                            {modules.find(m => m.id === lesson.moduleId)?.name || "Module"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-aquire-grey-med text-xs">
                            <Book size={14} />
                            {lesson.chapters?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingLesson(lesson);
                                setIsLessonModalOpen(true);
                              }}
                              className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-primary/10 transition-all"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete({ id: lesson.id, type: "lesson" });
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {renderPagination()}
      </motion.div>
    );
  };

  const renderLessonDetail = () => {
    if (!selectedLesson) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <button 
          onClick={() => setSelectedLessonId(null)}
          className="flex items-center gap-2 text-aquire-grey-med hover:text-aquire-primary transition-colors group font-bold"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Lessons
        </button>

        <div className="card p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
            <img 
              src={selectedLesson.thumbnail} 
              alt="" 
              className="w-full h-full object-cover blur-3xl"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-64 aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-aquire-border">
              <img 
                src={selectedLesson.thumbnail} 
                alt={selectedLesson.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-aquire-primary/10 text-aquire-primary text-[10px] font-bold uppercase tracking-widest">
                  {modules.find(m => m.id === selectedLesson.moduleId)?.name}
                </span>
                <span className="text-aquire-border">•</span>
                <span className="text-aquire-grey-med text-xs">{new Date(selectedLesson.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-4xl font-bold text-aquire-black">{selectedLesson.name}</h2>
              <p className="text-aquire-grey-med text-lg leading-relaxed max-w-2xl" dangerouslySetInnerHTML={{ __html: selectedLesson.description }}></p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => {
                    setPreviewLesson(selectedLesson);
                    setPreviewChapterIndex(0);
                    setIsPreviewOpen(true);
                  }}
                  className="px-8 py-4 bg-white border border-aquire-border text-aquire-grey-dark font-bold rounded-2xl hover:bg-aquire-grey-light transition-all flex items-center gap-2 shadow-sm"
                >
                  <Eye size={20} />
                  Preview Lesson
                </button>
                <button 
                  onClick={() => {
                    setEditingChapter(null);
                    setIsChapterModalOpen(true);
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Chapter
                </button>
                <button 
                  onClick={() => {
                    setEditingLesson(selectedLesson);
                    setIsLessonModalOpen(true);
                  }}
                  className="px-8 py-4 bg-aquire-grey-light text-aquire-grey-dark font-bold rounded-2xl hover:bg-aquire-border transition-all flex items-center gap-2"
                >
                  <Edit size={18} />
                  Edit Lesson
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-aquire-black flex items-center gap-3 px-4">
            Chapters
            <span className="text-sm font-normal text-aquire-grey-med bg-aquire-grey-light px-3 py-1 rounded-full border border-aquire-border">
              {selectedLesson?.chapters?.length || 0} Total
            </span>
          </h3>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {selectedLesson?.chapters?.map((chapter, i) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                  className="card overflow-hidden group"
                >
                  <div className="p-8 flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-aquire-grey-light flex items-center justify-center text-aquire-grey-dark font-bold group-hover:bg-aquire-primary group-hover:text-white transition-all shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-aquire-black mb-1">{chapter.name}</h4>
                          <div className="flex items-center gap-4 text-aquire-grey-med text-xs">
                            <span className="flex items-center gap-1"><FileText size={14} /> Text Content</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingChapterInEditor(chapter)}
                            className="p-3 rounded-xl hover:bg-aquire-grey-light text-aquire-grey-med hover:text-aquire-primary transition-all flex items-center gap-2"
                            title="Edit Content Blocks"
                          >
                            <LayoutGrid size={18} />
                            <span className="text-xs font-bold uppercase">Editor</span>
                          </button>
                          <button 
                            onClick={() => {
                              setEditingChapter(chapter);
                              setIsChapterModalOpen(true);
                            }}
                            className="p-3 rounded-xl hover:bg-aquire-grey-light text-aquire-grey-med hover:text-aquire-primary transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setItemToDelete({ id: chapter.id, type: "chapter" });
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-3 rounded-xl hover:bg-aquire-grey-light text-aquire-grey-med hover:text-red-500 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 rounded-2xl bg-aquire-grey-light text-aquire-grey-med text-sm leading-relaxed border border-aquire-border line-clamp-3 overflow-hidden" dangerouslySetInnerHTML={{ __html: chapter.content }}>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {selectedLesson.chapters.length === 0 && (
              <div className="p-20 text-center card border-dashed border-2 border-aquire-border bg-transparent shadow-none">
                <p className="text-aquire-grey-med">No chapters added yet.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSkills = () => {
    const skillLessons = lessons.filter(l => l.isSkillLesson);
    const filteredSkills = skillLessons.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Academic</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Skill-Based Lessons</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">Skill-Based Lessons</h2>
            <p className="text-aquire-grey-med">Manage floating lessons that reinforce specific skills within learning paths.</p>
          </div>
          <button 
            onClick={() => setIsSkillLessonModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={20} />
            Add Skill Lesson
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill lessons..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredSkills.map((lesson) => (
            <motion.div
              key={lesson.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 flex items-center gap-6 hover:border-aquire-primary transition-all group"
            >
              <div className="w-20 h-12 rounded-lg overflow-hidden shrink-0 border border-aquire-border">
                <img 
                  src={lesson.thumbnail} 
                  alt={lesson.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black text-aquire-primary uppercase tracking-widest">
                    {modules.find(m => m.id === lesson.moduleId)?.name || "General"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-aquire-grey-med" />
                  <span className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">
                    {lesson.chapters.length} Chapters
                  </span>
                </div>
                <h3 className="text-base font-bold text-aquire-black truncate group-hover:text-aquire-primary transition-colors">
                  {lesson.name}
                </h3>
              </div>

              <div className="hidden md:flex flex-col items-end shrink-0 px-6 border-x border-aquire-border">
                <div className="flex items-center gap-1.5 text-xs font-bold text-aquire-black">
                  <Trophy size={14} className="text-amber-500" />
                  <span>Star {lesson.starNumber}</span>
                </div>
                <span className="text-[10px] font-medium text-aquire-grey-med italic">
                  {learningPaths.find(p => p.id === lesson.learningPathId)?.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => {
                    setPreviewLesson(lesson);
                    setPreviewChapterIndex(0);
                    setIsPreviewOpen(true);
                  }}
                  className="p-2 hover:bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary transition-all"
                  title="Preview"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => {
                    setEditingLesson(lesson);
                    setIsLessonModalOpen(true);
                  }}
                  className="p-2 hover:bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary transition-all"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => {
                    const updated = lessons.map(l => 
                      l.id === lesson.id ? { ...l, isSkillLesson: false, learningPathId: undefined, starNumber: undefined } : l
                    );
                    saveLessons(updated);
                    showToast("Skill lesson removed", "success");
                  }}
                  className="p-2 hover:bg-red-50 text-aquire-grey-med hover:text-red-500 transition-all"
                  title="Remove Skill Assignment"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {skillLessons.length === 0 && (
          <div className="py-20 text-center card border-dashed border-2 border-aquire-border bg-transparent shadow-none">
            <div className="w-16 h-16 bg-aquire-grey-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} className="text-aquire-grey-med" />
            </div>
            <h3 className="text-xl font-bold text-aquire-black mb-2">No Skill Lessons Found</h3>
            <p className="text-aquire-grey-med max-w-sm mx-auto mb-8">
              Skill lessons are floating lessons that reinforce specific skills. Add one to get started!
            </p>
            <button 
              onClick={() => setIsSkillLessonModalOpen(true)}
              className="btn-primary"
            >
              <Plus size={20} />
              Add First Skill Lesson
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const renderLearningPaths = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Academic</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Learning Paths</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">Learning Paths</h2>
            <p className="text-aquire-grey-med">Create and manage sequential learning journeys for students.</p>
          </div>
          <button 
            onClick={() => {
              setEditingPath(null);
              setIsLearningPathModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={20} />
            Create Learning Path
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paths..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4" />
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="pl-10 pr-10 py-4 bg-white border border-aquire-border rounded-xl text-aquire-grey-dark text-sm font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-aquire-primary/20"
              >
                <option value="all">All Modules</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4 pointer-events-none" />
            </div>
            <div className="relative">
              <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4" />
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                className="pl-10 pr-10 py-4 bg-white border border-aquire-border rounded-xl text-aquire-grey-dark text-sm font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-aquire-primary/20"
              >
                <option value="all">All Stars</option>
                {[5, 10, 15, 20].map(n => (
                  <option key={n} value={n.toString()}>{n} Stars</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-aquire-border text-aquire-grey-med text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-6 py-4">Path Details</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4">Stars</th>
                  <th className="px-6 py-4">Lessons</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence mode="popLayout">
                  {(paginatedItems as LearningPath[]).map((path) => (
                    <motion.tr 
                      key={path.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border-b border-aquire-border hover:bg-aquire-grey-light transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-aquire-text-heading font-bold">{path.name}</h4>
                          <p className="text-aquire-grey-med text-xs line-clamp-1" dangerouslySetInnerHTML={{ __html: path.description }}></p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-aquire-grey-light text-aquire-grey-dark text-[10px] font-bold uppercase tracking-widest border border-aquire-border">
                          {modules.find(m => m.id === path.moduleId)?.name || "Module"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-amber-600 font-bold">
                          <Star size={14} fill="currentColor" />
                          {path.stars}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-aquire-grey-med text-xs">
                          <BookOpen size={14} />
                          {path.starLessons.filter(l => l !== null).length} / {path.stars}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setPreviewPath(path);
                              setIsPreviewZigZag(true);
                              setIsPathPreviewOpen(true);
                            }}
                            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary transition-all"
                            title="Gamified Zig-Zag Preview"
                          >
                            <Sparkles size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setPreviewPath(path);
                              setIsPreviewZigZag(false);
                              setIsPathPreviewOpen(true);
                            }}
                            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary transition-all"
                            title="Sequential Preview"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingPath(path);
                              setIsLearningPathModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-primary/10 transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setItemToDelete({ id: path.id, type: "learning-path" });
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredLearningPaths.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-aquire-grey-med">
                      No learning paths found. Create your first one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </div>
      </motion.div>
    );
  };

  const renderAssessments = () => {
    const filteredBanks = questionBanks.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-aquire-border">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={20} />
            <input 
              type="text" 
              placeholder="Search assessments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-aquire-grey-light border border-aquire-border rounded-2xl focus:outline-none focus:border-aquire-primary transition-all"
            />
          </div>
          <button 
            onClick={() => {
              setEditingBank(null);
              setIsQuestionBankModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-aquire-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-aquire-primary/20 transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Create Assessment
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-aquire-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-aquire-border text-aquire-grey-med text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-6 py-4">Assessment Details</th>
                  <th className="px-6 py-4">Questions</th>
                  <th className="px-6 py-4">Total Marks</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence mode="popLayout">
                  {filteredBanks.map((bank) => (
                    <motion.tr 
                      key={bank.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border-b border-aquire-border hover:bg-aquire-grey-light transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-aquire-text-heading font-bold">{bank.name}</h4>
                          <p className="text-aquire-grey-med text-xs line-clamp-1">{bank.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-aquire-primary text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                          {bank.questions.filter(q => q.type !== 'section').length} Questions
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-aquire-text-heading">
                          {bank.questions.reduce((acc, q) => acc + (q.marks || 0), 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-aquire-grey-med text-xs">
                        {new Date(bank.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setPreviewBank(bank);
                              setIsBankPreviewOpen(true);
                            }}
                            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary transition-all"
                            title="Preview Student View"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingBank(bank);
                              setIsQuestionBankModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-primary/10 transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setItemToDelete({ id: bank.id, type: "assessments" });
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredBanks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-aquire-grey-med">
                      No assessments found. Create your first one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="mt-8 pt-8 border-t border-aquire-border flex items-center justify-between">
        <p className="text-aquire-grey-med text-xs font-bold uppercase tracking-widest">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, currentItems.length)} of {currentItems.length}
        </p>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                  currentPage === page 
                    ? "bg-aquire-primary text-white shadow-lg shadow-aquire-primary/20" 
                    : "bg-white border border-aquire-border text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-grey-light"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const formatTabName = (tab: string) => {
    if (tab === "dashboard") return "Dashboard Overview";
    if (tab === "skills") return "Skill-Based Lessons";
    return tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-aquire-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-aquire-primary/20">
        <LayoutDashboard className="text-aquire-primary w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-aquire-black mb-2">{formatTabName(activeTab)} Section</h2>
      <p className="text-aquire-grey-med max-w-sm">This section is currently under development. Please check back later for updates.</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-aquire-black tracking-tight">
          {formatTabName(activeTab)}
        </h1>
        <p className="text-aquire-grey-med mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </header>

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "modules" && renderModules()}
      {activeTab === "lessons" && renderLessons()}
      {activeTab === "skills" && renderSkills()}
      {activeTab === "learning-paths" && renderLearningPaths()}
      {activeTab === "assessments" && renderAssessments()}
      {activeTab !== "dashboard" && activeTab !== "modules" && activeTab !== "lessons" && activeTab !== "skills" && activeTab !== "learning-paths" && activeTab !== "assessments" && renderPlaceholder()}

      {/* Modals */}
      <ModuleModal 
        isOpen={isModuleModalOpen}
        onClose={() => {
          setIsModuleModalOpen(false);
          setEditingModule(null);
        }}
        onSave={handleSaveModule}
        editingModule={editingModule}
      />

      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setEditingLesson(null);
        }}
        onSave={handleSaveLesson}
        editingLesson={editingLesson}
        modules={modules}
        learningPaths={learningPaths}
      />

      <ChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => {
          setIsChapterModalOpen(false);
          setEditingChapter(null);
        }}
        onSave={handleSaveChapter}
        editingChapter={editingChapter}
      />

      <LearningPathModal
        isOpen={isLearningPathModalOpen}
        onClose={() => {
          setIsLearningPathModalOpen(false);
          setEditingPath(null);
        }}
        onSave={handleSaveLearningPath}
        editingPath={editingPath}
        modules={modules}
        lessons={lessons}
      />

      <QuestionBankModal
        isOpen={isQuestionBankModalOpen}
        onClose={() => {
          setIsQuestionBankModalOpen(false);
          setEditingBank(null);
        }}
        onSave={handleSaveQuestionBank}
        editingBank={editingBank}
      />

      {isPathPreviewOpen && previewPath && (
        isPreviewZigZag ? (
          <LearningPathZigZagPreview 
            path={previewPath}
            lessons={lessons}
            onClose={() => {
              setIsPathPreviewOpen(false);
              setPreviewPath(null);
            }}
          />
        ) : (
          <LearningPathPreview 
            path={previewPath}
            lessons={lessons}
            onClose={() => {
              setIsPathPreviewOpen(false);
              setPreviewPath(null);
            }}
          />
        )
      )}

      {isBankPreviewOpen && previewBank && (
        <QuestionBankPreview
          bank={previewBank}
          onClose={() => {
            setIsBankPreviewOpen(false);
            setPreviewBank(null);
          }}
        />
      )}

      <SkillLessonModal
        isOpen={isSkillLessonModalOpen}
        onClose={() => setIsSkillLessonModalOpen(false)}
        onSave={handleSaveSkillLesson}
        modules={modules}
        lessons={lessons}
        learningPaths={learningPaths}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={itemToDelete?.id || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
