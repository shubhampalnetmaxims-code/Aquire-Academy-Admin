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
  Upload,
  Building2,
  Shield,
  Key,
  RefreshCw,
  Loader2,
  X
} from "lucide-react";
import ModuleModal from "./ModuleModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import LessonModal from "./LessonModal";
import { Module, Lesson, Chapter, ContentBlock, LearningPath, QuestionBank, Organization, Grade } from "../types";
import ChapterModal from "./ChapterModal";
import ChapterEditor from "./ChapterEditor";
import StudentPreview from "./StudentPreview";
import LearningPathModal from "./LearningPathModal";
import LearningPathPreview from "./LearningPathPreview";
import LearningPathZigZagPreview from "./LearningPathZigZagPreview";
import QuestionBankModal from "./QuestionBankModal";
import QuestionBankPreview from "./QuestionBankPreview";
import SkillLessonModal from "./SkillLessonModal";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import { Teacher, Invitation } from "../types";

interface DashboardContentProps {
  activeTab: string;
  showToast: (message: string, type: "success" | "error") => void;
}

const INITIAL_MODULES: Module[] = [
  { 
    id: "m1", 
    name: "Advanced English Composition", 
    description: "Master the art of structured writing, advanced grammar, and persuasive techniques for academic excellence.", 
    gradeIds: ["g4", "g5"], 
    createdAt: new Date().toISOString() 
  },
  { 
    id: "m2", 
    name: "Foundational Mathematics", 
    description: "Building strong mathematical foundations through interactive problem solving and logical reasoning.", 
    gradeIds: ["g1", "g2", "g3"], 
    createdAt: new Date().toISOString() 
  },
  { 
    id: "m3", 
    name: "Introduction to Life Sciences", 
    description: "Exploring the wonders of the natural world, from microscopic cells to complex ecosystems.", 
    gradeIds: ["g3", "g4", "g5"], 
    createdAt: new Date().toISOString() 
  },
];

const INITIAL_GRADES: Grade[] = [
  { id: "g1", name: "Grade 1", description: "Lower Primary", status: "active", created: new Date().toISOString() },
  { id: "g2", name: "Grade 2", description: "Lower Primary", status: "active", created: new Date().toISOString() },
  { id: "g3", name: "Grade 3", description: "Middle Primary", status: "active", created: new Date().toISOString() },
  { id: "g4", name: "Grade 4", description: "Upper Primary", status: "active", created: new Date().toISOString() },
  { id: "g5", name: "Grade 5", description: "Upper Primary", status: "active", created: new Date().toISOString() },
];

