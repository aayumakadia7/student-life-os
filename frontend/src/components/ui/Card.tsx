import React from 'react'
import { cn } from '../../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
}

export const Card: React.FC<CardProps> = ({ className, hoverEffect = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs transition-all duration-200',
        hoverEffect && 'hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
