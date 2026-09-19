import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { DayOfWeek, TimetableEntry } from '../../types'
import { ClassCard } from '../../components/domain/ClassCard'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { EmptyState } from '../../components/ui/EmptyState'
import { getCurrentDayName } from '../../utils/date'
import { Calendar, Plus } from 'lucide-react'

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const TimetablePage: React.FC = () => {
  const { timetable, addClass, updateClass, deleteClass } = useApp()
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDayName())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null)

  // Form State
  const [formSubject, setFormSubject] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formTeacher, setFormTeacher] = useState('')
  const [formRoom, setFormRoom] = useState('')
  const [formDay, setFormDay] = useState<DayOfWeek>(selectedDay)
  const [formStart, setFormStart] = useState('09:00')
  const [formEnd, setFormEnd] = useState('10:00')

  const openAddModal = () => {
    setEditingEntry(null)
    setFormSubject('')
    setFormCode('')
    setFormTeacher('')
    setFormRoom('')
    setFormDay(selectedDay)
    setFormStart('09:00')
    setFormEnd('10:00')
    setIsModalOpen(true)
  }

  const openEditModal = (entry: TimetableEntry) => {
    setEditingEntry(entry)
    setFormSubject(entry.subject)
    setFormCode(entry.code || '')
    setFormTeacher(entry.teacher)
    setFormRoom(entry.room)
    setFormDay(entry.day)
    setFormStart(entry.startTime)
    setFormEnd(entry.endTime)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formSubject.trim()) return

    if (editingEntry) {
      updateClass(editingEntry.id, {
        subject: formSubject,
        code: formCode || undefined,
        teacher: formTeacher,
        room: formRoom,
        day: formDay,
        startTime: formStart,
        endTime: formEnd,
      })
    } else {
      addClass({
        subject: formSubject,
        code: formCode || undefined,
        teacher: formTeacher,
        room: formRoom,
        day: formDay,
        startTime: formStart,
        endTime: formEnd,
      })
    }
    setIsModalOpen(false)
  }

  const dayClasses = timetable
    .filter((c) => c.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
            Timetable & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Weekly class schedule, lecture halls, and room allocations
          </p>
        </div>
        <Button size="sm" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day
          const count = timetable.filter((c) => c.day === day).length
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{day}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-indigo-700 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Class list for Selected Day */}
      {dayClasses.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title={`No classes on ${selectedDay}`}
          description="Enjoy your free time or add a recurring class session to your schedule."
          actionLabel="Add Class for this Day"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dayClasses.map((item) => (
            <ClassCard
              key={item.id}
              entry={item}
              onEdit={openEditModal}
              onDelete={deleteClass}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntry ? 'Edit Class' : 'Add Class'}
        description="Configure class schedule, instructor, and room location"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject Name"
            placeholder="e.g. Data Structures & Algorithms"
            value={formSubject}
            onChange={(e) => setFormSubject(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Course Code"
              placeholder="e.g. CS301"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
            />
            <Select
              label="Day of Week"
              value={formDay}
              onChange={(e) => setFormDay(e.target.value as DayOfWeek)}
              options={DAYS.map((d) => ({ label: d, value: d }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              value={formStart}
              onChange={(e) => setFormStart(e.target.value)}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={formEnd}
              onChange={(e) => setFormEnd(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Instructor / Professor"
              placeholder="e.g. Dr. Sarah Vance"
              value={formTeacher}
              onChange={(e) => setFormTeacher(e.target.value)}
              required
            />
            <Input
              label="Room / Hall"
              placeholder="e.g. Room 204 or Lab 2"
              value={formRoom}
              onChange={(e) => setFormRoom(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingEntry ? 'Save Changes' : 'Create Class'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
