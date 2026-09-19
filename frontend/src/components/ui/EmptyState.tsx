import React from 'react'
import { Button } from './Button'

export interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl my-4">
      {icon && (
        <div className="p-3 mb-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{title}</h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
