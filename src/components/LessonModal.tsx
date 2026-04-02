import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, AlertCircle, Loader2, Upload, Image as ImageIcon, ChevronDown } from "lucide-react";
import { Module } from "./ModuleModal";
import RichTextEditor from "./RichTextEditor";

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

export interface Lesson {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  thumbnail: string;
  chapters: Chapter[];
  createdAt: string;
}

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Omit<Lesson, "id" | "chapters" | "createdAt">) => void;
  editingLesson: Lesson | null;
  modules: Module[];
}

const SAMPLE_THUMBNAILS = [
  "https://picsum.photos/seed/edu1/400/300",
  "https://picsum.photos/seed/edu2/400/300",
  "https://picsum.photos/seed/edu3/400/300",
  "https://picsum.photos/seed/edu4/400/300",
  "https://picsum.photos/seed/edu5/400/300",
];

export default function LessonModal({ isOpen, onClose, onSave, editingLesson, modules }: LessonModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [thumbnail, setThumbnail] = useState(SAMPLE_THUMBNAILS[0]);
  const [errors, setErrors] = useState<{ name?: string; description?: string; moduleId?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingLesson) {
      setName(editingLesson.name);
      setDescription(editingLesson.description);
      setModuleId(editingLesson.moduleId);
      setThumbnail(editingLesson.thumbnail);
    } else {
      setName("");
      setDescription("");
      setModuleId(modules[0]?.id || "");
      setThumbnail(SAMPLE_THUMBNAILS[0]);
    }
    setErrors({});
  }, [editingLesson, isOpen, modules]);

  const validate = () => {
    const newErrors: { name?: string; description?: string; moduleId?: string } = {};
    if (!name.trim()) newErrors.name = "Lesson name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!moduleId) newErrors.moduleId = "Please select a module";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSave({ name, description, moduleId, thumbnail });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-aquire-border my-8"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-aquire-grey-med hover:text-aquire-primary transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aquire-black mb-2">
                {editingLesson ? "Edit Lesson" : "Add New Lesson"}
              </h2>
              <p className="text-aquire-grey-med">
                Configure your lesson details and link it to an academic module.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                      Link to Module
                    </label>
                    <div className="relative">
                      <select
                        value={moduleId}
                        onChange={(e) => setModuleId(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl input-field appearance-none cursor-pointer"
                      >
                        {modules.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4 pointer-events-none" />
                    </div>
                    {errors.moduleId && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle size={12} /> {errors.moduleId}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                      Lesson Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Introduction to Variables"
                      className={`w-full px-6 py-4 rounded-2xl input-field ${
                        errors.name ? "border-red-500 focus:ring-red-500/20" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                    Lesson Thumbnail
                  </label>
                  <div className="relative group aspect-video rounded-2xl overflow-hidden border border-aquire-border bg-aquire-grey-light">
                    <img 
                      src={thumbnail} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-aquire-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-aquire-grey-dark hover:text-aquire-primary transition-all shadow-lg"
                        title="Upload Custom Image"
                      >
                        <Upload size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setThumbnail(SAMPLE_THUMBNAILS[Math.floor(Math.random() * SAMPLE_THUMBNAILS.length)])}
                        className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-aquire-grey-dark hover:text-aquire-primary transition-all shadow-lg"
                        title="Random Sample"
                      >
                        <ImageIcon size={20} />
                      </button>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  <p className="text-[10px] text-aquire-grey-med text-center mt-2 uppercase tracking-widest font-bold">
                    Recommended: 16:9 Aspect Ratio
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                  Description
                </label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="What will students learn in this lesson?"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                    <AlertCircle size={12} /> {errors.description}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-[2] flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save size={20} />
                      {editingLesson ? "Update Lesson" : "Save Lesson"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