const generateLessons = (): Lesson[] => {
  const lessons: Lesson[] = [];
  const moduleData = [
    { 
      id: "m1", 
      name: "Advanced English Composition",
      lessonNames: ["The Art of Persuasion", "Creative Narrative Writing", "Academic Essay Structure"]
    },
    { 
      id: "m2", 
      name: "Foundational Mathematics",
      lessonNames: ["Number Sense & Operations", "Geometry & Spatial Reasoning", "Data Handling & Probability"]
    },
    { 
      id: "m3", 
      name: "Introduction to Life Sciences",
      lessonNames: ["The World of Plants", "Animal Kingdoms", "Human Body Systems"]
    }
  ];

  const getChapterData = (type: string, modName: string, lessonName: string, chapterIdx: number) => {
    const baseId = `b-${type}-${Math.random().toString(36).substr(2, 5)}`;
    switch (type) {
      case 'reading':
        return {
          name: `📖 Reading: ${lessonName} Concepts`,
          blocks: [{
            id: baseId,
            type: 'reading' as const,
            data: {
              text: `<h3>Mastering ${lessonName}</h3><p>In this chapter, we explore the fundamental aspects of ${lessonName} within the context of ${modName}. Understanding these concepts is essential for academic growth.</p><h4>Key Learning Objectives:</h4><ul><li>Identify core principles of ${lessonName}</li><li>Analyze real-world applications</li><li>Synthesize information from multiple sources</li></ul>`,
              examples: `<strong>Example A:</strong> Applying ${lessonName} in a standard scenario.\n<strong>Example B:</strong> Advanced implementation of ${modName} techniques.`
            }
          }]
        };
      case 'video':
        return {
          name: `🎥 Video Tutorial: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'video' as const,
            data: {
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
              description: `A comprehensive visual walkthrough of ${lessonName} techniques and best practices.`
            }
          }]
        };
      case 'mcq':
        return {
          name: `✅ Knowledge Check: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'mcq' as const,
            data: {
              question: `Which of the following best describes the primary objective of ${lessonName}?`,
              options: [
                { text: "Memorizing facts without context", isCorrect: false },
                { text: "Applying critical thinking to solve problems", isCorrect: true },
                { text: "Following instructions blindly", isCorrect: false },
                { text: "Avoiding all challenges", isCorrect: false }
              ],
              marks: 5
            }
          }]
        };
      case 'short_answer':
        return {
          name: `✍️ Quick Quiz: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'short_answer' as const,
            data: {
              questions: [
                { q: `Define the core concept of ${lessonName}.`, a: `It is the systematic study and application of ${modName} principles.` },
                { q: `Why is ${lessonName} important?`, a: `It provides the necessary tools for advanced learning and practical application.` }
              ],
              marks: 10
            }
          }]
        };
      case 'fill_blanks':
        return {
          name: `🧩 Vocabulary: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'fill_blanks' as const,
            data: {
              text: `${lessonName} is a [blank] process that requires [blank] and [blank].`,
              answers: ["dynamic", "patience", "practice"],
              options: [
                ["static", "dynamic", "linear"],
                ["patience", "speed", "luck"],
                ["practice", "guessing", "waiting"]
              ],
              marks: 5
            }
          }]
        };
      case 'true_false':
        return {
          name: `✔️ Fact or Fiction: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'true_false' as const,
            data: {
              statement: `${lessonName} is a skill that can be improved through consistent effort and feedback.`,
              isTrue: true,
              marks: 5
            }
          }]
        };
      case 'drag_drop':
        return {
          name: `🔀 Sequence: ${lessonName} Workflow`,
          blocks: [{
            id: baseId,
            type: 'drag_drop' as const,
            data: {
              paragraph: `The correct order of operations in ${lessonName} is: [blank], then [blank], and finally [blank].`,
              items: ["Analysis", "Execution", "Evaluation"],
              answers: ["Analysis", "Execution", "Evaluation"],
              marks: 10
            }
          }]
        };
      case 'long_text':
        return {
          name: `📝 Critical Essay: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'long_text' as const,
            data: {
              question: `Discuss the impact of ${lessonName} on modern ${modName} practices.`,
              description: "Write a minimum of 200 words. Include at least two specific examples.",
              expected_answer: "The student should demonstrate a deep understanding of the topic, linking theoretical concepts to practical examples and showing critical analysis.",
              keywords: `${lessonName.toLowerCase()}, impact, examples, analysis`,
              marks: 20
            }
          }]
        };
      default:
        return { name: "Chapter", blocks: [] };
    }
  };

  const chapterTypes = ['reading', 'video', 'mcq', 'short_answer', 'fill_blanks', 'true_false', 'drag_drop', 'long_text'];

  moduleData.forEach((mod) => {
    mod.lessonNames.forEach((lessonName, lessonIdx) => {
      const lessonId = `l-${mod.id}-${lessonIdx + 1}`;
      const chapters: Chapter[] = [];
      
      const module = INITIAL_MODULES.find(m => m.id === mod.id);
      const gradeId = module?.gradeIds[lessonIdx % module.gradeIds.length] || "g1";

      chapterTypes.forEach((type, cIdx) => {
        const chapterId = `c-${lessonId}-${cIdx + 1}`;
        const { name, blocks } = getChapterData(type, mod.name, lessonName, cIdx);
        chapters.push({ id: chapterId, name, content: "", blocks });
      });

      const isSkillLesson = lessonIdx === 2; // Make the 3rd lesson a skill lesson
      lessons.push({
        id: lessonId,
        moduleId: mod.id,
        gradeId: gradeId,
        name: lessonName,
        description: `A deep dive into ${lessonName}, designed to challenge and inspire students in ${mod.name}.`,
        thumbnail: `https://picsum.photos/seed/${lessonId}/800/600`,
        createdAt: new Date().toISOString(),
        chapters,
        isSkillLesson: isSkillLesson,
        starNumber: isSkillLesson ? 3 : undefined,
        learningPathId: isSkillLesson ? `lp-${mod.id}` : undefined
      });
    });
  });

  return lessons;
};

const INITIAL_LESSONS: Lesson[] = generateLessons();

