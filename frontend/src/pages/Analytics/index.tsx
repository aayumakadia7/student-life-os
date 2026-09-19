import React from 'react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { BarChart3, TrendingUp, Clock, CheckCircle2, DollarSign } from 'lucide-react'

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444']

export const AnalyticsPage: React.FC = () => {
  const { tasks, assignments, attendance, expenses, studySessions } = useApp()

  // 1. Productivity Stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // 2. Study Hours by Day
  const studyByDate: Record<string, number> = {}
  studySessions.forEach((s) => {
    studyByDate[s.date] = (studyByDate[s.date] || 0) + s.durationMinutes / 60
  })
  const studyChartData = Object.entries(studyByDate).map(([date, hours]) => ({
    date: date.substring(5), // MM-DD
    hours: Number(hours.toFixed(1)),
  }))

  // 3. Attendance by Subject
  const attendanceChartData = attendance.map((a) => ({
    subject: a.subject.length > 10 ? a.subject.substring(0, 9) + '..' : a.subject,
    percentage: a.held > 0 ? Math.round((a.attended / a.held) * 100) : 100,
    target: a.targetPercentage,
  }))

  // 4. Expenses by Category
  const expenseCatMap: Record<string, number> = {}
  expenses.forEach((e) => {
    expenseCatMap[e.category] = (expenseCatMap[e.category] || 0) + e.amount
  })
  const expensePieData = Object.entries(expenseCatMap).map(([name, value]) => ({
    name,
    value,
  }))

  // 5. Total Study Time
  const totalStudyMinutes = studySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0)
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
          Academic Analytics & Productivity Insights
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Deep metrics on task execution, study velocity, attendance health, and semester spend
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Task Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${completedTasks} of ${totalTasks} tasks done`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          badgeText="Productivity"
          badgeVariant="success"
        />
        <StatCard
          title="Total Study Hours"
          value={`${totalStudyHours} hrs`}
          subtitle={`${studySessions.length} total sessions`}
          icon={<Clock className="w-5 h-5 text-indigo-500" />}
          badgeText="Dedication"
          badgeVariant="info"
        />
        <StatCard
          title="Assignments Submitted"
          value={assignments.filter((a) => a.status === 'submitted' || a.status === 'completed').length}
          subtitle={`Out of ${assignments.length} assignments`}
          icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
          badgeText="Coursework"
          badgeVariant="warning"
        />
        <StatCard
          title="Total Spending"
          value={`$${expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}`}
          subtitle={`${expenses.length} logged transactions`}
          icon={<DollarSign className="w-5 h-5 text-purple-500" />}
          badgeText="Budget"
          badgeVariant="info"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance by Subject */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Attendance by Subject vs Target (75%)
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Percentage of attended lectures across courses</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <XAxis dataKey="subject" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Attendance']}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '8px',
                    border: '1px solid #27272a',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="percentage" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Study Hours Trend */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Study Time History (Hours)
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Logged focus duration per session date</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studyChartData.length > 0 ? studyChartData : [{ date: 'Today', hours: 2 }]}>
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val} hrs`, 'Study Time']}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '8px',
                    border: '1px solid #27272a',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Category Breakdown */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Expense Categories Breakdown
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Total allocation of student expenses</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expensePieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Total']}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '8px',
                    border: '1px solid #27272a',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {expensePieData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Task Completion Proportions */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Task Status Breakdown
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Ratio of completed vs pending daily commitments</p>

          <div className="space-y-4 pt-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Completed Tasks</span>
                <span className="text-emerald-500">{completedTasks}</span>
              </div>
              <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>In Progress / Todo Tasks</span>
                <span className="text-indigo-500">{totalTasks - completedTasks}</span>
              </div>
              <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks > 0 ? ((totalTasks - completedTasks) / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
