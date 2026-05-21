import type { ReactNode } from 'react'

export type DebtListFilterStatus = 'all' | 'active' | 'paused' | 'paid'

export interface DebtListItem {
  id: string
  name: string
  creditor: string
  balance: number
  totalDebt: number
  nextPayment?: number
  nextPaymentDate?: string
  interestRate?: number
  status: 'active' | 'paused' | 'paid'
  currency?: string
  locale?: string
}

export interface DebtListProps {
  debts: DebtListItem[]
  onDebtClick?: (debt: DebtListItem) => void
  onAddDebt?: () => void
  filterStatus?: DebtListFilterStatus
  onFilterChange?: (status: DebtListFilterStatus) => void
  loading?: boolean
  emptyAction?: { label: string; onClick: () => void }
  header?: ReactNode
  className?: string
}
