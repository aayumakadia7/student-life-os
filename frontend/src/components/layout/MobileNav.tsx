import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, CheckSquare, CreditCard, Menu, Moon, Sun } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export interface TopNavbarProps {
  onMenuClick: () => void
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  const { preferences, updatePreferences } = useApp()
  const toggleTheme = () => {
    updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })
  }

  return (
    <header className="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 h-14 bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onMenuClick}
          className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Student Life OS
        </span>
      </div>

      <button
        onClick={toggleTheme}
        className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer"
        title="Toggle dark/light mode"
      >
        {preferences.theme === 'dark' ? (
          <Moon className="w-4 h-4 text-indigo-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </button>
    </header>
  )
}

export const MobileBottomNav: React.FC = () => {
  const items = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Schedule', to: '/timetable', icon: Calendar },
    { label: 'Tasks', to: '/tasks', icon: CheckSquare },
    { label: 'Expenses', to: '/expenses', icon: CreditCard },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around h-14 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md px-2">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
