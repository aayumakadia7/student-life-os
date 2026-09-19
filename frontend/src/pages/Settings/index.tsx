import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { User, Bell, Sliders, Moon, Sun, RotateCcw } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const { preferences, updatePreferences, resetToInitialData } = useApp()

  // Profile Form
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [college, setCollege] = useState(user?.college || '')
  const [course, setCourse] = useState(user?.course || '')
  const [semester, setSemester] = useState(user?.semester || '')

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name, email, college, course, semester })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
          Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Customize student profile, target attendance goals, dark mode, and notifications
        </p>
      </div>

      {/* Profile Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <User className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Student Profile Information
            </h3>
            <p className="text-xs text-zinc-500">Academic identity and contact details</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="College Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="College / University"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            />
            <Input
              label="Major / Program"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
            <Input
              label="Current Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* System Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <Sliders className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              App Preferences
            </h3>
            <p className="text-xs text-zinc-500">Display, attendance criteria, and localization</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Interface Theme</p>
              <p className="text-xs text-zinc-500">Toggle between dark and light appearance</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updatePreferences({ theme: 'light' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  preferences.theme === 'light'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
              <button
                type="button"
                onClick={() => updatePreferences({ theme: 'dark' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  preferences.theme === 'dark'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
            </div>
          </div>

          {/* Attendance Target */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Minimum Attendance Target: {preferences.attendanceTarget}%
              </p>
              <p className="text-xs text-zinc-500">
                Your university threshold for exam eligibility (usually 75% or 80%)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={preferences.attendanceTarget}
                onChange={(e) => updatePreferences({ attendanceTarget: Number(e.target.value) })}
                className="w-36 accent-indigo-600 cursor-pointer"
              />
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 w-10 text-right">
                {preferences.attendanceTarget}%
              </span>
            </div>
          </div>

          {/* Currency */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Default Currency</p>
              <p className="text-xs text-zinc-500">Used for expense tracker entries</p>
            </div>
            <div className="w-32">
              <Select
                value={preferences.currency}
                onChange={(e) => updatePreferences({ currency: e.target.value })}
                options={[
                  { label: 'USD ($)', value: 'USD' },
                  { label: 'INR (₹)', value: 'INR' },
                  { label: 'EUR (€)', value: 'EUR' },
                  { label: 'GBP (£)', value: 'GBP' },
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <Bell className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Notification Preferences
            </h3>
            <p className="text-xs text-zinc-500">Manage proactive alerts and reminders</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Assignment Deadlines
              </p>
              <p className="text-xs text-zinc-500">Alert 24 hours and 3 days before submission</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.assignmentReminders}
              onChange={(e) =>
                updatePreferences({
                  notifications: {
                    ...preferences.notifications,
                    assignmentReminders: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Attendance Shortage Warning
              </p>
              <p className="text-xs text-zinc-500">Proactively notify when attendance drops below target</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.attendanceAlerts}
              onChange={(e) =>
                updatePreferences({
                  notifications: {
                    ...preferences.notifications,
                    attendanceAlerts: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Daily Task Reminders
              </p>
              <p className="text-xs text-zinc-500">Morning summary of priority tasks and classes</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.taskReminders}
              onChange={(e) =>
                updatePreferences({
                  notifications: {
                    ...preferences.notifications,
                    taskReminders: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone / Reset State */}
      <Card className="p-6 border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">
              Reset to Sample Data
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Restore clean initial demo student records (tasks, timetable, attendance, expenses)
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all records to initial student mock data?')) {
                resetToInitialData()
              }
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Data
          </Button>
        </div>
      </Card>
    </div>
  )
}
