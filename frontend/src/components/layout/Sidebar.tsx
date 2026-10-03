import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  FileText,
  UserCheck,
  CreditCard,
  GraduationCap,
  FolderGit2,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  X,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const { preferences, updatePreferences } = useApp()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Timetable', to: '/timetable', icon: Calendar },
    { label: 'Tasks', to: '/tasks', icon: CheckSquare },
    { label: 'Assignments', to: '/assignments', icon: FileText },
    { label: 'Attendance', to: '/attendance', icon: UserCheck },
    { label: 'Expenses', to: '/expenses', icon: CreditCard },
    { label: 'Study Planner', to: '/study', icon: GraduationCap },
    { label: 'Resources', to: '/resources', icon: FolderGit2 },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Settings', to: '/settings', icon: Settings },
  ]

  const toggleTheme = () => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark'
    updatePreferences({ theme: nextTheme })
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800/80 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-indigo-500/30">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 m-0 leading-tight">
              Student Life OS
            </h1>
            <p className="text-[10px] text-zinc-400 font-medium m-0">v1.0 • College Pro</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>

      {/* Footer / User Profile & Controls */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
        {/* 3D Experience Tour Button */}
        <button
          onClick={() => {
            if (onClose) onClose()
            navigate('/intro')
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800/60 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500 animate-spin-slow" />
            <span>3D Intro Experience</span>
          </span>
          <span className="text-[10px] font-mono uppercase bg-purple-200/60 dark:bg-purple-800/60 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded">
            3D
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {preferences.theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            {preferences.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span className="text-[10px] uppercase font-bold text-zinc-400">Toggle</span>
        </button>

        {user && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-zinc-400 truncate">{user.semester}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout()
                navigate('/intro')
              }}
              title="Logout to 3D Intro"
              className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
