import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Assignment } from '../../types'
import { formatTimeAgo } from '../../utils/date'
import { Calendar, Clock, Edit3, Trash2 } from 'lucide-react'

export interface AssignmentCardProps {
  assignment: Assignment
  onStatusChange: (id: string, status: Assignment['status']) => void
  onEdit?: (assignment: Assignment) => void
  onDelete?: (id: string) => void
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const statusVariant = {
    not_started: 'secondary',
    in_progress: 'primary',
    submitted: 'info',
    completed: 'success',
  } as const

  const statusLabels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    completed: 'Completed',
  }

  return (
    <Card className="flex flex-col justify-between p-4" hoverEffect>
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            {assignment.subject}
          </span>
          <Badge variant={statusVariant[assignment.status]} size="sm">
            {statusLabels[assignment.status]}
          </Badge>
        </div>

        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          {assignment.title}
        </h4>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
          {assignment.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {formatTimeAgo(assignment.dueDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {assignment.estimatedHours} hrs
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <select
          value={assignment.status}
          onChange={(e) => onStatusChange(assignment.id, e.target.value as any)}
          className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 text-zinc-700 dark:text-zinc-300 cursor-pointer"
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(assignment)}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition-colors"
              title="Edit Assignment"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(assignment.id)}
              className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-md transition-colors"
              title="Delete Assignment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
