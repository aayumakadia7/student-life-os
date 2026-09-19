import { Task, TimetableEntry, Exam, Recommendation } from '../types'
import { getCurrentDayName } from './date'

/**
 * Deterministic rule-based recommendation engine for "What Should I Do Now?"
 * Factors in:
 * 1. Task status (only uncompleted)
 * 2. Deadlines (today > tomorrow > later)
 * 3. Priority weight (urgent > high > medium > low)
 * 4. Free time window before the next class today
 * 5. Approaching exam dates
 */
export function getNextRecommendedTask(
  tasks: Task[],
  timetable: TimetableEntry[],
  exams: Exam[]
): Recommendation | null {
  const pendingTasks = tasks.filter((t) => t.status !== 'completed')
  if (pendingTasks.length === 0) {
    return null
  }

  const now = new Date()
  const todayName = getCurrentDayName()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  // Calculate upcoming classes today
  const todayClasses = timetable
    .filter((entry) => entry.day === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  let nextClass: TimetableEntry | null = null
  let freeWindowMinutes = 120 // default comfortable window

  for (const c of todayClasses) {
    const [h, m] = c.startTime.split(':').map(Number)
    const classStartMin = h * 60 + m
    if (classStartMin > currentMinutes) {
      nextClass = c
      freeWindowMinutes = classStartMin - currentMinutes
      break
    }
  }

  // Scoring function
  const priorityScores: Record<string, number> = {
    urgent: 50,
    high: 35,
    medium: 20,
    low: 10,
  }

  const scored = pendingTasks.map((task) => {
    let score = priorityScores[task.priority] || 15
    const reasons: string[] = []

    // Deadline scoring
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

    // Duration fit with free window
    if (task.estimatedMinutes <= freeWindowMinutes) {
      score += 15
      reasons.push(`Estimated ${task.estimatedMinutes} min fits in free window before next class`)
    } else {
      reasons.push(`Estimated ${task.estimatedMinutes} minutes`)
    }

    // Exam proximity check
    const relatedExam = exams.find(
      (e) => e.subject.toLowerCase().includes(task.subject.toLowerCase()) || task.subject.toLowerCase().includes(e.subject.toLowerCase())
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

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score)
  const top = scored[0]

  return {
    id: `rec_${top.task.id}`,
    taskId: top.task.id,
    title: top.task.title,
    subject: top.task.subject,
    priority: top.task.priority,
    estimatedMinutes: top.task.estimatedMinutes,
    reasons: top.reasons.slice(0, 4),
    freeWindowMinutes,
  }
}