const INITIAL_QUESTION_BANKS: QuestionBank[] = [
  {
    id: "qb1",
    name: "English Proficiency Benchmark",
    description: "A comprehensive assessment of writing skills, reading comprehension, and grammatical accuracy.",
    gradeIds: ["g4", "g5"],
    createdAt: new Date().toISOString(),
    questions: [
      { id: "sec1", type: "section", question: "Section A: Grammar & Vocabulary", marks: 0, required: false },
      {
        id: "q1",
        type: "mcq",
        question: "Identify the correct use of the semicolon in the following sentences.",
        options: [
          { text: "I like apples; and oranges.", isCorrect: false },
          { text: "The weather was beautiful; we decided to go for a walk.", isCorrect: true },
          { text: "She said; 'Hello'.", isCorrect: false },
          { text: "Wait; for me.", isCorrect: false }
        ],
        marks: 5,
        required: true,
        image: "https://picsum.photos/seed/grammar/800/400"
      },
      {
        id: "q2",
        type: "fill_blanks",
        question: "The [blank] of the story was [blank] and [blank].",
        answers: ["protagonist", "brave", "determined"],
        marks: 5,
        required: true
      },
      { id: "sec2", type: "section", question: "Section B: Critical Analysis", marks: 0, required: false },
      {
        id: "q3",
        type: "true_false",
        question: "A persuasive essay should only present one side of the argument to be effective.",
        correctAnswer: false,
        marks: 5,
        required: true
      },
      {
        id: "q4",
        type: "long_text",
        question: "Analyze the theme of 'Resilience' in a book you have recently read.",
        description: "Provide specific textual evidence to support your claims.",
        expectedAnswer: "The student should identify a character or situation showing resilience and explain how it contributes to the overall theme.",
        keywords: "resilience, theme, evidence, analysis",
        marks: 20,
        required: true
      }
    ]
  },
  {
    id: "qb2",
    name: "Mathematics Logic & Reasoning",
    description: "Testing fundamental mathematical concepts and logical deduction capabilities.",
    gradeIds: ["g1", "g2", "g3"],
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "mq1",
        type: "mcq",
        question: "What is the result of 15 + (3 * 4)?",
        options: [
          { text: "72", isCorrect: false },
          { text: "27", isCorrect: true },
          { text: "32", isCorrect: false },
          { text: "19", isCorrect: false }
        ],
        marks: 5,
        required: true
      },
      {
        id: "mq2",
        type: "short_answer",
        question: "If a triangle has angles of 90 and 45 degrees, what is the third angle?",
        expectedAnswer: "45 degrees",
        marks: 5,
        required: true
      }
    ]
  }
];

