import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { Badge } from '../../components/ui/Badge'
import { formatTimeAgo } from '../../utils/date'
import { GraduationCap, Flame, Clock, BookOpen, Plus, Calendar, CheckCircle } from 'lucide-react'

export const StudyPlannerPage: React.FC = () => {
  const {
    exams,
    studyTopics,
    studySessions,
    addExam,
    deleteExam,
    addStudySession,
    updateTopicProgress,
  } = useApp()

  const [isExamModalOpen, setIsExamModalOpen] = useState(false)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)

  // Exam Form
  const [examSubject, setExamSubject] = useState('')
  const [examDate, setExamDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0])
  const [examTime, setExamTime] = useState('10:00 AM')
  const [examRoom, setExamRoom] = useState('Main Exam Hall')
  const [examSyllabus, setExamSyllabus] = useState('')

  // Session Form
  const [sessSubject, setSessSubject] = useState('Data Structures')
  const [sessTopic, setSessTopic] = useState('')
  const [sessDuration, setSessDuration] = useState(60)

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!examSubject.trim()) return
    addExam({
      subject: examSubject,
      examDate,
      time: examTime,
      room: examRoom,
      syllabus: examSyllabus,
    })
    setIsExamModalOpen(false)
  }

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessTopic.trim()) return
    addStudySession({
      subject: sessSubject,
      topic: sessTopic,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Number(sessDuration),
      completed: true,
    })
    setIsSessionModalOpen(false)
  }

  // Calculate Metrics
  const totalStudyMinutes = studySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0)
  const totalHours = (totalStudyMinutes / 60).toFixed(1)
  const streakDays = 5 // Consistent study streak

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
            Study Planner & Exam Readiness
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Topic mastery, revision logs, active study sessions, and exam countdowns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setExamSubject('')
              setExamSyllabus('')
              setIsExamModalOpen(true)
            }}
          >
            <Calendar className="w-4 h-4" />
            Add Exam
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSessTopic('')
              setIsSessionModalOpen(true)
            }}
          >
            <Plus className="w-4 h-4" />
            Log Session
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Current Study Streak"
          value={`${streakDays} Days`}
          subtitle="Consecutive active study days"
          icon={<Flame className="w-5 h-5 text-amber-500" />}
          badgeText="Active Streak 🔥"
          badgeVariant="warning"
        />
        <StatCard
          title="Total Study Hours"
          value={`${totalHours} hrs`}
          subtitle={`${studySessions.length} total logged sessions`}
          icon={<Clock className="w-5 h-5 text-indigo-500" />}
          badgeText="Semester Log"
          badgeVariant="info"
        />
        <StatCard
          title="Upcoming Exams"
          value={exams.length}
          subtitle="Scheduled this term"
          icon={<GraduationCap className="w-5 h-5 text-purple-500" />}
          badgeText="On Radar"
          badgeVariant="info"
        />
      </div>

      {/* 2-Column Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Upcoming Exams Countdown */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Exam Schedule & Countdown
          </h3>

          <div className="space-y-3">
            {exams.map((exam) => (
              <Card key={exam.id} className="p-4" hoverEffect>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {formatTimeAgo(exam.examDate)}
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {exam.subject}
                    </h4>
                  </div>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="text-xs text-zinc-400 hover:text-rose-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-2">
                  <span>📅 {exam.examDate}</span>
                  {exam.time && <span>⏰ {exam.time}</span>}
                  {exam.room && <span>📍 {exam.room}</span>}
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300">
                  <p className="font-semibold text-[11px] text-zinc-400 mb-1">Syllabus Scope:</p>
                  <p>{exam.syllabus}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Topics Mastery & Logged Sessions */}
        <div className="space-y-6">
          {/* Topic Mastery Checklist */}
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Syllabus Topic Mastery
            </h3>

            <div className="space-y-3">
              {studyTopics.map((top) => (
                <Card key={top.id} className="p-3.5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">
                        {top.subject}
                      </span>
                      <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {top.topic}
                      </h5>
                    </div>
                    <Badge
                      variant={
                        top.difficulty === 'hard'
                          ? 'danger'
                          : top.difficulty === 'medium'
                          ? 'warning'
                          : 'success'
                      }
                      size="sm"
                    >
                      {top.difficulty.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>Proficiency</span>
                      <span className="font-bold">{top.progress}%</span>
                    </div>
                    <ProgressBar value={top.progress} height="sm" variant="primary" />
                  </div>

                  <div className="flex items-center justify-end gap-1 mt-2.5">
                    <button
                      onClick={() => updateTopicProgress(top.id, top.progress - 10)}
                      className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 cursor-pointer"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => updateTopicProgress(top.id, top.progress + 10)}
                      className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 cursor-pointer"
                    >
                      +10%
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Study Sessions */}
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-sky-500" />
              Recent Completed Sessions
            </h3>

            <div className="space-y-2">
              {studySessions.slice(0, 4).map((sess) => (
                <div
                  key={sess.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs"
                >
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                      {sess.topic}
                    </span>
                    <span className="text-zinc-400 text-[11px]">{sess.subject} • {sess.date}</span>
                  </div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-lg">
                    {sess.durationMinutes} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Exam Modal */}
      <Modal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        title="Schedule Exam / Test"
        description="Add a midterm, final, or quiz to calculate countdowns"
      >
        <form onSubmit={handleAddExam} className="space-y-4">
          <Input
            label="Exam Title / Subject"
            placeholder="e.g. Operating Systems Midterm"
            value={examSubject}
            onChange={(e) => setExamSubject(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
            <Input
              label="Time"
              placeholder="e.g. 10:00 AM"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
            />
          </div>

          <Input
            label="Room / Hall"
            placeholder="e.g. Examination Hall 3 - Desk 12"
            value={examRoom}
            onChange={(e) => setExamRoom(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Syllabus Outline
            </label>
            <textarea
              rows={3}
              placeholder="Chapters, units, formulas to cover..."
              value={examSyllabus}
              onChange={(e) => setExamSyllabus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsExamModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Exam</Button>
          </div>
        </form>
      </Modal>

      {/* Log Session Modal */}
      <Modal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Log Completed Study Session"
        description="Record revision time to update your weekly productivity streaks"
      >
        <form onSubmit={handleAddSession} className="space-y-4">
          <Input
            label="Course / Subject"
            placeholder="e.g. Data Structures"
            value={sessSubject}
            onChange={(e) => setSessSubject(e.target.value)}
            required
          />

          <Input
            label="Specific Topic Covered"
            placeholder="e.g. Solved 5 Graph Traversal LeetCode problems"
            value={sessTopic}
            onChange={(e) => setSessTopic(e.target.value)}
            required
          />

          <Input
            label="Duration (Minutes)"
            type="number"
            min="10"
            step="5"
            value={sessDuration}
            onChange={(e) => setSessDuration(Number(e.target.value))}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsSessionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Log Session</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
