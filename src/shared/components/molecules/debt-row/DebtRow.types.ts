export type DebtStatus = 'active' | 'paused' | 'paid'

export interface DebtRowProps {
  name: string
  creditor: string
  balance: number
  totalDebt: number
  nextPayment?: number
  nextPaymentDate?: string
  interestRate?: number
  status?: DebtStatus
  currency?: string
  locale?: string
  onClick?: () => void
  className?: string
}
