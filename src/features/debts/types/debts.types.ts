export type DebtKind = 'card' | 'loan'
export type DebtStatus = 'active' | 'paid'

export interface Debt {
  id: string
  kind: DebtKind
  name: string
  issuer: string
  balance: number
  totalDebt: number
  monthlyRate: number
  annualRate: number
  minPayment: number
  monthlyInterest: number
  status: DebtStatus
  cutDay?: number
  remainingMonths?: number
  originalMonths?: number
}

export interface DebtsSummary {
  loadScore: number
  scoreLabel: 'SALUDABLE' | 'ALERTA' | 'RIESGO'
  totalActiveDebt: number
  totalMonthlyInterest: number
  minPaymentTotal: number
  activeCount: number
  paidCount: number
}

export interface DebtsData {
  summary: DebtsSummary
  debts: Debt[]
}

export interface DebtsState {
  data: DebtsData | null
  isLoading: boolean
  error: string | null
}

export interface CardFormValues {
  name: string
  balance: string
  monthlyRate: string
  minPayment: string
  cutDay: string
}

export interface LoanFormValues {
  name: string
  balance: string
  monthlyRate: string
  monthlyPayment: string
  remainingMonths: string
  originalMonths: string
}

export type DebtFormErrors<T> = Partial<Record<keyof T, string>>
