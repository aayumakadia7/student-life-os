import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const CalendarSection: React.FC = () => {
  const { timetable, assignments } = useApp()
  const [currentMonth, setCurrentMonth] = useState('October 2026')
  const [selectedDayNum, setSelectedDayNum] = useState(3) // Saturday, October 3, 2026

  // Days in October 2026: starts on Thursday Oct 1
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const calendarDays = [
    { day: 27, inMonth: false },
    { day: 28, inMonth: false },
    { day: 29, inMonth: false },
    { day: 30, inMonth: false },
    { day: 1, inMonth: true, hasClass: true },
    { day: 2, inMonth: true, hasClass: true, hasDue: true },
    { day: 3, inMonth: true, isToday: true, hasClass: false }, // Today!
    { day: 4, inMonth: true, isWeekend: true },
    { day: 5, inMonth: true, hasClass: true },
    { day: 6, inMonth: true, hasClass: true, hasDue: true },
    { day: 7, inMonth: true, hasClass: true },
    { day: 8, inMonth: true, hasClass: true },
    { day: 9, inMonth: true, hasClass: true },
    { day: 10, inMonth: true, isWeekend: true },
    { day: 11, inMonth: true, isWeekend: true },
    { day: 12, inMonth: true, hasClass: true },
    { day: 13, inMonth: true, hasClass: true },
    { day: 14, inMonth: true, hasClass: true, hasDue: true },
    { day: 15, inMonth: true, hasClass: true },
    { day: 16, inMonth: true, hasClass: true },
    { day: 17, inMonth: true, isWeekend: true },
    { day: 18, inMonth: true, isWeekend: true },
    { day: 19, inMonth: true, hasClass: true },
    { day: 20, inMonth: true, hasClass: true },
    { day: 21, inMonth: true, hasClass: true },
    { day: 22, inMonth: true, hasClass: true },
    { day: 23, inMonth: true, hasClass: true },
    { day: 24, inMonth: true, isWeekend: true },
    { day: 25, inMonth: true, isWeekend: true },
    { day: 26, inMonth: true, hasClass: true },
    { day: 27, inMonth: true, hasClass: true },
    { day: 28, inMonth: true, hasClass: true },
    { day: 29, inMonth: true, hasClass: true },
    { day: 30, inMonth: true, hasClass: true },
    { day: 31, inMonth: true, isWeekend: true },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 m-0">
            Academic Calendar & Schedule
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track lectures, lab submissions, exam dates, and semester deadlines
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-xs">
            <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentMonth}</span>
          </div>
          <button
            onClick={() => setCurrentMonth('October 2026')}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-500" />
          </button>
          <button
            onClick={() => setCurrentMonth('November 2026')}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Calendar Grid + Daily Schedule Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month View (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-xs">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-xs font-bold text-zinc-400 uppercase tracking-wider py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((d, idx) => {
              const isSelected = selectedDayNum === d.day && d.inMonth
              return (
                <button
                  key={idx}
                  onClick={() => d.inMonth && setSelectedDayNum(d.day)}
                  disabled={!d.inMonth}
                  className={`min-h-[58px] p-1.5 rounded-xl border flex flex-col justify-between items-start transition-all cursor-pointer ${
                    !d.inMonth
                      ? 'opacity-30 border-transparent bg-transparent cursor-default'
                      : isSelected
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 shadow-xs'
                      : d.isToday
                      ? 'border-blue-400 bg-white dark:bg-zinc-900 font-bold'
                      : 'border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100/80 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400'
                          : d.isToday
                          ? 'text-blue-600'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {d.day}
                    </span>
                    {d.isToday && (
                      <span className="text-[9px] font-mono uppercase bg-blue-600 text-white px-1 rounded">
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Badges/Dots */}
                  <div className="flex items-center gap-1 mt-1">
                    {d.hasClass && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Class scheduled" />}
                    {d.hasDue && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Assignment due" />}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Classes</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Assignments Due</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Selected Day</span>
            </span>
          </div>
        </div>

        {/* Selected Day Agenda (1 Col) */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 m-0">
                  Agenda for Oct {selectedDayNum}, 2026
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {selectedDayNum === 3 ? 'Saturday • Weekend Rest & Revision' : 'Academic Schedule'}
                </p>
              </div>
              <span className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 text-xs font-bold">
                {selectedDayNum === 3 ? 'Free Day' : 'Active'}
              </span>
            </div>

            {selectedDayNum === 3 ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 m-0">
                  No Classes Today!
                </h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Enjoy your Saturday. Great opportunity to review your ER diagram for Database Systems or catch up on rest.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {timetable.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      <span>{item.subject}</span>
                      <span className="text-blue-600 font-mono">{item.startTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.startTime} - {item.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.room}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
            <span>{assignments.filter((a) => a.status !== 'completed').length} assignments pending this semester</span>
          </div>
        </div>
      </div>
    </div>
  )
}
