import React from 'react'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { Badge } from '../ui/Badge'
import { AttendanceRecord } from '../../types'
import { Plus, Minus } from 'lucide-react'

export interface AttendanceCardProps {
  record: AttendanceRecord
  onMark: (id: string, attended: boolean) => void
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ record, onMark }) => {
  const percentage = record.held === 0 ? 100 : Math.round((record.attended / record.held) * 1000) / 10
  const isSafe = percentage >= record.targetPercentage
  const target = record.targetPercentage

  // Calculate: Classes I can miss OR Classes needed
  // Formula:
  // To stay >= target: attended / (held + X) >= target/100  => attended * 100 / target - held >= X
  // To reach target: (attended + Y) / (held + Y) >= target/100 => Y >= (target*held - 100*attended)/(100 - target)
  let marginText = ''
  if (isSafe) {
    const canMiss = Math.floor((record.attended * 100) / target - record.held)
    marginText = canMiss > 0 ? `You can miss ${canMiss} more class${canMiss > 1 ? 'es' : ''}` : 'On track (borderline)'
  } else {
    const needed = Math.ceil((target * record.held - 100 * record.attended) / (100 - target))
    marginText = `Need to attend next ${needed} class${needed > 1 ? 'es' : ''} to reach ${target}%`
  }

  return (
    <Card className="flex flex-col justify-between" hoverEffect>
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[11px] font-mono text-zinc-400">{record.code}</span>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{record.subject}</h4>
          </div>
          <Badge variant={isSafe ? 'success' : percentage >= target - 10 ? 'warning' : 'danger'}>
            {percentage}%
          </Badge>
        </div>

        <div className="my-3">
          <ProgressBar value={percentage} target={target} />
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-100 dark:border-zinc-800/80 text-center my-2">
          <div>
            <p className="text-[11px] text-zinc-400">Held</p>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{record.held}</p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Attended</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{record.attended}</p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Missed</p>
            <p className="text-sm font-semibold text-rose-500">{record.held - record.attended}</p>
          </div>
        </div>

        <p className={`text-xs font-medium mt-1 ${isSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
          {marginText}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
        <button
          type="button"
          onClick={() => onMark(record.id, true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Present
        </button>
        <button
          type="button"
          onClick={() => onMark(record.id, false)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
          Absent
        </button>
      </div>
    </Card>
  )
}
