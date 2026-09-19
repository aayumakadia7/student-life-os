import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AttendanceCard } from '../../components/domain/AttendanceCard'
import { StatCard } from '../../components/ui/StatCard'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { UserCheck, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react'

export const AttendancePage: React.FC = () => {
  const { attendance, markAttendance, updateAttendanceRecord, preferences } = useApp()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formSubject, setFormSubject] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formHeld, setFormHeld] = useState(30)
  const [formAttended, setFormAttended] = useState(25)

  // Overall calculations
  const totalHeld = attendance.reduce((acc, curr) => acc + curr.held, 0)
  const totalAttended = attendance.reduce((acc, curr) => acc + curr.attended, 0)
  const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 1000) / 10 : 100
  const isSafe = overallPct >= preferences.attendanceTarget

  const safeSubjectsCount = attendance.filter(
    (a) => (a.held > 0 ? (a.attended / a.held) * 100 : 100) >= preferences.attendanceTarget
  ).length

  const warningSubjectsCount = attendance.length - safeSubjectsCount

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formSubject.trim()) return

    const newRec = {
      id: `att_${Date.now()}`,
      subject: formSubject,
      code: formCode || 'CS000',
      held: Number(formHeld),
      attended: Number(formAttended),
      targetPercentage: preferences.attendanceTarget,
    }
    updateAttendanceRecord(newRec.id, newRec)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
            Attendance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track class participation, mandatory percentage thresholds, and safety margins
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setFormSubject('')
            setFormCode('')
            setFormHeld(20)
            setFormAttended(16)
            setIsModalOpen(true)
          }}
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </Button>
      </div>

      {/* Attendance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${overallPct}%`}
          subtitle={`Target threshold: ${preferences.attendanceTarget}%`}
          icon={<UserCheck className="w-5 h-5 text-indigo-500" />}
          badgeText={isSafe ? 'Compliant' : 'Shortage Alert'}
          badgeVariant={isSafe ? 'success' : 'danger'}
        />
        <StatCard
          title="Safe Subjects"
          value={safeSubjectsCount}
          subtitle={`Above ${preferences.attendanceTarget}% criteria`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          badgeText="Good Standing"
          badgeVariant="success"
        />
        <StatCard
          title="At-Risk Subjects"
          value={warningSubjectsCount}
          subtitle="Immediate attendance required"
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          badgeText={warningSubjectsCount > 0 ? 'Attention Needed' : 'All Clear'}
          badgeVariant={warningSubjectsCount > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attendance.map((record) => (
          <AttendanceCard
            key={record.id}
            record={record}
            onMark={markAttendance}
          />
        ))}
      </div>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Subject to Tracker"
        description="Register a course for attendance tracking and threshold analytics"
      >
        <form onSubmit={handleAddSubject} className="space-y-4">
          <Input
            label="Subject Name"
            placeholder="e.g. Computer Networks"
            value={formSubject}
            onChange={(e) => setFormSubject(e.target.value)}
            required
          />

          <Input
            label="Subject Code"
            placeholder="e.g. CS305"
            value={formCode}
            onChange={(e) => setFormCode(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Classes Held So Far"
              type="number"
              min="0"
              value={formHeld}
              onChange={(e) => setFormHeld(Number(e.target.value))}
              required
            />
            <Input
              label="Classes Attended"
              type="number"
              min="0"
              max={formHeld}
              value={formAttended}
              onChange={(e) => setFormAttended(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Course</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
