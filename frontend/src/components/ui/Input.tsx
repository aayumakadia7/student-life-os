import React from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 7)

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border rounded-lg transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-2',
            error
              ? 'border-rose-500 text-rose-600 focus:ring-rose-500/30'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-indigo-500/30 focus:border-indigo-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-zinc-500">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
