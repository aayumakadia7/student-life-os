import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AttendanceService } from '../attendance/attendance.service'
import { ExpensesService } from '../expenses/expenses.service'
import { StudyService } from '../study/study.service'

export interface RecommendationResponse {
  id: string
  taskId?: string
  title: string
  subject: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedMinutes: number
  reasons: string[]
  freeWindowMinutes?: number
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attendanceService: AttendanceService,
    private readonly expensesService: ExpensesService,
    private readonly studyService: StudyService
  ) {}

  private getDayName(date: Date = new Date()): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
  }

  async getDashboardData(userId: string) {
    const todayStr = new Date().toISOString().split('T')[0]
    const todayName = this.getDayName()
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()

    // Parallel fetch for speed
    const [
      allTasks,
      allClasses,
      pendingAssignments,
      upcomingExams,
      attendanceSummary,
      expenseSummary,
      recentExpenses,
      studySummary,
    ] = await Promise.all([
      this.prisma.task.findMany({
        where: { userId },
        orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.timetableEntry.findMany({
        where: { userId, day: todayName },
        orderBy: { startTime: 'asc' },
      }),
      this.prisma.assignment.findMany({
        where: {
          userId,
          status: { in: ['not_started', 'in_progress'] },
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
      }),
      this.prisma.exam.findMany({
        where: {
          userId,
          examDate: { gte: todayStr },
        },
        orderBy: { examDate: 'asc' },
        take: 3,
      }),
      this.attendanceService.getSummary(userId),
      this.expensesService.getSummary(userId),
      this.prisma.expense.findMany({
        where: { userId },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      }),
      this.studyService.getSummary(userId),
    ])

    // Partition tasks
    const todayTasks = allTasks.filter((t) => t.deadline === todayStr && t.status !== 'completed')
    const upcomingTasks = allTasks.filter((t) => t.deadline > todayStr && t.status !== 'completed')
    const completedTasks = allTasks.filter((t) => t.status === 'completed')

    // Upcoming classes today
    const upcomingClasses = allClasses.filter((c) => {
      const [h, m] = c.startTime.split(':').map(Number)
      return h * 60 + m > nowMinutes
    })

    const taskCompletionRate =
      allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0

    // Top recommended task
    const recommendation = await this.getRecommendations(userId)

    return {
      overview: {
        todayTasksCount: todayTasks.length,
        pendingAssignmentsCount: pendingAssignments.length,
        todayClassesCount: allClasses.length,
        upcomingClassesCount: upcomingClasses.length,
        overallAttendance: attendanceSummary.overallPercentage,
        monthlyExpenses: expenseSummary.monthlySpent,
        studyHoursThisWeek: studySummary.weeklyHours,
        taskCompletionRate,
      },
      todayTasks,
      upcomingTasks: upcomingTasks.slice(0, 5),
      todayClasses: allClasses,
      upcomingClasses,
      pendingAssignments,
      upcomingExams,
      attendanceSummary,
      recentExpenses,
      expenseSummary,
      studySummary,
      recommendation,
    }
  }

  async getRecommendations(userId: string): Promise<RecommendationResponse | null> {
    const [tasks, timetable, exams] = await Promise.all([
      this.prisma.task.findMany({
        where: { userId, status: { not: 'completed' } },
      }),
      this.prisma.timetableEntry.findMany({
        where: { userId },
      }),
      this.prisma.exam.findMany({
        where: { userId },
      }),
    ])

    if (tasks.length === 0) {
      return null
    }

    const now = new Date()
    const todayName = this.getDayName(now)
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const todayClasses = timetable
      .filter((entry) => entry.day === todayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    let nextClass: (typeof timetable)[number] | null = null
    let freeWindowMinutes = 120 // default window

    for (const c of todayClasses) {
      const [h, m] = c.startTime.split(':').map(Number)
      const classStartMin = h * 60 + m
      if (classStartMin > currentMinutes) {
        nextClass = c
        freeWindowMinutes = classStartMin - currentMinutes
        break
      }
    }

    const priorityScores: Record<string, number> = {
      urgent: 50,
      high: 35,
      medium: 20,
      low: 10,
    }

    const scored = tasks.map((task) => {
      let score = priorityScores[task.priority] || 15
      const reasons: string[] = []

      // Deadline proximity
      const taskDate = new Date(task.deadline)
      const diffDays = Math.ceil((taskDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays <= 0) {
        score += 60
        reasons.push('Due today or overdue')
      } else if (diffDays === 1) {
        score += 40
        reasons.push('Due tomorrow')
      } else if (diffDays <= 3) {
        score += 20
        reasons.push(`Due in ${diffDays} days`)
      }

      if (task.priority === 'urgent') {
        reasons.push('Urgent priority')
      } else if (task.priority === 'high') {
        reasons.push('High priority')
      }

      // Duration fit
      if (task.estimatedMinutes <= freeWindowMinutes) {
        score += 15
        reasons.push(`Estimated ${task.estimatedMinutes} min fits in free window before next class`)
      } else {
        reasons.push(`Estimated ${task.estimatedMinutes} minutes`)
      }

      // Exam proximity
      const relatedExam = exams.find(
        (e) =>
          e.subject.toLowerCase().includes(task.subject.toLowerCase()) ||
          task.subject.toLowerCase().includes(e.subject.toLowerCase())
      )
      if (relatedExam) {
        const examDate = new Date(relatedExam.examDate)
        const daysToExam = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        if (daysToExam > 0 && daysToExam <= 14) {
          score += 25
          reasons.push(`${relatedExam.subject} is in ${daysToExam} days`)
        }
      }

      if (nextClass) {
        reasons.push(`Next class (${nextClass.subject}) at ${nextClass.startTime}`)
      } else {
        reasons.push('No more classes scheduled today')
      }

      return {
        task,
        score,
        reasons,
      }
    })

    scored.sort((a, b) => b.score - a.score)
    const top = scored[0]

    return {
      id: `rec_${top.task.id}`,
      taskId: top.task.id,
      title: top.task.title,
      subject: top.task.subject,
      priority: top.task.priority as 'low' | 'medium' | 'high' | 'urgent',
      estimatedMinutes: top.task.estimatedMinutes,
      reasons: top.reasons.slice(0, 4),
      freeWindowMinutes,
    }
  }
}
