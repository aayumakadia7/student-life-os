import React from 'react'
import { cn } from '../../utils/cn'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 to 100
  target?: number
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'auto'
  height?: 'sm' | 'md' | 'lg'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  target,
  variant = 'auto',
  height = 'md',
  className,
  ...props
}) => {
  const clamped = Math.min(100, Math.max(0, value))

  // Determine auto color based on value / target
  let color = 'bg-indigo-600'
  if (variant === 'auto') {
    if (target !== undefined) {
      if (clamped >= target) color = 'bg-emerald-500'
      else if (clamped >= target - 10) color = 'bg-amber-500'
      else color = 'bg-rose-500'
    } else {
      color = clamped >= 75 ? 'bg-emerald-500' : clamped >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
    }
  } else if (variant === 'success') {
    color = 'bg-emerald-500'
  } else if (variant === 'warning') {
    color = 'bg-amber-500'
  } else if (variant === 'danger') {
    color = 'bg-rose-500'
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={cn('relative w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden', heights[height], className)} {...props}>
      <div
        className={cn('h-full transition-all duration-500 ease-out rounded-full', color)}
        style={{ width: `${clamped}%` }}
      />
      {target !== undefined && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-zinc-400 dark:bg-zinc-200 z-10"
          style={{ left: `${target}%` }}
          title={`Target: ${target}%`}
        />
      )}
    </div>
  )
}
