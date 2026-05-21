import type { ReactNode } from 'react'

export type SummaryPanelAccent = 'income' | 'expense' | 'saving' | 'debt' | 'signature' | 'neutral'
export type SummaryPanelTrend = 'up' | 'down' | 'neutral'
export type SummaryPanelSurface = 'surface' | 'raised'

export interface SummaryPanelMetric {
  id: string
  label: string
  value: ReactNode
  subvalue?: string
  trend?: SummaryPanelTrend
  trendLabel?: string
  accent?: SummaryPanelAccent
}

export interface SummaryPanelAction {
  label: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  onClick?: () => void
}

export interface SummaryPanelProps {
  title?: string
  subtitle?: string
  metrics: SummaryPanelMetric[]
  actions?: SummaryPanelAction[]
  footer?: ReactNode
  loading?: boolean
  surface?: SummaryPanelSurface
  className?: string
}
