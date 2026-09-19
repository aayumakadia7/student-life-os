import React from 'react'
import { Card } from './Card'
import { cn } from '../../utils/cn'

export interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  badgeText?: string
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badgeText,
  badgeVariant = 'info',
  className,
}) => {
  const badgeStyles = {
    success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50',
    danger: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50',
    info: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50',
  }

  return (
    <Card className={cn('flex flex-col justify-between', className)} hoverEffect>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </p>
        {icon && (
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {value}
          </span>
          {badgeText && (
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', badgeStyles[badgeVariant])}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  )
}
