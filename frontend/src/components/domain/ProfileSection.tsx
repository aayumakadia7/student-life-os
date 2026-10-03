import React from 'react'
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const ProfileSection: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
          Student Profile & Identity
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Verified academic profile, credentials, and semester standing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Digital Student ID Card */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-blue-100 dark:bg-blue-900/60 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                  alt={user?.name || 'Aayu Makadia'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 m-0">
                    {user?.name || 'Aayu Makadia'}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Verified Scholar
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {user?.course || 'Computer Science & Engineering'} • {user?.semester || 'Semester 5'}
                </p>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{user?.email || 'aayu@student.edu'}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">STUDENT ID</span>
              <p className="text-sm font-mono font-bold text-zinc-800 dark:text-zinc-200">STD-2026-8941</p>
            </div>
          </div>

          {/* Quick Academic Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Current CGPA</span>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">9.1 / 10</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Attendance</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">82%</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Credits Done</span>
              <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">84 / 120</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Enrolled Modules</span>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">6 Active</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Institute of Technology & Engineering</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Batch of 2024 - 2028</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: The Sidebar Quote Card matching the screenshot! */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-pink-50/50 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-zinc-900 border border-indigo-100 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>

            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed font-serif italic mt-2">
              "Small steps every day lead to big results."
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-indigo-100/80 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Daily Scholar Motivation</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Streak: 14 Days
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
