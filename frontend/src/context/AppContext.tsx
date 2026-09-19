import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Task,
  TimetableEntry,
  Assignment,
  AttendanceRecord,
  Expense,
  Exam,
  StudyTopic,
  StudySession,
  Resource,
  UserPreferences,
  Recommendation,
} from '../types'
import {
  initialTasks,
  initialTimetable,
  initialAssignments,
  initialAttendance,
  initialExpenses,
  initialExams,
  initialStudyTopics,
  initialStudySessions,
  initialResources,
  initialPreferences,
} from '../data/mockData'
import { storage } from '../utils/storage'
import { getNextRecommendedTask } from '../utils/recommendation'
import { useToast } from './ToastContext'

interface AppContextValue {
  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  toggleTaskComplete: (id: string) => void
  deleteTask: (id: string) => void

  // Timetable
  timetable: TimetableEntry[]
  addClass: (entry: Omit<TimetableEntry, 'id'>) => void
  updateClass: (id: string, updates: Partial<TimetableEntry>) => void
  deleteClass: (id: string) => void

  // Assignments
  assignments: Assignment[]
  addAssignment: (asg: Omit<Assignment, 'id'>) => void
  updateAssignment: (id: string, updates: Partial<Assignment>) => void
  deleteAssignment: (id: string) => void

  // Attendance
  attendance: AttendanceRecord[]
  markAttendance: (id: string, attended: boolean) => void
  updateAttendanceRecord: (id: string, updates: Partial<AttendanceRecord>) => void

  // Expenses
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
  deleteExpense: (id: string) => void

  // Study
  exams: Exam[]
  studyTopics: StudyTopic[]
  studySessions: StudySession[]
  addExam: (exam: Omit<Exam, 'id'>) => void
  deleteExam: (id: string) => void
  addStudySession: (session: Omit<StudySession, 'id'>) => void
  updateTopicProgress: (id: string, progress: number) => void

  // Resources
  resources: Resource[]
  addResource: (res: Omit<Resource, 'id'>) => void
  updateResource: (id: string, updates: Partial<Resource>) => void
  deleteResource: (id: string) => void

  // Settings & Theme
  preferences: UserPreferences
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  resetToInitialData: () => void

