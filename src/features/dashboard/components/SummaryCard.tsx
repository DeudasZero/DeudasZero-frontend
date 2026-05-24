import type { FC, ReactNode } from 'react'

interface SummaryCardProps {
  eyebrow: string
  value: string
  trend?: string
  trendUp?: boolean
  accent?: 'default' | 'income' | 'expense' | 'debt'
  icon?: ReactNode
  isLoading?: boolean
}

const accentBarClass: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  default: 'bg-(--dz-signature)',
  income: 'bg-(--dz-income)',
  expense: 'bg-(--dz-expense)',
  debt: 'bg-(--dz-debt)',
}

const valueColorClass: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  default: 'text-(--dz-text-primary)',
  income: 'text-(--dz-income)',
  expense: 'text-(--dz-expense)',
  debt: 'text-(--dz-debt)',
}

export const SummaryCard: FC<SummaryCardProps> = ({
  eyebrow,
  value,
  trend,
  trendUp,
  accent = 'default',
  icon,
  isLoading = false,
}) => (
  <div className="relative flex flex-col gap-3 rounded-(--dz-r-lg) bg-(--dz-bg-card) p-5 overflow-hidden">
    <span className={`absolute top-0 left-0 right-0 h-0.5 ${accentBarClass[accent]}`} />

    <div className="flex items-center justify-between">
      <span
        className="font-mono text-[11px] uppercase tracking-widest"
        style={{ color: 'var(--dz-text-faint)', letterSpacing: 'var(--dz-ls-eyebrow)' }}
      >
        {eyebrow}
      </span>
      {icon && <span style={{ color: 'var(--dz-text-faint)' }}>{icon}</span>}
    </div>

    {isLoading ? (
      <div
        className="h-7 w-32 rounded-full animate-pulse"
        style={{ background: 'var(--dz-bg-raised)' }}
      />
    ) : (
      <p
        className={`dz-tabular text-[28px] font-semibold leading-none tracking-tight ${valueColorClass[accent]}`}
        style={{ fontFamily: 'var(--dz-font-display)' }}
      >
        {value}
      </p>
    )}

    {trend && !isLoading && (
      <span
        className="text-[11.5px]"
        style={{ color: trendUp ? 'var(--dz-income)' : 'var(--dz-expense)' }}
      >
        {trendUp ? '↑' : '↓'} {trend}
      </span>
    )}
  </div>
)
