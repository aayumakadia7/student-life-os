import { apiClient, ApiResponse } from './api'
import { Recommendation } from '../types'

export interface DashboardData {
  overview: {
    todayTasksCount: number
    pendingAssignmentsCount: number
    todayClassesCount: number
    upcomingClassesCount: number
    overallAttendance: number
    monthlyExpenses: number
    studyHoursThisWeek: number
    taskCompletionRate: number
  }
  todayTasks: any[]
  upcomingTasks: any[]
  todayClasses: any[]
  upcomingClasses: any[]
  pendingAssignments: any[]
  upcomingExams: any[]
  attendanceSummary: any
  recentExpenses: any[]
  expenseSummary: any
  studySummary: any
  recommendation: Recommendation | null
}

export const dashboardService = {
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return apiClient<DashboardData>('/dashboard')
  },

  async getRecommendations(): Promise<ApiResponse<Recommendation | null>> {
    return apiClient<Recommendation | null>('/dashboard/recommendations')
  },
}
