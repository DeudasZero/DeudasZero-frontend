export type PaymentStrategy = 'avalanche' | 'snowball'

export interface PlanDebt {
  id: string
  name: string
  creditor: string
  balance: number
  interestRate: number
  minPayment: number
  color: string
}

export type ScheduleRowStatus = 'paid' | 'current' | 'pending'

export interface ScheduleRow {
  month: number
  date: string
  dueDate: string
  debtId: string
  debtName: string
  creditor: string
  debtColor: string
  totalPayment: number
  capital: number
  interest: number
  status: ScheduleRowStatus
}

export interface PlanSummary {
  strategy: PaymentStrategy
  totalMonths: number
  totalInterest: number
  totalSavingsVsMin: number
  startLabel: string
  endLabel: string
  monthlyPayment: number
  extraSuggested: number
  avgRate: number
  debtsRemaining: number
  mainCreditor: string
  progressMonths: number
}

export type ChatRole = 'user' | 'ai'
export type ChatMessageTag = 'WHAT-IF' | 'INFO' | 'RECALCULO'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: string
  tag?: ChatMessageTag
}

export interface QuickReply {
  id: string
  label: string
}

export interface PlanIAState {
  strategy: PaymentStrategy
  monthlyBudget: number
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}
