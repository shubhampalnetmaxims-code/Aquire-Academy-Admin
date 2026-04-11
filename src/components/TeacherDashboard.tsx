import React from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Trophy, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  LogOut, 
  LayoutDashboard,
  ArrowRight,
  GraduationCap,
  AlertTriangle,
  Layers
} from "lucide-react";
import { Teacher } from "../types";

interface TeacherDashboardProps {
  teacher: Teacher;
  isImpersonating: boolean;
  onLogout: () => void;
  showToast: (message: string, type: "success" | "error") => void;
  activeTab: string;
}

export default function TeacherDashboard({ teacher, isImpersonating, onLogout, showToast, activeTab }: TeacherDashboardProps) {
  const stats = [
    { label: "My Classes", value: "4", icon: <BookOpen className="text-blue-500" />, color: "bg-blue-50" },
    { label: "Students", value: "124", icon: <Users className="text-emerald-500" />, color: "bg-emerald-50" },
    { label: "Assignments", value: "28", icon: <ClipboardList className="text-amber-500" />, color: "bg-amber-50" },
    { label: "Avg. Progress", value: "72%", icon: <TrendingUp className="text-purple-500" />, color: "bg-purple-50" },
  ];

  const classes = [
    { name: "Narrative Writing", lessons: 12, progress: 65, color: "bg-blue-500" },
    { name: "Punctuation Mastery", lessons: 8, progress: 42, color: "bg-emerald-500" },
    { name: "Creative Editing", lessons: 10, progress: 88, color: "bg-amber-500" },
  ];

  const renderDashboard = () => (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-aquire-primary flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-aquire-primary/20 border-4 border-white overflow-hidden">
            {teacher.profile_pic ? (
              <img src={teacher.profile_pic} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              teacher.name.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-4xl font-black text-aquire-black tracking-tight">
              Welcome, {teacher.name.split(' ')[0]} 👋
            </h1>
            <p className="text-aquire-grey-med mt-1 font-medium">Teacher Dashboard • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        {!isImpersonating && (
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-aquire-border rounded-2xl text-aquire-grey-med font-bold hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-6 flex items-center gap-5 hover:scale-[1.02] transition-all cursor-default"
          >
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-aquire-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* My Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-aquire-black flex items-center gap-3">
              <BookOpen className="text-aquire-primary" />
              My Classes
            </h2>
            <button className="text-sm font-bold text-aquire-primary hover:underline">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="card p-6 group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 ${cls.color}/10 rounded-xl flex items-center justify-center`}>
                    <GraduationCap className={cls.color.replace('bg-', 'text-')} size={24} />
                  </div>
                  <span className="text-[10px] font-black text-aquire-grey-med uppercase tracking-widest bg-aquire-grey-light px-2 py-1 rounded-md">
                    {cls.lessons} Lessons
                  </span>
                </div>
                <h3 className="text-lg font-bold text-aquire-black mb-4 group-hover:text-aquire-primary transition-colors">
                  {cls.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-aquire-grey-med">Progress</span>
                    <span className="text-aquire-black">{cls.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-aquire-grey-light rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cls.color} transition-all duration-1000`}
                      style={{ width: `${cls.progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-aquire-black flex items-center gap-3">
            <Trophy className="text-amber-500" />
            Quick Actions
          </h2>
          <div className="space-y-4">
            {[
              { label: "View Learning Paths", icon: <LayoutDashboard size={18} /> },
              { label: "Grade Assignments", icon: <ClipboardList size={18} /> },
              { label: "Student Reports", icon: <Users size={18} /> },
              { label: "Class Announcements", icon: <AlertTriangle size={18} /> },
            ].map((action, idx) => (
              <button
                key={idx}
                className="w-full flex items-center justify-between p-5 bg-white border border-aquire-border rounded-2xl hover:border-aquire-primary hover:shadow-lg hover:shadow-aquire-primary/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-aquire-grey-light rounded-xl flex items-center justify-center text-aquire-grey-med group-hover:text-aquire-primary group-hover:bg-aquire-primary/10 transition-all">
                    {action.icon}
                  </div>
                  <span className="font-bold text-aquire-black">{action.label}</span>
                </div>
                <ArrowRight size={18} className="text-aquire-grey-med group-hover:text-aquire-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-aquire-black tracking-tight">Manage Modules</h2>
        <button className="btn-primary">
          <Layers size={20} />
          Create New Module
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, idx) => (
          <div key={idx} className="card p-6">
            <div className={`w-12 h-12 ${cls.color}/10 rounded-xl flex items-center justify-center mb-4`}>
              <Layers className={cls.color.replace('bg-', 'text-')} size={24} />
            </div>
            <h3 className="text-lg font-bold text-aquire-black mb-2">{cls.name}</h3>
            <p className="text-sm text-aquire-grey-med mb-6">Manage lessons and content for this module.</p>
            <div className="flex items-center justify-between pt-4 border-t border-aquire-border">
              <span className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">{cls.lessons} Lessons</span>
              <button className="text-aquire-primary font-bold text-sm hover:underline">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-aquire-black tracking-tight">Student List</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-aquire-grey-light border-b border-aquire-border">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-aquire-grey-med uppercase tracking-widest">Student</th>
              <th className="px-6 py-4 text-xs font-black text-aquire-grey-med uppercase tracking-widest">Grade</th>
              <th className="px-6 py-4 text-xs font-black text-aquire-grey-med uppercase tracking-widest">Progress</th>
              <th className="px-6 py-4 text-xs font-black text-aquire-grey-med uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aquire-border">
            {[
              { name: "Alice Johnson", grade: "Grade 8", progress: 85, status: "Active" },
              { name: "Bob Smith", grade: "Grade 7", progress: 42, status: "Active" },
              { name: "Charlie Brown", grade: "Grade 8", progress: 92, status: "Active" },
              { name: "Diana Prince", grade: "Grade 9", progress: 67, status: "Inactive" },
            ].map((student, idx) => (
              <tr key={idx} className="hover:bg-aquire-grey-light/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-aquire-primary/10 flex items-center justify-center text-aquire-primary font-bold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <span className="font-bold text-aquire-black">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-aquire-grey-med">{student.grade}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-aquire-grey-light rounded-full overflow-hidden">
                      <div className="h-full bg-aquire-primary" style={{ width: `${student.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-aquire-black">{student.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    student.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                  }`}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-3xl font-black text-aquire-black tracking-tight">Account Settings</h2>
      <div className="card p-8 space-y-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-aquire-primary flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden">
            {teacher.profile_pic ? (
              <img src={teacher.profile_pic} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              teacher.name.charAt(0)
            )}
          </div>
          <div>
            <button className="btn-primary px-4 py-2 text-sm">Change Photo</button>
            <p className="text-xs text-aquire-grey-med mt-2">JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">Full Name</label>
            <input type="text" defaultValue={teacher.name} className="input-field w-full" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">Email Address</label>
            <input type="email" defaultValue={teacher.email} className="input-field w-full" disabled />
          </div>
        </div>

        <div className="pt-8 border-t border-aquire-border space-y-6">
          <h3 className="text-xl font-bold text-aquire-black">Change Password</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">Current Password</label>
              <input type="password" placeholder="••••••••" className="input-field w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">New Password</label>
                <input type="password" placeholder="••••••••" className="input-field w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="input-field w-full" />
              </div>
            </div>
          </div>
        </div>

        <button className="btn-primary w-full md:w-auto">Save Changes</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-screen overflow-y-auto custom-scrollbar bg-aquire-grey-light">
      {isImpersonating && (
        <div className="bg-red-600 text-white py-3 px-6 flex items-center justify-between sticky top-0 z-[100] shadow-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="animate-pulse" />
            <span className="font-bold text-sm uppercase tracking-widest">Admin Impersonating: {teacher.name}</span>
          </div>
        </div>
      )}

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {activeTab === "dashboard" && renderDashboard()}
        {(activeTab === "modules" || activeTab === "lessons") && renderModules()}
        {(activeTab === "students" || activeTab === "progress" || activeTab === "assignments") && renderStudents()}
        {activeTab === "account" && renderAccount()}
      </div>
    </div>
  );
}
