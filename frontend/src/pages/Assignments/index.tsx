import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Assignment, AssignmentStatus, Priority } from '../../types'
import { AssignmentCard } from '../../components/domain/AssignmentCard'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { EmptyState } from '../../components/ui/EmptyState'
import { FileText, Plus, Search } from 'lucide-react'

export const AssignmentsPage: React.FC = () => {
  const { assignments, addAssignment, updateAssignment, deleteAssignment } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAsg, setEditingAsg] = useState<Assignment | null>(null)

  // Form
  const [formTitle, setFormTitle] = useState('')
  const [formSubject, setFormSubject] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formDueDate, setFormDueDate] = useState(new Date().toISOString().split('T')[0])
  const [formPriority, setFormPriority] = useState<Priority>('high')
  const [formStatus, setFormStatus] = useState<AssignmentStatus>('not_started')
  const [formHours, setFormHours] = useState(3)

  const openAddModal = () => {
    setEditingAsg(null)
    setFormTitle('')
    setFormSubject('Data Structures')
    setFormDescription('')
    setFormDueDate(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0])
    setFormPriority('high')
    setFormStatus('not_started')
    setFormHours(3)
    setIsModalOpen(true)
  }

  const openEditModal = (asg: Assignment) => {
    setEditingAsg(asg)
    setFormTitle(asg.title)
    setFormSubject(asg.subject)
    setFormDescription(asg.description)
    setFormDueDate(asg.dueDate)
    setFormPriority(asg.priority)
    setFormStatus(asg.status)
    setFormHours(asg.estimatedHours)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    if (editingAsg) {
      updateAssignment(editingAsg.id, {
        title: formTitle,
        subject: formSubject,
        description: formDescription,
        dueDate: formDueDate,
        priority: formPriority,
        status: formStatus,
        estimatedHours: Number(formHours),
      })
    } else {
      addAssignment({
        title: formTitle,
        subject: formSubject,
        description: formDescription,
        dueDate: formDueDate,
        priority: formPriority,
        status: formStatus,
        estimatedHours: Number(formHours),
      })
    }
    setIsModalOpen(false)
  }

  const filtered = assignments.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchSearch) return false

    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
            Course Assignments & Projects
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track major homework, laboratory submissions, deadlines, and completion status
          </p>
        </div>
        <Button size="sm" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          Add Assignment
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-700 dark:text-zinc-300 w-full sm:w-auto cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Assignments Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No assignments found"
          description="You have no assignments matching the current criteria."
          actionLabel="Create Assignment"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asg) => (
            <AssignmentCard
              key={asg.id}
              assignment={asg}
              onStatusChange={(id, status) => updateAssignment(id, { status })}
              onEdit={openEditModal}
              onDelete={deleteAssignment}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAsg ? 'Edit Assignment' : 'Add Assignment'}
        description="Enter coursework assignment, deadline, and expectations"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Balanced Binary Search Trees"
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
            <Input
              label="Due Date"
              type="date"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
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
            <Select
              label="Status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as AssignmentStatus)}
              options={[
                { label: 'Not Started', value: 'not_started' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Submitted', value: 'submitted' },
                { label: 'Completed', value: 'completed' },
              ]}
            />
            <Input
              label="Est. Hours"
              type="number"
              step="0.5"
              min="0.5"
              value={formHours}
              onChange={(e) => setFormHours(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Description & Requirements
            </label>
            <textarea
              rows={3}
              placeholder="Detail assignment guidelines, submission portal, format..."
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
              {editingAsg ? 'Save Changes' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
