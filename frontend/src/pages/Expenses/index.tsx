import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Expense, ExpenseCategory } from '../../types'
import { ExpenseCard } from '../../components/domain/ExpenseCard'
import { StatCard } from '../../components/ui/StatCard'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { EmptyState } from '../../components/ui/EmptyState'
import { CreditCard, Plus, Search, DollarSign, PieChart as PieIcon } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Education',
  'Shopping',
  'Entertainment',
  'Health',
  'Other',
]

const COLORS = ['#f59e0b', '#06b6d4', '#6366f1', '#ec4899', '#f43f5e', '#10b981', '#71717a']

export const ExpensesPage: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [formTitle, setFormTitle] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Food')
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [formNotes, setFormNotes] = useState('')

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(formAmount)
    if (!formTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return

    addExpense({
      title: formTitle,
      amount: parsedAmount,
      category: formCategory,
      date: formDate,
      notes: formNotes,
    })
    setIsModalOpen(false)
  }

  // Monthly and Weekly Calculation
  const now = new Date()
  const currentMonth = now.toISOString().substring(0, 7)
  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))
  const monthlyTotal = monthExpenses.reduce((acc, curr) => acc + curr.amount, 0)

  const oneWeekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0]
  const weeklyExpenses = expenses.filter((e) => e.date >= oneWeekAgo)
  const weeklyTotal = weeklyExpenses.reduce((acc, curr) => acc + curr.amount, 0)

  const todayStr = now.toISOString().split('T')[0]
  const todayTotal = expenses
    .filter((e) => e.date === todayStr)
    .reduce((acc, curr) => acc + curr.amount, 0)

  // Category Pie Data
  const categoryMap: Record<string, number> = {}
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount
  })
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  // Filtered List
  const filtered = expenses.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchSearch) return false
    if (selectedCat !== 'all' && e.category !== selectedCat) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
            Student Expense Tracker
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Budgeting, meal plans, transit costs, and study supplies
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setFormTitle('')
            setFormAmount('')
            setFormCategory('Food')
            setFormDate(new Date().toISOString().split('T')[0])
            setFormNotes('')
            setIsModalOpen(true)
          }}
        >
          <Plus className="w-4 h-4" />
          Log Expense
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Monthly Total"
          value={`$${monthlyTotal.toFixed(2)}`}
          subtitle="Total spent this calendar month"
          icon={<DollarSign className="w-5 h-5 text-indigo-500" />}
          badgeText="Active Month"
          badgeVariant="info"
        />
        <StatCard
          title="Past 7 Days"
          value={`$${weeklyTotal.toFixed(2)}`}
          subtitle="Weekly budget velocity"
          icon={<CreditCard className="w-5 h-5 text-emerald-500" />}
          badgeText="Weekly Pace"
          badgeVariant="success"
        />
        <StatCard
          title="Today's Spending"
          value={`$${todayTotal.toFixed(2)}`}
          subtitle="Daily purchases logged"
          icon={<PieIcon className="w-5 h-5 text-amber-500" />}
          badgeText={todayTotal > 30 ? 'High Spending' : 'Normal'}
          badgeVariant={todayTotal > 30 ? 'warning' : 'success'}
        />
      </div>

      {/* Analytics & Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Spending by Category
          </h3>
          <p className="text-xs text-zinc-500 mb-4">Overall distribution across categories</p>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Spent']}
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
            {pieData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search purchases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-700 dark:text-zinc-300 w-full sm:w-auto cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<CreditCard className="w-6 h-6" />}
              title="No expenses found"
              description="No expense records match your filter criteria."
              actionLabel="Add Expense"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="space-y-2.5">
              {filtered.map((item) => (
                <ExpenseCard
                  key={item.id}
                  expense={item}
                  onDelete={deleteExpense}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Expense"
        description="Record a personal transaction, textbook, or campus purchase"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Input
            label="Expense Description / Item"
            placeholder="e.g. Campus Cafeteria Lunch"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount ($)"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              required
            />
            <Select
              label="Category"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
              options={CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
            />
          </div>

          <Input
            label="Date"
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            required
          />

          <Input
            label="Notes / Location (Optional)"
            placeholder="e.g. Student union stall or online discount"
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
