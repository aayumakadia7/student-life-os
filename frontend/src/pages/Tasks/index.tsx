import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Task, Priority } from '../../types'
import { TaskCard } from '../../components/domain/TaskCard'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { EmptyState } from '../../components/ui/EmptyState'
import { CheckSquare, Plus, Search, Filter } from 'lucide-react'

type FilterTab = 'all' | 'today' | 'upcoming' | 'completed' | 'high_priority'

export const TasksPage: React.FC = () => {
  const { tasks, addTask, updateTask, toggleTaskComplete, deleteTask } = useApp()

  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'time'>('deadline')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Form State
  const [formTitle, setFormTitle] = useState('')
  const [formSubject, setFormSubject] = useState('')
  const [formPriority, setFormPriority] = useState<Priority>('high')
  const [formDeadline, setFormDeadline] = useState(new Date().toISOString().split('T')[0])
  const [formMinutes, setFormMinutes] = useState(45)
  const [formDescription, setFormDescription] = useState('')

  const openAddModal = () => {
    setEditingTask(null)
    setFormTitle('')
    setFormSubject('Data Structures')
    setFormPriority('high')
    setFormDeadline(new Date().toISOString().split('T')[0])
    setFormMinutes(45)
    setFormDescription('')
    setIsModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setFormTitle(task.title)
    setFormSubject(task.subject)
    setFormPriority(task.priority)
    setFormDeadline(task.deadline)
    setFormMinutes(task.estimatedMinutes)
    setFormDescription(task.description || '')
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    if (editingTask) {
      updateTask(editingTask.id, {
        title: formTitle,
        subject: formSubject,
        priority: formPriority,
        deadline: formDeadline,
        estimatedMinutes: Number(formMinutes),
        description: formDescription,
      })
    } else {
      addTask({
        title: formTitle,
        subject: formSubject,
        priority: formPriority,
        status: 'todo',
        deadline: formDeadline,
        estimatedMinutes: Number(formMinutes),
        description: formDescription,
      })
    }
    setIsModalOpen(false)
  }

  // Filtering
  const todayStr = new Date().toISOString().split('T')[0]
  const filteredTasks = tasks.filter((task) => {
    // Search query
    const matchSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchSearch) return false

    // Tab filter
    if (activeTab === 'today') return task.deadline === todayStr && task.status !== 'completed'
    if (activeTab === 'upcoming') return task.deadline > todayStr && task.status !== 'completed'
    if (activeTab === 'completed') return task.status === 'completed'
    if (activeTab === 'high_priority') return (task.priority === 'high' || task.priority === 'urgent') && task.status !== 'completed'

    return true
  })

  // Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    if (sortBy === 'priority') {
      const weight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 }
      return (weight[b.priority] || 0) - (weight[a.priority] || 0)
    }
    if (sortBy === 'time') {
      return a.estimatedMinutes - b.estimatedMinutes
    }
    return 0
  })

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'today', label: 'Today', count: tasks.filter((t) => t.deadline === todayStr && t.status !== 'completed').length },
    { id: 'upcoming', label: 'Upcoming', count: tasks.filter((t) => t.deadline > todayStr && t.status !== 'completed').length },
    { id: 'high_priority', label: 'High Priority', count: tasks.filter((t) => (t.priority === 'high' || t.priority === 'urgent') && t.status !== 'completed').length },
    { id: 'completed', label: 'Completed', count: tasks.filter((t) => t.status === 'completed').length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
            Task Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Organize coursework, daily goals, deadlines, and time estimates
          </p>
        </div>
        <Button size="sm" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Controls: Search and Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
              <option value="time">Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-6 h-6" />}
          title="No tasks found"
          description="You're all caught up on this view! Create a new task or adjust your filters."
          actionLabel="Create Task"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={toggleTaskComplete}
              onEdit={openEditModal}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
        description="Enter task details, subject classification, and deadline"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Complete Linked List Assignment"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Subject"
              placeholder="e.g. Data Structures"
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              required
            />
            <Select
              label="Priority"
              value={formPriority}
              onChange={(e) => setFormPriority(e.target.value as Priority)}
              options={[
                { label: 'Urgent', value: 'urgent' },
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Deadline Date"
              type="date"
              value={formDeadline}
              onChange={(e) => setFormDeadline(e.target.value)}
              required
            />
            <Input
              label="Estimated Duration (Minutes)"
              type="number"
              min="5"
              step="5"
              value={formMinutes}
              onChange={(e) => setFormMinutes(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add relevant notes, links, or instructions..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
