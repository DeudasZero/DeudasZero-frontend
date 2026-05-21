export type PaymentStrategy = 'avalanche' | 'snowball' | 'custom'

export interface PaymentPlanDebt {
  id: string
  name: string
  balance: number
  interestRate: number
  minPayment: number
  currency?: string
  locale?: string
}

export interface PaymentPlanCardProps {
  debts: PaymentPlanDebt[]
  monthlyBudget: number
  strategy: PaymentStrategy
  onStrategyChange?: (strategy: PaymentStrategy) => void
  onMonthlyBudgetChange?: (value: number) => void
  currency?: string
  locale?: string
  loading?: boolean
  className?: string
}
