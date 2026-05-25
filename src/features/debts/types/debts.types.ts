export type ApiDebtType = 'CARD' | 'LOAN'
export type ApiDebtStatus = 'ACTIVE' | 'PAID'

export interface DebtRequestDTO {
  name: string
  type: ApiDebtType
  balance: number
  monthlyRate: number
  minPayment: number
}

export interface DebtResponseDTO {
  id: string
  name: string
  type: ApiDebtType
  balance: number
  monthlyRate: number
  minPayment: number
  status: ApiDebtStatus
  createdAt: string
}

export interface DebtListResponseDTO {
  debts: DebtResponseDTO[]
  debtLoadScore: number
}

export type DebtKind = 'card' | 'loan'
export type DebtStatus = 'active' | 'paid'

export interface Debt {
  id: string
  kind: DebtKind
  name: string
  balance: number
  monthlyRate: number
  annualRate: number
  minPayment: number
  monthlyInterest: number
  status: DebtStatus
}

export type ScoreLabel = 'SALUDABLE' | 'ALERTA' | 'RIESGO'

export interface DebtsSummary {
  loadScore: number
  scoreLabel: ScoreLabel
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
  isSaving: boolean
  isPatching: string | null
  isDeleting: string | null
  error: string | null
  saveError: string | null
  successMessage: string | null
}

export interface DebtFormValues {
  name: string
  type: ApiDebtType
  balance: string
  monthlyRate: string
  minPayment: string
}

export type DebtFormErrors = Partial<Record<keyof DebtFormValues, string>>