  // Recommendation
  recommendation: Recommendation | null
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const KEYS = {
  TASKS: 'student_os_tasks',
  TIMETABLE: 'student_os_timetable',
  ASSIGNMENTS: 'student_os_assignments',
  ATTENDANCE: 'student_os_attendance',
  EXPENSES: 'student_os_expenses',
  EXAMS: 'student_os_exams',
  STUDY_TOPICS: 'student_os_study_topics',
  STUDY_SESSIONS: 'student_os_study_sessions',
  RESOURCES: 'student_os_resources',
  PREFERENCES: 'student_os_preferences',
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast()

  const [tasks, setTasks] = useState<Task[]>(() => storage.get(KEYS.TASKS, initialTasks))
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => storage.get(KEYS.TIMETABLE, initialTimetable))
  const [assignments, setAssignments] = useState<Assignment[]>(() => storage.get(KEYS.ASSIGNMENTS, initialAssignments))
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => storage.get(KEYS.ATTENDANCE, initialAttendance))
  const [expenses, setExpenses] = useState<Expense[]>(() => storage.get(KEYS.EXPENSES, initialExpenses))
  const [exams, setExams] = useState<Exam[]>(() => storage.get(KEYS.EXAMS, initialExams))
  const [studyTopics, setStudyTopics] = useState<StudyTopic[]>(() => storage.get(KEYS.STUDY_TOPICS, initialStudyTopics))
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => storage.get(KEYS.STUDY_SESSIONS, initialStudySessions))
  const [resources, setResources] = useState<Resource[]>(() => storage.get(KEYS.RESOURCES, initialResources))
  const [preferences, setPreferences] = useState<UserPreferences>(() => storage.get(KEYS.PREFERENCES, initialPreferences))

  // Persist state updates to localStorage
  useEffect(() => storage.set(KEYS.TASKS, tasks), [tasks])
  useEffect(() => storage.set(KEYS.TIMETABLE, timetable), [timetable])
  useEffect(() => storage.set(KEYS.ASSIGNMENTS, assignments), [assignments])
  useEffect(() => storage.set(KEYS.ATTENDANCE, attendance), [attendance])
  useEffect(() => storage.set(KEYS.EXPENSES, expenses), [expenses])
  useEffect(() => storage.set(KEYS.EXAMS, exams), [exams])
  useEffect(() => storage.set(KEYS.STUDY_TOPICS, studyTopics), [studyTopics])
  useEffect(() => storage.set(KEYS.STUDY_SESSIONS, studySessions), [studySessions])
  useEffect(() => storage.set(KEYS.RESOURCES, resources), [resources])
  useEffect(() => storage.set(KEYS.PREFERENCES, preferences), [preferences])

  // Apply dark mode class to HTML root element
  useEffect(() => {
    const root = document.documentElement
    if (preferences.theme === 'dark') {
      root.classList.add('dark')
    } else if (preferences.theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }
  }, [preferences.theme])

  // Deterministic Recommendation
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  useEffect(() => {
    const rec = getNextRecommendedTask(tasks, timetable, exams)
    setRecommendation(rec)
  }, [tasks, timetable, exams])

  // --- Task Actions ---
  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const created: Task = {
      ...newTask,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [created, ...prev])
    toast({ title: 'Task Created', message: created.title, type: 'success' })
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    toast({ title: 'Task Updated', type: 'info' })
  }

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed'
          toast({
            title: nextStatus === 'completed' ? 'Task Completed! 🎉' : 'Task Reopened',
            message: t.title,
            type: nextStatus === 'completed' ? 'success' : 'info',
          })
          return { ...t, status: nextStatus }
        }
        return t
      })
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    toast({ title: 'Task Deleted', type: 'warning' })
  }

  // --- Timetable Actions ---
  const addClass = (entry: Omit<TimetableEntry, 'id'>) => {
    const created: TimetableEntry = { ...entry, id: `tt_${Date.now()}` }
    setTimetable((prev) => [...prev, created])
    toast({ title: 'Class Added', message: `${created.subject} (${created.day})`, type: 'success' })
  }

  const updateClass = (id: string, updates: Partial<TimetableEntry>) => {
    setTimetable((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
    toast({ title: 'Class Updated', type: 'info' })
  }

  const deleteClass = (id: string) => {
    setTimetable((prev) => prev.filter((e) => e.id !== id))
    toast({ title: 'Class Deleted', type: 'warning' })
  }

  // --- Assignment Actions ---
  const addAssignment = (asg: Omit<Assignment, 'id'>) => {
    const created: Assignment = { ...asg, id: `asg_${Date.now()}` }
    setAssignments((prev) => [created, ...prev])
    toast({ title: 'Assignment Added', message: created.title, type: 'success' })
  }

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
    toast({ title: 'Assignment Updated', type: 'info' })
  }

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    toast({ title: 'Assignment Removed', type: 'warning' })
  }

  // --- Attendance Actions ---
  const markAttendance = (id: string, attended: boolean) => {
    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          const updated = {
            ...rec,
            held: rec.held + 1,
            attended: attended ? rec.attended + 1 : rec.attended,
          }
          toast({
            title: attended ? 'Class Attended' : 'Class Missed',
            message: `${rec.subject}: ${Math.round((updated.attended / updated.held) * 100)}%`,
            type: attended ? 'success' : 'warning',
          })
          return updated
        }
        return rec
      })
    )
  }

  const updateAttendanceRecord = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendance((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    toast({ title: 'Attendance Record Updated', type: 'info' })
  }

  // --- Expense Actions ---
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const created: Expense = { ...expense, id: `exp_${Date.now()}` }
    setExpenses((prev) => [created, ...prev])
    toast({ title: 'Expense Logged', message: `${expense.title} - $${expense.amount.toFixed(2)}`, type: 'success' })
  }

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
    toast({ title: 'Expense Updated', type: 'info' })
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    toast({ title: 'Expense Deleted', type: 'warning' })
  }

  // --- Study Actions ---
  const addExam = (exam: Omit<Exam, 'id'>) => {
    const created: Exam = { ...exam, id: `exam_${Date.now()}` }
    setExams((prev) => [...prev, created])
    toast({ title: 'Exam Added', message: created.subject, type: 'success' })
  }

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id))
    toast({ title: 'Exam Removed', type: 'warning' })
  }

  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    const created: StudySession = { ...session, id: `sess_${Date.now()}` }
    setStudySessions((prev) => [created, ...prev])
    toast({ title: 'Study Session Logged', message: `${created.durationMinutes} minutes on ${created.subject}`, type: 'success' })
  }

  const updateTopicProgress = (id: string, progress: number) => {
    setStudyTopics((prev) => prev.map((t) => (t.id === id ? { ...t, progress: Math.min(100, Math.max(0, progress)) } : t)))
  }

  // --- Resource Actions ---
  const addResource = (res: Omit<Resource, 'id'>) => {
    const created: Resource = { ...res, id: `res_${Date.now()}` }
    setResources((prev) => [created, ...prev])
    toast({ title: 'Resource Added', message: created.title, type: 'success' })
  }

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    toast({ title: 'Resource Updated', type: 'info' })
  }

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id))
    toast({ title: 'Resource Removed', type: 'warning' })
  }

  // --- Preferences ---
  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }))
    toast({ title: 'Settings Saved', type: 'success' })
  }

  const resetToInitialData = () => {
    setTasks(initialTasks)
    setTimetable(initialTimetable)
    setAssignments(initialAssignments)
    setAttendance(initialAttendance)
    setExpenses(initialExpenses)
    setExams(initialExams)
    setStudyTopics(initialStudyTopics)
    setStudySessions(initialStudySessions)
    setResources(initialResources)
    setPreferences(initialPreferences)
    toast({ title: 'Data Reset', message: 'Sample student records restored.', type: 'info' })
  }

  return (
    <AppContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        timetable,
        addClass,
        updateClass,
        deleteClass,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        attendance,
        markAttendance,
        updateAttendanceRecord,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        exams,
        studyTopics,
        studySessions,
        addExam,
        deleteExam,
        addStudySession,
        updateTopicProgress,
        resources,
        addResource,
        updateResource,
        deleteResource,
        preferences,
        updatePreferences,
        resetToInitialData,
        recommendation,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
