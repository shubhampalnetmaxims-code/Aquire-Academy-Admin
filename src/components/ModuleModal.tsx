import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, AlertCircle, Loader2 } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

import { Module } from "../types";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: Omit<Module, "id" | "createdAt">) => void;
  editingModule: Module | null;
}

export default function ModuleModal({ isOpen, onClose, onSave, editingModule }: ModuleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("Grade 2");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingModule) {
      setName(editingModule.name);
      setDescription(editingModule.description);
      setGrade(editingModule.grade || "Grade 2");
    } else {
      setName("");
      setDescription("");
      setGrade("Grade 2");
    }
    setErrors({});
  }, [editingModule, isOpen]);

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!name.trim()) newErrors.name = "Module name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    else if (description.length > 200) newErrors.description = "Description must be under 200 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSave({ name, description, grade });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
            className="relative w-full max-w-lg bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-aquire-border"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-aquire-grey-med hover:text-aquire-primary transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aquire-black mb-2">
                {editingModule ? "Edit Module" : "Add New Module"}
              </h2>
              <p className="text-aquire-grey-med">
                {editingModule ? "Update the module details below." : "Fill in the details to create a new academic module."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                  Module Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Advanced Mathematics"
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

              <div className="space-y-2">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                  Grade Level
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl input-field appearance-none bg-white"
                >
                  {["Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-sm font-bold text-aquire-grey-dark">
                    Description
                  </label>
                </div>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Briefly describe the module content..."
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
                      {editingModule ? "Update Module" : "Save Module"}
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
