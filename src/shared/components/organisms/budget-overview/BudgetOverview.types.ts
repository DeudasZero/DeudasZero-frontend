export interface BudgetCategory {
  id: string
  name: string
  spent: number
  budget: number
  accent?: 'income' | 'expense' | 'saving' | 'debt' | 'signature' | 'neutral'
}

export interface BudgetOverviewProps {
  income: number
  expenses: number
  savings: number
  debts: number
  categories?: BudgetCategory[]
  currency?: string
  locale?: string
  period?: string
  loading?: boolean
  onCategoryClick?: (category: BudgetCategory) => void
  className?: string
}
