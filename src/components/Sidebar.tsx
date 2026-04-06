import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Trophy, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  ChevronDown, 
  LogOut, 
  User,
  LayoutDashboard,
  Menu,
  X,
  Book
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  submenu?: { id: string; label: string; icon: React.ReactNode }[];
}

export default function Sidebar({ onLogout, activeTab, setActiveTab }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["academic"]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { 
      id: "academic", 
      label: "Academic", 
      icon: <GraduationCap size={20} />,
      submenu: [
        { id: "modules", label: "Modules", icon: <Layers size={18} /> },
        { id: "lessons", label: "Lessons", icon: <BookOpen size={18} /> },
        { id: "learning-paths", label: "Learning Paths", icon: <Book size={18} /> },
        { id: "skills", label: "Skill-Based Lessons", icon: <Trophy size={18} /> },
      ]
    },
    { 
      id: "content", 
      label: "Content", 
      icon: <FileText size={20} />,
      submenu: [
        { id: "videos", label: "Video Lectures", icon: <Video size={18} /> },
        { id: "logos", label: "Logo Options", icon: <ImageIcon size={18} /> },
      ]
    },
  ];

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-8 bg-aquire-black">
      {/* Logo Section */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-aquire-primary/20 rounded-xl flex items-center justify-center border border-aquire-primary/30">
          <GraduationCap className="text-aquire-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">
            Aquire <span className="text-aquire-primary">Admin</span>
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Academy Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <div key={item.id} className="space-y-1">
            <button
              onClick={() => item.submenu ? toggleMenu(item.id) : setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id || (item.submenu && item.submenu.some(s => s.id === activeTab))
                  ? "bg-aquire-primary text-white shadow-lg shadow-aquire-primary/20"
                  : "text-[#E2E8F0] hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${activeTab === item.id || (item.submenu && item.submenu.some(s => s.id === activeTab)) ? "text-white" : "group-hover:text-aquire-primary"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.submenu && (
                <motion.div
                  animate={{ rotate: expandedMenus.includes(item.id) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} className="opacity-50" />
                </motion.div>
              )}
            </button>

            <AnimatePresence>
              {item.submenu && expandedMenus.includes(item.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden pl-4 space-y-1"
                >
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveTab(sub.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                        activeTab === sub.id
                          ? "text-white bg-aquire-primary shadow-md shadow-aquire-primary/10 font-bold"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={`${activeTab === sub.id ? "text-white" : "opacity-70"}`}>{sub.icon}</span>
                      {sub.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="px-4 mt-auto pt-6 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-aquire-primary flex items-center justify-center text-white font-bold border-2 border-white/10">
            SP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Shubham Pal</p>
            <p className="text-[10px] text-white/40 truncate">Super Admin</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 font-bold text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-40 p-3 bg-aquire-black rounded-xl text-white shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 bg-aquire-black border-r border-white/5 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-aquire-black z-50 lg:hidden"
            >
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
