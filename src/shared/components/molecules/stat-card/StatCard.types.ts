import type { ReactNode } from 'react'
import type { DZAccent } from '@atoms/tokens/types.ts'

export type StatCardTrend = 'up' | 'down' | 'neutral'

export interface StatCardProps {
  label: string
  value: ReactNode
  trend?: StatCardTrend
  trendLabel?: string
  accent?: DZAccent
  icon?: ReactNode
  loading?: boolean
  onClick?: () => void
  className?: string
}
