import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Recommendation } from '../../types'
import { Sparkles, Clock, ArrowRight, CheckCircle } from 'lucide-react'

export interface RecommendationCardProps {
  recommendation: Recommendation | null
  onStartTask?: (taskId: string) => void
  onCompleteTask?: (taskId: string) => void
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onCompleteTask,
}) => {
  if (!recommendation) {
    return (
      <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/10 border-indigo-500/20 p-6">
        <div className="flex items-center gap-2.5 text-indigo-500 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-2">
          <Sparkles className="w-4 h-4" />
          What Should I Do Now?
        </div>
        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
          You are all caught up! 🌟
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          No pending urgent tasks or approaching deadlines. Take a break, review past notes, or get ahead on your study topics.
        </p>
      </Card>
    )
  }

  const priorityBadgeVariant = {
    urgent: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'secondary',
  } as const

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent dark:from-indigo-950/30 dark:via-zinc-900 dark:to-zinc-900 border-indigo-500/30 p-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>What Should I Do Now?</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant={priorityBadgeVariant[recommendation.priority]}>
            {recommendation.priority.toUpperCase()}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {recommendation.estimatedMinutes} min
          </span>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {recommendation.subject}
        </span>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-0.5">
          {recommendation.title}
        </h3>
      </div>

      <div className="mb-5 bg-white/70 dark:bg-zinc-800/60 rounded-xl p-3 border border-zinc-200/60 dark:border-zinc-700/50">
        <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
          Why this task now?
        </p>
        <ul className="space-y-1">
          {recommendation.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          size="sm"
          className="flex-1 sm:flex-none shadow-md"
          onClick={() => {
            if (recommendation.taskId && onCompleteTask) {
              onCompleteTask(recommendation.taskId)
            }
          }}
        >
          <CheckCircle className="w-4 h-4" />
          Mark Completed
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.href = '/tasks'
          }}
        >
          View in Tasks
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  )
}
