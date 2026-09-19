import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Expense } from '../../types'
import { formatDate } from '../../utils/date'
import { Trash2, DollarSign, Tag } from 'lucide-react'

export interface ExpenseCardProps {
  expense: Expense
  currency?: string
  onDelete?: (id: string) => void
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  currency = '$',
  onDelete,
}) => {
  const categoryColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
    Food: 'warning',
    Transport: 'info',
    Education: 'primary',
    Shopping: 'secondary',
    Entertainment: 'danger',
    Health: 'success',
    Other: 'secondary',
  }

  return (
    <Card className="flex items-center justify-between p-3.5" hoverEffect>
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
          <DollarSign className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {expense.title}
            </h4>
            <Badge variant={categoryColors[expense.category] || 'secondary'} size="sm">
              {expense.category}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
            <span>{formatDate(expense.date)}</span>
            {expense.notes && (
              <span className="flex items-center gap-1 line-clamp-1">
                <Tag className="w-3 h-3" />
                {expense.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {currency}{expense.amount.toFixed(2)}
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(expense.id)}
            className="p-1 text-zinc-400 hover:text-rose-500 rounded-md transition-colors"
            title="Delete Expense"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </Card>
  )
}