const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: "lp-m1",
    name: "The Writer's Journey",
    description: "A gamified path to becoming a master communicator and creative writer.",
    moduleId: "m1",
    gradeIds: ["g4", "g5"],
    stars: 5,
    starLessons: ["l-m1-1", "l-m1-2", "l-m1-3", null, null],
    starsData: [
      { star: 1, mainLessonId: "l-m1-1", skillLessonIds: [] },
      { star: 2, mainLessonId: "l-m1-2", skillLessonIds: [] },
      { star: 3, mainLessonId: "l-m1-3", skillLessonIds: [] },
      { star: 4, mainLessonId: null, skillLessonIds: [] },
      { star: 5, mainLessonId: null, skillLessonIds: [] }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "lp-m2",
    name: "Math Explorer",
    description: "Embark on an adventure through the world of numbers and logic.",
    moduleId: "m2",
    gradeIds: ["g1", "g2", "g3"],
    stars: 5,
    starLessons: ["l-m2-1", "l-m2-2", "l-m2-3", null, null],
    starsData: [
      { star: 1, mainLessonId: "l-m2-1", skillLessonIds: [] },
      { star: 2, mainLessonId: "l-m2-2", skillLessonIds: [] },
      { star: 3, mainLessonId: "l-m2-3", skillLessonIds: [] },
      { star: 4, mainLessonId: null, skillLessonIds: [] },
      { star: 5, mainLessonId: null, skillLessonIds: [] }
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

  // Organization State
  const [orgData, setOrgData] = useState<Organization>({
    name: "Aquire Global Academy",
    logo: "https://picsum.photos/seed/aquire-logo/400/400",
    address: "123 Education Excellence Way, Knowledge City, 110001",
    email: "contact@aquireglobal.com",
    phone: "+91 98765 43210",
    updated: new Date().toISOString()
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isSavingOrg, setIsSavingOrg] = useState(false);

  // Teacher State
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "" });

  // Grade State
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [gradeForm, setGradeForm] = useState({ name: "", description: "", status: "active" as const });
  const [manageSchoolTab, setManageSchoolTab] = useState<'profile' | 'grades'>('profile');
  const [gradeSort, setGradeSort] = useState<{ field: 'name' | 'status', direction: 'asc' | 'desc' }>({ field: 'name', direction: 'asc' });

  useEffect(() => {
    const savedOrg = localStorage.getItem("aquire_organization");
    if (savedOrg) {
      setOrgData(JSON.parse(savedOrg));
    }

    const savedTeachers = localStorage.getItem("aquire_teachers");
    if (savedTeachers) {
      setTeachers(JSON.parse(savedTeachers));
    } else {
      // Seed Data
      const seedTeachers: Teacher[] = [
        { id: "t1", name: "Dr. Elizabeth Smith", email: "elizabeth.smith@aquireglobal.com", status: 'active', joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=elizabeth" },
        { id: "t2", name: "Prof. Robert Johnson", email: "robert.johnson@aquireglobal.com", status: 'active', joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=robert" },
        { id: "t3", name: "Ms. Sophia Williams", email: "sophia.williams@aquireglobal.com", status: 'active', joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=sophia" },
      ];
      setTeachers(seedTeachers);
      localStorage.setItem("aquire_teachers", JSON.stringify(seedTeachers));
    }

    const savedInvitations = localStorage.getItem("aquire_invitations");
    if (savedInvitations) {
      setInvitations(JSON.parse(savedInvitations));
    }

    const savedGrades = localStorage.getItem("aquire_grades");
    if (savedGrades) {
      setGrades(JSON.parse(savedGrades));
    } else {
      setGrades(INITIAL_GRADES);
      localStorage.setItem("aquire_grades", JSON.stringify(INITIAL_GRADES));
    }
  }, []);

  const saveTeachers = (updated: Teacher[]) => {
    setTeachers(updated);
    localStorage.setItem("aquire_teachers", JSON.stringify(updated));
  };

  const saveInvitations = (updated: Invitation[]) => {
    setInvitations(updated);
    localStorage.setItem("aquire_invitations", JSON.stringify(updated));
  };

  const saveGrades = (updated: Grade[]) => {
    setGrades(updated);
    localStorage.setItem("aquire_grades", JSON.stringify(updated));
  };

  const handleSaveGrade = () => {
    if (!gradeForm.name) {
      showToast("Grade name is required", "error");
      return;
    }

    // Check uniqueness
    const isDuplicate = grades.some(g => 
      g.name.toLowerCase() === gradeForm.name.toLowerCase() && 
      (!editingGrade || g.id !== editingGrade.id)
    );

    if (isDuplicate) {
      showToast("Grade name must be unique", "error");
      return;
    }

    if (editingGrade) {
      const updated = grades.map(g => g.id === editingGrade.id ? { ...g, ...gradeForm } : g);
      saveGrades(updated);
      showToast("Grade updated successfully", "success");
    } else {
      const newGrade: Grade = {
        id: uuidv4(),
        ...gradeForm,
        created: new Date().toISOString()
      };
      saveGrades([newGrade, ...grades]);
      showToast("Grade added successfully", "success");
    }

    setIsGradeModalOpen(false);
    setEditingGrade(null);
    setGradeForm({ name: "", description: "", status: "active" });
  };

  const deleteGrade = (id: string) => {
    const updated = grades.filter(g => g.id !== id);
    saveGrades(updated);
    showToast("Grade removed successfully", "success");
  };

  const toggleGradeStatus = (id: string) => {
    const updated = grades.map(g => g.id === id ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g);
    saveGrades(updated);
    showToast("Status updated", "success");
  };

  const handleSendInvitation = () => {
    if (!teacherForm.name || !teacherForm.email) {
      showToast("Please fill all fields", "error");
      return;
    }

    // Check if email already exists
    if (teachers.some(t => t.email === teacherForm.email)) {
      showToast("Teacher with this email already exists", "error");
      return;
    }

    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    const newInvitation: Invitation = {
      token,
      email: teacherForm.email,
      name: teacherForm.name,
      expires: expires.toISOString(),
      used: false
    };

    const newTeacher: Teacher = {
      id: uuidv4(),
      name: teacherForm.name,
      email: teacherForm.email,
      status: 'pending',
      joined: new Date().toISOString(),
      invitation_token: token,
      token_expires: expires.toISOString()
    };

    saveInvitations([...invitations, newInvitation]);
    saveTeachers([...teachers, newTeacher]);

    // Simulate Email
    const inviteLink = `${window.location.origin}${window.location.pathname}?token=${token}`;
    console.log(`
      Subject: Aquire Academy - Teacher Invitation
      ---
      Hi ${teacherForm.name},

      Welcome to Aquire Academy! 

      Signup: ${inviteLink}
      Expires: ${expires.toLocaleString()}
      ---
    `);

    // Copy to clipboard for easy testing
    navigator.clipboard.writeText(inviteLink);
    showToast("Invitation sent! Link copied to clipboard.", "success");
    
    setTeacherForm({ name: "", email: "" });
    setIsTeacherModalOpen(false);
  };

  const handleImpersonate = (teacher: Teacher) => {
    document.dispatchEvent(new CustomEvent('impersonate-teacher', { detail: teacher }));
  };

  const toggleTeacherStatus = (teacherId: string) => {
    const updated = teachers.map(t => {
      if (t.id === teacherId) {
        return { ...t, status: t.status === 'active' ? 'inactive' : 'active' };
      }
      return t;
    });
    saveTeachers(updated);
    showToast("Teacher status updated", "success");
  };

  const deleteTeacher = (teacherId: string) => {
    const updated = teachers.filter(t => t.id !== teacherId);
    saveTeachers(updated);
    showToast("Teacher deleted", "success");
  };

  useEffect(() => {
    const savedOrg = localStorage.getItem("aquire_organization");
    if (savedOrg) {
      setOrgData(JSON.parse(savedOrg));
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Logo size must be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrgData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const handleSaveOrganization = async () => {
    setIsSavingOrg(true);
    try {
      // Handle password change if provided
      if (passwordForm.current || passwordForm.new || passwordForm.confirm) {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
          showToast("Please fill all password fields", "error");
          setIsSavingOrg(false);
          return;
        }

        const savedHash = localStorage.getItem("aquire_admin_password_hash") || CryptoJS.SHA256("Admin@123").toString();
        const currentHash = CryptoJS.SHA256(passwordForm.current).toString();

        if (currentHash !== savedHash) {
          showToast("Current password is incorrect", "error");
          setIsSavingOrg(false);
          return;
        }

        if (passwordForm.new !== passwordForm.confirm) {
          showToast("New passwords do not match", "error");
          setIsSavingOrg(false);
          return;
        }

        const strength = calculatePasswordStrength(passwordForm.new);
        if (strength < 100) {
          showToast("Password must be 8+ chars, with upper, number, and special char", "error");
          setIsSavingOrg(false);
          return;
        }

        const newHash = CryptoJS.SHA256(passwordForm.new).toString();
        localStorage.setItem("aquire_admin_password_hash", newHash);
      }

      const updatedOrg = { ...orgData, updated: new Date().toISOString() };
      localStorage.setItem("aquire_organization", JSON.stringify(updatedOrg));
      setOrgData(updatedOrg);
      
      // Trigger update in other components
      document.dispatchEvent(new CustomEvent('organization-updated'));
      
      showToast("Organization profile updated successfully", "success");
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error) {
      showToast("Failed to update organization", "error");
    } finally {
      setIsSavingOrg(false);
    }
  };

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
    const SEED_VERSION = "v2_comprehensive";
    try {
      const savedVersion = localStorage.getItem("aquire_seed_version");
      if (savedVersion === SEED_VERSION && savedModules && savedLessons && savedBanks) {
        needsUpdate = false;
      }
    } catch (e) {
      needsUpdate = true;
    }

    if (needsUpdate) {
      setModules(INITIAL_MODULES);
      setLessons(INITIAL_LESSONS);
      setLearningPaths(INITIAL_LEARNING_PATHS);
      setQuestionBanks(INITIAL_QUESTION_BANKS);
      setGrades(INITIAL_GRADES);
      
      const seedTeachers: Teacher[] = [
        { id: "t1", name: "Dr. Elizabeth Smith", email: "elizabeth.smith@aquireglobal.com", status: 'active', joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=elizabeth" },
        { id: "t2", name: "Prof. Robert Johnson", email: "robert.johnson@aquireglobal.com", status: 'active', joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=robert" },
        { id: "t3", name: "Ms. Sophia Williams", email: "sophia.williams@aquireglobal.com", status: 'active', joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=sophia" },
      ];
      setTeachers(seedTeachers);
      
      const defaultOrg = {
        name: "Aquire Global Academy",
        logo: "https://picsum.photos/seed/aquire-logo/400/400",
        address: "123 Education Excellence Way, Knowledge City, 110001",
        email: "contact@aquireglobal.com",
        phone: "+91 98765 43210",
        updated: new Date().toISOString()
      };
      setOrgData(defaultOrg);

      localStorage.setItem("aquire_modules", JSON.stringify(INITIAL_MODULES));
      localStorage.setItem("aquire_lessons", JSON.stringify(INITIAL_LESSONS));
      localStorage.setItem("aquire_learning_paths", JSON.stringify(INITIAL_LEARNING_PATHS));
      localStorage.setItem("aquire_question_banks", JSON.stringify(INITIAL_QUESTION_BANKS));
      localStorage.setItem("aquire_grades", JSON.stringify(INITIAL_GRADES));
      localStorage.setItem("aquire_teachers", JSON.stringify(seedTeachers));
      localStorage.setItem("aquire_organization", JSON.stringify(defaultOrg));
      localStorage.setItem("aquire_seed_version", SEED_VERSION);
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
                <th className="px-6 py-4">Grades</th>
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
                        <div className="flex flex-wrap gap-1">
                          {mod.gradeIds?.map(gid => {
                            const g = grades.find(grade => grade.id === gid);
                            return g ? (
                              <span key={gid} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider">
                                {g.name}
                              </span>
                            ) : null;
                          })}
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
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-3 py-1 rounded-full bg-aquire-primary/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
                        {modules.find(m => m.id === lesson.moduleId)?.name || "Module"}
                      </span>
                      {lesson.gradeId && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                          <GraduationCap size={10} />
                          {grades.find(g => g.id === lesson.gradeId)?.name || "Grade"}
                        </span>
                      )}
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
                    <th className="px-6 py-4">Grade</th>
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
                          {lesson.gradeId && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider">
                              {grades.find(g => g.id === lesson.gradeId)?.name}
                            </span>
                          )}
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
                  <span className="w-1 h-1 rounded-full bg-aquire-grey-med" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {grades.find(g => g.id === lesson.gradeId)?.name || "Grade"}
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
                  <th className="px-6 py-4">Grades</th>
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
                        <div className="flex flex-wrap gap-1">
                          {path.gradeIds?.map(gid => {
                            const g = grades.find(grade => grade.id === gid);
                            return g ? (
                              <span key={gid} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider">
                                {g.name}
                              </span>
                            ) : null;
                          })}
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
                  <th className="px-6 py-4">Grades</th>
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
                        <div className="flex flex-wrap gap-1">
                          {bank.gradeIds?.map(gid => {
                            const g = grades.find(grade => grade.id === gid);
                            return g ? (
                              <span key={gid} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider">
                                {g.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {bank.gradeIds?.map(gid => {
                            const g = grades.find(grade => grade.id === gid);
                            return g ? (
                              <span key={gid} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider">
                                {g.name}
                              </span>
                            ) : null;
                          })}
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

  const renderSchoolProfile = () => {
    const strength = calculatePasswordStrength(passwordForm.new);
    const strengthColor = strength === 0 ? "bg-aquire-grey-light" : strength < 50 ? "bg-red-500" : strength < 100 ? "bg-amber-500" : "bg-emerald-500";

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-8 space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-aquire-border">
              <div className="w-10 h-10 bg-aquire-primary/10 rounded-xl flex items-center justify-center">
                <Building2 className="text-aquire-primary" size={20} />
              </div>
              <h3 className="text-xl font-bold text-aquire-black">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">School Name</label>
                <input 
                  type="text" 
                  value={orgData.name}
                  onChange={(e) => setOrgData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full"
                  placeholder="e.g. ABC International School"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Admin Email</label>
                <input 
                  type="email" 
                  value={orgData.email}
                  onChange={(e) => setOrgData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field w-full"
                  placeholder="admin@school.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Contact Number</label>
                <input 
                  type="text" 
                  value={orgData.phone}
                  onChange={(e) => setOrgData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field w-full"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">School Address</label>
                <textarea 
                  value={orgData.address}
                  onChange={(e) => setOrgData(prev => ({ ...prev, address: e.target.value }))}
                  className="input-field w-full min-h-[100px] py-3"
                  placeholder="Full postal address..."
                />
              </div>
            </div>

            <div className="pt-6 border-t border-aquire-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="text-amber-500" size={20} />
                </div>
                <h3 className="text-xl font-bold text-aquire-black">Security Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Current Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={16} />
                    <input 
                      type="password" 
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                      className="input-field w-full pl-12"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={16} />
                    <input 
                      type="password" 
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                      className="input-field w-full pl-12"
                      placeholder="••••••••"
                    />
                  </div>
                  {passwordForm.new && (
                    <div className="space-y-1.5 mt-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-aquire-grey-med">Strength</span>
                        <span className={strength === 100 ? "text-emerald-500" : "text-amber-500"}>
                          {strength === 0 ? "None" : strength < 50 ? "Weak" : strength < 100 ? "Good" : "Strong"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-aquire-grey-light rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${strength}%` }}
                          className={`h-full ${strengthColor} transition-all duration-500`}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Confirm Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={16} />
                    <input 
                      type="password" 
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                      className="input-field w-full pl-12"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo & Branding */}
        <div className="space-y-6">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-aquire-border">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Sparkles className="text-purple-500" size={20} />
              </div>
              <h3 className="text-xl font-bold text-aquire-black">Branding</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">School Logo</label>
                <div className="flex flex-col items-center gap-6 p-8 bg-aquire-grey-light/50 rounded-3xl border-2 border-dashed border-aquire-border">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-aquire-border overflow-hidden group relative">
                    {orgData.logo ? (
                      <img src={orgData.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                    ) : (
                      <Building2 className="text-aquire-grey-med w-12 h-12" />
                    )}
                    <div className="absolute inset-0 bg-aquire-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-2 bg-white rounded-lg text-aquire-black">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="text-aquire-primary font-bold hover:underline mb-1">Upload new logo</button>
                    <p className="text-[10px] text-aquire-grey-med uppercase tracking-widest">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Logo URL (Optional)</label>
                <input 
                  type="text" 
                  value={orgData.logo}
                  onChange={(e) => setOrgData(prev => ({ ...prev, logo: e.target.value }))}
                  className="input-field w-full"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>

          <div className="card p-8 bg-aquire-black text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-aquire-primary/20 blur-3xl rounded-full" />
            <h4 className="text-lg font-bold mb-2 relative z-10">Need Help?</h4>
            <p className="text-white/60 text-sm mb-6 relative z-10">Contact our support team if you need assistance with your school settings.</p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold transition-all relative z-10">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGrades = () => {
    const filteredGrades = grades.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      if (gradeSort.field === 'name') {
        return gradeSort.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        return gradeSort.direction === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
      }
    });

    const paginatedGrades = filteredGrades.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalGradePages = Math.ceil(filteredGrades.length / itemsPerPage);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grades by name or description..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setGradeSort(prev => ({ field: 'name', direction: prev.field === 'name' && prev.direction === 'asc' ? 'desc' : 'asc' }))}
              className={`px-4 py-3 rounded-xl border font-bold text-sm flex items-center gap-2 transition-all ${gradeSort.field === 'name' ? 'bg-aquire-primary/10 border-aquire-primary text-aquire-primary' : 'bg-white border-aquire-border text-aquire-grey-med'}`}
            >
              Name {gradeSort.field === 'name' && (gradeSort.direction === 'asc' ? '▲' : '▼')}
            </button>
            <button 
              onClick={() => setGradeSort(prev => ({ field: 'status', direction: prev.field === 'status' && prev.direction === 'asc' ? 'desc' : 'asc' }))}
              className={`px-4 py-3 rounded-xl border font-bold text-sm flex items-center gap-2 transition-all ${gradeSort.field === 'status' ? 'bg-aquire-primary/10 border-aquire-primary text-aquire-primary' : 'bg-white border-aquire-border text-aquire-grey-med'}`}
            >
              Status {gradeSort.field === 'status' && (gradeSort.direction === 'asc' ? '▲' : '▼')}
            </button>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-aquire-grey-light/50 border-b border-aquire-border">
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Grade Name</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aquire-border">
                {paginatedGrades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-aquire-grey-light/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-aquire-black">{grade.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-aquire-grey-med">
                      {grade.description || "No description"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        grade.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {grade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingGrade(grade);
                            setGradeForm({ name: grade.name, description: grade.description, status: grade.status });
                            setIsGradeModalOpen(true);
                          }}
                          className="p-2 hover:bg-aquire-primary/10 text-aquire-primary rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => toggleGradeStatus(grade.id)}
                          className={`p-2 rounded-lg transition-all ${
                            grade.status === 'active' ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'
                          }`}
                          title={grade.status === 'active' ? "Deactivate" : "Activate"}
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setItemToDelete({ id: grade.id, type: 'grade', name: grade.name });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredGrades.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-aquire-grey-med">
                      No grades found. Add your first grade to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalGradePages > 1 && (
          <div className="mt-8 pt-8 border-t border-aquire-border flex items-center justify-between">
            <p className="text-aquire-grey-med text-xs font-bold uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredGrades.length)} of {filteredGrades.length}
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
                {Array.from({ length: totalGradePages }, (_, i) => i + 1).map(page => (
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
                disabled={currentPage === totalGradePages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Grade Modal */}
        <AnimatePresence>
          {isGradeModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsGradeModalOpen(false)}
                className="absolute inset-0 bg-aquire-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative z-10"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-aquire-black">
                        {editingGrade ? 'Edit Grade' : 'Add New Grade'}
                      </h3>
                      <p className="text-aquire-grey-med text-sm">
                        {editingGrade ? 'Update grade details.' : 'Create a new academic grade.'}
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsGradeModalOpen(false)}
                      className="p-2 hover:bg-aquire-grey-light rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Grade Name</label>
                      <input 
                        type="text" 
                        value={gradeForm.name}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field w-full"
                        placeholder="e.g. Grade 5 or Class 10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Description</label>
                      <textarea 
                        value={gradeForm.description}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, description: e.target.value }))}
                        className="input-field w-full min-h-[100px] py-3"
                        placeholder="e.g. Primary level students..."
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button 
                      onClick={() => setIsGradeModalOpen(false)}
                      className="flex-1 py-4 px-6 border border-aquire-border rounded-2xl font-bold text-aquire-grey-med hover:bg-aquire-grey-light transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveGrade}
                      className="flex-1 py-4 px-6 bg-aquire-primary text-white rounded-2xl font-bold shadow-lg shadow-aquire-primary/20 hover:bg-aquire-primary-hover transition-all"
                    >
                      {editingGrade ? 'Update Grade' : 'Add Grade'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderOrganization = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Organization</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Manage School</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">
              {manageSchoolTab === 'profile' ? 'School Profile' : 'Grade Management'}
            </h2>
            <p className="text-aquire-grey-med">
              {manageSchoolTab === 'profile' 
                ? "Manage your school's branding, contact information, and security settings."
                : "Define and manage academic grades and classes for your institution."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {manageSchoolTab === 'profile' ? (
              <>
                <button 
                  onClick={() => {
                    const defaultOrg = {
                      name: "Aquire Academy",
                      logo: "",
                      address: "Delhi, India",
                      email: "admin@gmail.com",
                      phone: "+91-XXXXXXXXXX",
                      updated: new Date().toISOString()
                    };
                    setOrgData(defaultOrg);
                    localStorage.setItem("aquire_organization", JSON.stringify(defaultOrg));
                    document.dispatchEvent(new CustomEvent('organization-updated'));
                    showToast("Reset to default branding", "success");
                  }}
                  className="px-6 py-3 border border-aquire-border rounded-xl text-aquire-grey-med font-bold hover:bg-aquire-grey-light transition-all flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Reset to Default
                </button>
                <button 
                  onClick={handleSaveOrganization}
                  disabled={isSavingOrg}
                  className="btn-primary min-w-[160px]"
                >
                  {isSavingOrg ? <Loader2 size={20} className="animate-spin" /> : <><Plus size={20} /> Save Profile</>}
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  setEditingGrade(null);
                  setGradeForm({ name: "", description: "", status: "active" });
                  setIsGradeModalOpen(true);
                }}
                className="btn-primary"
              >
                <Plus size={20} />
                Add Grade
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-aquire-border w-fit">
          <button
            onClick={() => setManageSchoolTab('profile')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${manageSchoolTab === 'profile' ? 'bg-white text-aquire-primary shadow-sm' : 'text-aquire-grey-med hover:text-aquire-black'}`}
          >
            School Profile
          </button>
          <button
            onClick={() => setManageSchoolTab('grades')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${manageSchoolTab === 'grades' ? 'bg-white text-aquire-primary shadow-sm' : 'text-aquire-grey-med hover:text-aquire-black'}`}
          >
            Grades
          </button>
        </div>

        {manageSchoolTab === 'profile' ? renderSchoolProfile() : renderGrades()}
      </motion.div>
    );
  };

  const renderTeachers = () => {
    const filteredTeachers = teachers.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Organization</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Teachers</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">Teacher Management</h2>
            <p className="text-aquire-grey-med">Invite and manage your teaching staff.</p>
          </div>
          <button 
            onClick={() => setIsTeacherModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={20} />
            Add Teacher
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teachers by name or email..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-aquire-grey-light/50 border-b border-aquire-border">
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Teacher</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aquire-border">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-aquire-grey-light/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-aquire-primary/10 flex items-center justify-center border border-aquire-primary/20 overflow-hidden">
                          {teacher.profile_pic ? (
                            <img src={teacher.profile_pic} alt={teacher.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-aquire-primary font-bold">{teacher.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-aquire-black">{teacher.name}</p>
                          <p className="text-xs text-aquire-grey-med">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        teacher.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                        teacher.status === 'inactive' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-aquire-grey-med">
                      {new Date(teacher.joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {teacher.status === 'active' && (
                          <button 
                            onClick={() => handleImpersonate(teacher)}
                            className="p-2 hover:bg-aquire-primary/10 text-aquire-primary rounded-lg transition-all"
                            title="Login As"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => toggleTeacherStatus(teacher.id)}
                          className={`p-2 rounded-lg transition-all ${
                            teacher.status === 'active' ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'
                          }`}
                          title={teacher.status === 'active' ? "Deactivate" : "Activate"}
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button 
                          onClick={() => deleteTeacher(teacher.id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTeachers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-aquire-grey-med">
                      No teachers found. Invite your first teacher to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Teacher Modal */}
        <AnimatePresence>
          {isTeacherModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsTeacherModalOpen(false)}
                className="absolute inset-0 bg-aquire-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative z-10"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-aquire-black">Invite Teacher</h3>
                      <p className="text-aquire-grey-med text-sm">Send an invitation to join Aquire Academy.</p>
                    </div>
                    <button 
                      onClick={() => setIsTeacherModalOpen(false)}
                      className="p-2 hover:bg-aquire-grey-light rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" 
                        value={teacherForm.name}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field w-full"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        value={teacherForm.email}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                        className="input-field w-full"
                        placeholder="john@school.com"
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button 
                      onClick={() => setIsTeacherModalOpen(false)}
                      className="flex-1 py-4 px-6 border border-aquire-border rounded-2xl font-bold text-aquire-grey-med hover:bg-aquire-grey-light transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSendInvitation}
                      className="flex-1 py-4 px-6 bg-aquire-primary text-white rounded-2xl font-bold shadow-lg shadow-aquire-primary/20 hover:bg-aquire-primary-hover transition-all"
                    >
                      Send Invitation
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
      {activeTab === "manage-school" && renderOrganization()}
      {activeTab === "teachers" && renderTeachers()}
      {activeTab !== "dashboard" && activeTab !== "modules" && activeTab !== "lessons" && activeTab !== "skills" && activeTab !== "learning-paths" && activeTab !== "assessments" && activeTab !== "manage-school" && activeTab !== "teachers" && renderPlaceholder()}

      {/* Modals */}
      <ModuleModal 
        isOpen={isModuleModalOpen}
        onClose={() => {
          setIsModuleModalOpen(false);
          setEditingModule(null);
        }}
        onSave={handleSaveModule}
        editingModule={editingModule}
        grades={grades}
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
        grades={grades}
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
        grades={grades}
      />

      <QuestionBankModal
        isOpen={isQuestionBankModalOpen}
        onClose={() => {
          setIsQuestionBankModalOpen(false);
          setEditingBank(null);
        }}
        onSave={handleSaveQuestionBank}
        editingBank={editingBank}
        availableGrades={grades}
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
        grades={grades}
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
