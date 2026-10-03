import React, { useState } from 'react'
import {
  Sparkles,
  Calendar as CalendarIcon,
  GraduationCap,
  Percent,
  FileText,
  ChevronRight,
  Clock,
  Check,
  ArrowRight,
  Compass,
  BarChart2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  // Dynamic or simulated interactive state matching the screenshot
  const [taskCompleted, setTaskCompleted] = useState(false)
  const [todayTasksCount, setTodayTasksCount] = useState(5)
  const [pendingTasksCount, setPendingTasksCount] = useState(1)
  const [completedTasksCount, setCompletedTasksCount] = useState(0)

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleMarkCompleted = () => {
    if (!taskCompleted) {
      setTaskCompleted(true)
      setPendingTasksCount(0)
      setCompletedTasksCount(1)
      toast({
        title: 'Task Completed! 🎉',
        message: 'Design ER Diagram for Hospital Management marked as done.',
        type: 'success',
      })
    } else {
      setTaskCompleted(false)
      setPendingTasksCount(1)
      setCompletedTasksCount(0)
      toast({
        title: 'Task Reopened',
        message: 'Task status restored to pending.',
        type: 'info',
      })
    }
  }

  return (
    <div className="space-y-5 select-none">
      {/* ============================================================== */}
      {/* 1. HERO GREETING BANNER WITH PASTEL WAVES                      */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/50 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-zinc-900 border border-blue-100/70 dark:border-zinc-800 p-6 sm:p-7 shadow-xs">
        {/* Soft landscape hills / wave graphic on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-40 dark:opacity-20 hidden md:block">
          <svg viewBox="0 0 400 200" fill="none" className="w-full h-full object-cover">
            <path
              d="M0 200 C80 140 140 160 220 110 C290 65 340 90 400 40 L400 200 Z"
              fill="url(#waveGrad1)"
            />
            <path
              d="M60 200 C140 150 200 170 280 130 C340 95 370 110 400 75 L400 200 Z"
              fill="url(#waveGrad2)"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="waveGrad1" x1="200" y1="50" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#93C5FD" />
                <stop offset="1" stopColor="#818CF8" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="200" y1="80" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C4B5FD" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left Greeting & Date */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">👋</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
                Good Evening, {user?.name ? user.name.split(' ')[0].toLowerCase() : 'aayu'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
              Saturday, October 3, 2026 <span className="mx-1 font-bold">·</span> Welcome to your academic command center
            </p>
          </div>

          {/* Center Motivational Quote */}
          <div className="hidden xl:flex items-center gap-2 text-xs italic text-indigo-900/80 dark:text-indigo-300/90 font-serif">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 not-italic" />
            <span>"Discipline today builds the freedom of tomorrow."</span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => scrollToSection('tasks')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-700 shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors cursor-pointer"
            >
              Manage Tasks
            </button>
            <button
              onClick={() => scrollToSection('classes')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:scale-102 cursor-pointer"
            >
              <span>View Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ROW OF 4 STAT CARDS (EXACT MATCHING DESIGN)                 */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: TODAY'S TASKS */}
        <div
          onClick={() => scrollToSection('tasks')}
          className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-blue-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  TODAY'S TASKS
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
                    {todayTasksCount}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300">
                    {pendingTasksCount} pending
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-zinc-400 font-medium mt-3 pl-0.5">
            {completedTasksCount} completed
          </p>
        </div>

        {/* CARD 2: CLASSES TODAY */}
        <div
          onClick={() => scrollToSection('classes')}
          className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-emerald-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  CLASSES TODAY
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
                    0
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-300">
                    Free Day
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-zinc-400 font-medium mt-3 pl-0.5">
            No upcoming classes
          </p>
        </div>

        {/* CARD 3: ATTENDANCE */}
        <div
          onClick={() => scrollToSection('attendance')}
          className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-purple-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  ATTENDANCE
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
                    82%
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300">
                    Above Target
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-zinc-400 font-medium mt-3 pl-0.5">
            Target: 75%
          </p>
        </div>

        {/* CARD 4: ASSIGNMENTS */}
        <div
          onClick={() => scrollToSection('assignments')}
          className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-amber-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  ASSIGNMENTS
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
                    3
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300">
                    On Track
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-zinc-400 font-medium mt-3 pl-0.5">
            0 due soon
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. LOWER SECTION: TWO-CARD GRID (MATCHING 1:1)                 */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT CARD: WHAT SHOULD I DO NOW? (SPANS 2 COLUMNS) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header: Title and Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>WHAT SHOULD I DO NOW?</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 dark:bg-rose-950/70 text-rose-500 border border-rose-200/80 dark:border-rose-900/60">
                  URGENT
                </span>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>90 min</span>
                </span>
              </div>
            </div>

            {/* Subject Tag & Main Task Title */}
            <div className="mt-3">
              <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                DATABASE SYSTEMS
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                Design ER Diagram for Hospital Management
              </h2>
            </div>

            {/* Section: WHY THIS TASK NOW? with Bullet Points & Illustration */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  WHY THIS TASK NOW?
                </p>
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Due today or overdue</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Urgent priority</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Estimated 90 min fix: in free window before next class</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Database Systems Test is in 4 days</span>
                  </li>
                </ul>
              </div>

              {/* 3D Isometric Checklist Clipboard & Analog Clock Illustration */}
              <div className="shrink-0 flex items-center justify-center p-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Soft Background Glow / Aura */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-100/70 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/20 blur-xl" />

                  {/* SVG Illustration matching screenshot */}
                  <svg viewBox="0 0 160 160" fill="none" className="w-full h-full relative z-10 drop-shadow-md">
                    {/* Background Soft Cloud */}
                    <path
                      d="M30 110 C20 100 20 80 35 70 C45 50 75 45 95 60 C110 50 135 60 135 80 C145 90 145 110 130 120 Z"
                      fill="#EEF2FF"
                      opacity="0.8"
                    />

                    {/* Clipboard Base */}
                    <rect x="42" y="32" width="68" height="92" rx="10" fill="#818CF8" />
                    <rect x="44" y="34" width="64" height="88" rx="8" fill="#6366F1" />

                    {/* Paper Sheet */}
                    <rect x="48" y="42" width="56" height="74" rx="5" fill="#FFFFFF" />

                    {/* Clipboard Top Clip */}
                    <rect x="62" y="26" width="28" height="12" rx="4" fill="#4338CA" />
                    <circle cx="76" cy="32" r="2.5" fill="#EEF2FF" />

                    {/* Checklist Lines & Checkmarks */}
                    <g stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M55 56 L58 59 L66 51" />
                      <line x1="72" y1="55" x2="94" y2="55" stroke="#CBD5E1" strokeWidth="2" />

                      <path d="M55 72 L58 75 L66 67" />
                      <line x1="72" y1="71" x2="94" y2="71" stroke="#CBD5E1" strokeWidth="2" />

                      <path d="M55 88 L58 91 L66 83" />
                      <line x1="72" y1="87" x2="94" y2="87" stroke="#CBD5E1" strokeWidth="2" />
                    </g>

                    {/* Analog Clock overlapping bottom right corner */}
                    <g transform="translate(90, 85)">
                      <circle cx="22" cy="22" r="21" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="3" />
                      <circle cx="22" cy="22" r="18" fill="#F8FAFC" />
                      {/* Clock ticks & Hands */}
                      <circle cx="22" cy="22" r="2" fill="#3B82F6" />
                      <line x1="22" y1="22" x2="22" y2="12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                      <line x1="22" y1="22" x2="30" y2="22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleMarkCompleted}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
                taskCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{taskCompleted ? 'Completed' : 'Mark Completed'}</span>
            </button>

            <button
              onClick={() => scrollToSection('tasks')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors cursor-pointer"
            >
              <span>View in Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT CARD: ATTENDANCE OVERVIEW (SPANS 1 COLUMN) */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            {/* Header: Title and Details Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 m-0">
                  Attendance Overview
                </h3>
              </div>
              <button
                onClick={() => scrollToSection('attendance')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Courses Progress Rows matching image */}
            <div className="mt-6 space-y-5">
              {/* Course 1: Date Structures */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                  <span>Date Structures</span>
                  <span className="text-zinc-600 dark:text-zinc-400 font-semibold">88%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    style={{ width: '88%' }}
                  />
                </div>
              </div>

              {/* Course 2: Database Systems */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                  <span>Database Systems</span>
                  <span className="text-zinc-600 dark:text-zinc-400 font-semibold">80%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    style={{ width: '80%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Summary & Button */}
          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>All courses tally (≥ 75%)</span>
            </div>

            <button
              onClick={() => scrollToSection('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
