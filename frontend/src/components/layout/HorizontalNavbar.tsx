import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CheckCircle2,
  BookMarked,
  Calendar,
  User,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Sparkles,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'

export interface NavSection {
  id: string
  label: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
}

// Exactly matching the 8 navigation components from the dashboard image
export const NAV_SECTIONS: NavSection[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'classes', label: 'My Classes', shortLabel: 'Classes', icon: BookOpen },
  { id: 'assignments', label: 'Assignments', shortLabel: 'Assignments', icon: FileText },
  { id: 'attendance', label: 'Attendance', shortLabel: 'Attendance', icon: CheckCircle2 },
  { id: 'resources', label: 'Study Resources', shortLabel: 'Resources', icon: BookMarked },
  { id: 'calendar', label: 'Calendar', shortLabel: 'Calendar', icon: Calendar },
  { id: 'profile', label: 'Profile', shortLabel: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
]

interface HorizontalNavbarProps {
  activeSection: string
  onSelectSection: (id: string) => void
}

export const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const { user, logout } = useAuth()
  const { preferences, updatePreferences } = useApp()
  const navigate = useNavigate()
  const navTrackRef = useRef<HTMLDivElement | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const toggleTheme = () => {
    updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })
  }

  // Auto-scroll active pill into view within horizontal navbar
  useEffect(() => {
    if (!navTrackRef.current) return
    const activeEl = navTrackRef.current.querySelector<HTMLButtonElement>(`[data-section-id="${activeSection}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [activeSection])

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Top Row: Brand, Search Bar, Notifications & Student Profile */}
        <div className="flex items-center justify-between h-16 border-b border-zinc-100 dark:border-zinc-900/60 gap-4">
          {/* Brand Logo & Subtitle */}
          <div
            onClick={() => onSelectSection('dashboard')}
            className="flex items-center gap-3 cursor-pointer shrink-0 select-none group"
          >
            {/* Blue Rounded Square with Document/Student Icon matching image */}
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" />
                <path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                Student Life OS
              </span>
              <span className="text-xs text-zinc-400 font-normal">Your academic companion</span>
            </div>
          </div>

          {/* Center: Search Bar matching image */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classes, assignments, or anything..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications, 3D Intro, Theme Toggle & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 3D Intro Replay Button */}
            <button
              onClick={() => navigate('/intro')}
              title="Launch 3D Scroll Intro"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 transition-all cursor-pointer shadow-xs hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-spin-slow" />
              <span className="hidden sm:inline">3D Intro</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${preferences.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
            >
              {preferences.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            {/* Notification Bell matching image */}
            <button
              title="Notifications"
              className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-zinc-950" />
            </button>

            {/* User Profile Pill matching image: Avatar, Aayu Makadia, Student, chevron down */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer select-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center font-bold text-xs text-blue-700 dark:text-blue-300 shadow-xs">
                  {user?.name ? (
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  <span>{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {user?.name || 'Aayu Makadia'}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">Student</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {user?.name || 'Aayu Makadia'}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">{user?.email || 'aayu@student.edu'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      onSelectSection('profile')
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      onSelectSection('settings')
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      logout()
                      navigate('/intro')
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Navbar Row: Centered Navigation Track with Optimal Capsule Sizing */}
        <div className="flex justify-center items-center py-2.5 w-full">
          <nav
            ref={navTrackRef}
            aria-label="Academic Modules Navigation"
            className="inline-flex items-center justify-start sm:justify-center gap-1 p-1.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800/80 shadow-xs max-w-full overflow-x-auto no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {NAV_SECTIONS.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  data-section-id={section.id}
                  onClick={() => onSelectSection(section.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 select-none ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.01]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'}`} />
                  <span>{section.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
