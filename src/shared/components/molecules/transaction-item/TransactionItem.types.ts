import type { DZAccent } from '@atoms/tokens/types.ts'

export type TransactionType = 'income' | 'expense' | 'saving' | 'debt'

export interface TransactionItemProps {
  title: string
  category?: string
  date: string
  amount: number
  type: TransactionType
  currency?: string
  locale?: string
  note?: string
  onClick?: () => void
  className?: string
}

export const TRANSACTION_ACCENT: Record<TransactionType, DZAccent> = {
  income: 'income',
  expense: 'expense',
  saving: 'saving',
  debt: 'debt',
}
