import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Task } from '../../types'
import { formatTimeAgo } from '../../utils/date'
import { Clock, Trash2, Edit3, Check } from 'lucide-react'

export interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit?: (task: Task) => void
  onDelete?: (id: string) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.status === 'completed'

  const priorityVariant = {
    urgent: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'secondary',
  } as const

  return (
    <Card className="flex items-start justify-between gap-3 p-4 transition-all" hoverEffect>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 bg-white dark:bg-zinc-800'
          }`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              {task.subject}
            </span>
            <Badge variant={priorityVariant[task.priority]} size="sm">
              {task.priority.toUpperCase()}
            </Badge>
          </div>

          <h4
            className={`text-sm font-medium transition-all ${
              isCompleted
                ? 'line-through text-zinc-400 dark:text-zinc-500'
                : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {formatTimeAgo(task.deadline)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {task.estimatedMinutes} min
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Edit Task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </Card>
  )
}
