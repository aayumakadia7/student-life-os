export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'todo' | 'in_progress' | 'completed'

export interface Task {
  id: string
  title: string
  subject: string
  priority: Priority
  status: TaskStatus
  deadline: string // ISO date string or YYYY-MM-DD
  estimatedMinutes: number
  description?: string
  createdAt: string
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface TimetableEntry {
  id: string
  subject: string
  code?: string
  teacher: string
  room: string
  day: DayOfWeek
  startTime: string // "09:00"
  endTime: string   // "10:00"
  color?: string
}

export type AssignmentStatus = 'not_started' | 'in_progress' | 'submitted' | 'completed'

export interface Assignment {
  id: string
  title: string
  subject: string
  description: string
  dueDate: string
  priority: Priority
  status: AssignmentStatus
  estimatedHours: number
}

export interface AttendanceRecord {
  id: string
  subject: string
  code: string
  held: number
  attended: number
  targetPercentage: number // e.g. 75
}

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Education'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Other'

export interface Expense {
  id: string
  title: string
  amount: number
  category: ExpenseCategory
  date: string // YYYY-MM-DD
  notes?: string
}

export interface Exam {
  id: string
  subject: string
  examDate: string // YYYY-MM-DD
  time?: string
  room?: string
  syllabus: string
}

export interface StudyTopic {
  id: string
  subject: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  progress: number // 0 to 100
}

export interface StudySession {
  id: string
  subject: string
  topic: string
  date: string // YYYY-MM-DD
  durationMinutes: number
  completed: boolean
}

export type ResourceType = 'PDF' | 'Website' | 'YouTube' | 'GitHub' | 'Notes' | 'Other'

export interface Resource {
  id: string
  title: string
  subject: string
  type: ResourceType
  url: string
  description: string
  tags: string[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  college: string
  course: string
  semester: string
  avatarUrl?: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  attendanceTarget: number // default 75
  currency: string         // e.g. "USD", "INR", "EUR", "GBP"
  timeFormat: '12h' | '24h'
  notifications: {
    assignmentReminders: boolean
    taskReminders: boolean
    attendanceAlerts: boolean
    studyReminders: boolean
  }
}

export interface Recommendation {
  id: string
  taskId?: string
  title: string
  subject: string
  priority: Priority
  estimatedMinutes: number
  reasons: string[]
  freeWindowMinutes?: number
}
