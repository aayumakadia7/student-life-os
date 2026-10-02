import React from 'react'
import { cn } from '../../utils/cn'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { label: string; value: string | number }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const generatedId = React.useId()
    const selectId = id || props.name || generatedId

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border rounded-lg transition-colors focus:outline-none focus:ring-2 appearance-none cursor-pointer',
            error
              ? 'border-rose-500 text-rose-600 focus:ring-rose-500/30'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-indigo-500/30 focus:border-indigo-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
