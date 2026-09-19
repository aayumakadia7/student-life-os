import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { formatGreeting, getCurrentDayName } from '../../utils/date'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { RecommendationCard } from '../../components/domain/RecommendationCard'
import { TaskCard } from '../../components/domain/TaskCard'
import { ClassCard } from '../../components/domain/ClassCard'
import {
  CheckSquare,
  Calendar,
  UserCheck,
  FileText,
  DollarSign,
  GraduationCap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const {
    tasks,
    timetable,
    assignments,
    attendance,
    expenses,
    studySessions,
    studyTopics,
    recommendation,
    toggleTaskComplete,
    preferences,
  } = useApp()

  const { greeting, subtitle } = formatGreeting(user?.name.split(' ')[0] || 'Aayu')
  const todayName = getCurrentDayName()

  // 1. Task Metrics
  const todayTasks = tasks.filter((t) => t.status !== 'completed')
  const completedTasks = tasks.filter((t) => t.status === 'completed')

  // 2. Class Metrics
  const todayClasses = timetable
    .filter((c) => c.day === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()
  let nextClass = todayClasses.find((c) => {
    const [h, m] = c.startTime.split(':').map(Number)
    return h * 60 + m > nowMinutes
  })

  // 3. Attendance Overall
  const totalHeld = attendance.reduce((acc, curr) => acc + curr.held, 0)
  const totalAttended = attendance.reduce((acc, curr) => acc + curr.attended, 0)
  const overallAttendance = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 100
  const isAttendanceAbove = overallAttendance >= preferences.attendanceTarget

  // 4. Pending Assignments
  const pendingAssignments = assignments.filter((a) => a.status !== 'completed' && a.status !== 'submitted')
  const dueSoonAssignments = pendingAssignments.filter((a) => {
    const due = new Date(a.dueDate).getTime()
    const now = new Date().getTime()
    return due - now <= 2 * 86400000 && due - now >= 0
  })

  // 5. Monthly Expenses & Daily spending breakdown for chart
  const currentMonth = new Date().toISOString().substring(0, 7)
  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)

  // Chart data: spending last 5 entries
  const expenseChartData = expenses.slice(0, 5).reverse().map((e) => ({
    name: e.title.length > 12 ? e.title.substring(0, 10) + '..' : e.title,
    amount: e.amount,
  }))

  // 6. Study Metrics
  const totalStudyMinutes = studySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0)
  const studyHours = (totalStudyMinutes / 60).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {subtitle} • Welcome to your academic command center
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              window.location.href = '/tasks'
            }}
          >
            Manage Tasks
          </Button>
          <Button
            size="sm"
            onClick={() => {
              window.location.href = '/timetable'
            }}
          >
            View Timetable
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Today's Tasks"
          value={todayTasks.length}
          subtitle={`${completedTasks.length} completed`}
          icon={<CheckSquare className="w-4 h-4 text-indigo-500" />}
          badgeText={todayTasks.length === 0 ? 'All Done' : `${todayTasks.length} left`}
          badgeVariant={todayTasks.length === 0 ? 'success' : 'warning'}
        />
        <StatCard
          title="Classes Today"
          value={todayClasses.length}
          subtitle={nextClass ? `Next: ${nextClass.subject} at ${nextClass.startTime}` : 'No upcoming classes'}
          icon={<Calendar className="w-4 h-4 text-emerald-500" />}
          badgeText={todayClasses.length > 0 ? `${todayClasses.length} scheduled` : 'Free Day'}
          badgeVariant="info"
        />
        <StatCard
          title="Attendance"
          value={`${overallAttendance}%`}
          subtitle={`Target: ${preferences.attendanceTarget}%`}
          icon={<UserCheck className="w-4 h-4 text-sky-500" />}
          badgeText={isAttendanceAbove ? 'Above Target' : 'Below Target'}
          badgeVariant={isAttendanceAbove ? 'success' : 'danger'}
        />
        <StatCard
          title="Assignments"
          value={pendingAssignments.length}
          subtitle={`${dueSoonAssignments.length} due soon`}
          icon={<FileText className="w-4 h-4 text-amber-500" />}
          badgeText={dueSoonAssignments.length > 0 ? 'Urgent' : 'On Track'}
          badgeVariant={dueSoonAssignments.length > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Signature Feature: What Should I Do Now? */}
      <RecommendationCard
        recommendation={recommendation}
        onCompleteTask={(taskId) => toggleTaskComplete(taskId)}
      />

      {/* Main 2-Column Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Priority Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Today's Classes ({todayName})
                </h3>
              </div>
              <Link
                to="/timetable"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
              >
                Full Week
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {todayClasses.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">
                No classes scheduled for today. Great day to catch up on study or projects!
              </p>
            ) : (
              <div className="space-y-2.5">
                {todayClasses.map((item) => (
                  <ClassCard
                    key={item.id}
                    entry={item}
                    isNext={nextClass?.id === item.id}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Priority Tasks */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Priority Tasks
                </h3>
              </div>
              <Link
                to="/tasks"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
              >
                All Tasks ({tasks.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Attendance Summary, Spending, and Study Progress */}
        <div className="space-y-6">
          {/* Attendance Summary */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Attendance Overview
                </h3>
              </div>
              <Link
                to="/attendance"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Details
              </Link>
            </div>

            <div className="space-y-3 mt-2">
              {attendance.slice(0, 4).map((record) => {
                const pct = record.held > 0 ? Math.round((record.attended / record.held) * 100) : 100
                return (
                  <div key={record.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {record.subject}
                      </span>
                      <span className="font-bold text-zinc-600 dark:text-zinc-400">
                        {pct}%
                      </span>
                    </div>
                    <ProgressBar value={pct} target={record.targetPercentage} height="sm" />
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Expense Widget */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Monthly Expenses
                </h3>
              </div>
              <Link
                to="/expenses"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View
              </Link>
            </div>

            <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-3">
              ${monthlyTotal.toFixed(2)}
            </p>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseChartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderRadius: '8px',
                      border: '1px solid #27272a',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Study Progress Snippet */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Study Progress
                </h3>
              </div>
              <Link
                to="/study"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Planner
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>{studyHours} logged study hours this semester</span>
            </div>

            <div className="space-y-2.5">
              {studyTopics.slice(0, 3).map((topic) => (
                <div key={topic.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {topic.topic}
                    </span>
                    <span className="font-bold text-indigo-500">{topic.progress}%</span>
                  </div>
                  <ProgressBar value={topic.progress} height="sm" variant="primary" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
