import React from 'react'
import { Card } from '../ui/Card'
import { TimetableEntry } from '../../types'
import { Clock, MapPin, User } from 'lucide-react'

export interface ClassCardProps {
  entry: TimetableEntry
  isCurrent?: boolean
  isNext?: boolean
  onEdit?: (entry: TimetableEntry) => void
  onDelete?: (id: string) => void
}

export const ClassCard: React.FC<ClassCardProps> = ({
  entry,
  isCurrent,
  isNext,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      className={`p-4 border transition-all ${
        isCurrent
          ? 'border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20'
          : isNext
          ? 'border-emerald-500/60 bg-emerald-500/5'
          : ''
      }`}
      hoverEffect
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isCurrent && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white animate-pulse">
                Current Class
              </span>
            )}
            {isNext && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Next Up
              </span>
            )}
            {entry.code && <span className="text-xs font-mono text-zinc-400">{entry.code}</span>}
          </div>
          <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{entry.subject}</h4>
        </div>

        <div className="text-right">
          <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Clock className="w-3.5 h-3.5" />
            {entry.startTime} - {entry.endTime}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
          {entry.room}
        </span>
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-zinc-400" />
          {entry.teacher}
        </span>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 mt-2 pt-2 text-xs">
          {onEdit && (
            <button onClick={() => onEdit(entry)} className="text-zinc-400 hover:text-indigo-500">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(entry.id)} className="text-zinc-400 hover:text-rose-500">
              Delete
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
