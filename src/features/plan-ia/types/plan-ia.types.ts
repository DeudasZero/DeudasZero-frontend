export type ApiStrategy = 'AVALANCHE' | 'SNOWBALL'

export interface InstallmentResponseDTO {
  id: string
  debtId: string
  debtName: string
  monthNumber: number
  dueDate: string
  paymentAmount: number
  extraPayment: number
  paid: boolean
  paidAt: string | null
}

export interface PlanResponseDTO {
  id: string
  strategy: ApiStrategy
  aiSummary: string
  interestSaved: number
  monthsToPayoff: number
  paidInstallments: number
  totalInstallments: number
  installments: InstallmentResponseDTO[]
  createdAt: string
}

export interface GeneratePlanRequestDTO {
  strategy: ApiStrategy
}

export interface ChatRequestDTO {
  message: string
}
export interface ChatResponseDTO {
  response: string
}

export interface WhatIfRequestDTO {
  extraAmount: number
}
export interface WhatIfResponseDTO {
  analysis: string
}

export interface AiAdviceResponseDTO {
  advice: string
}
export interface AiReportResponseDTO {
  diagnosis: string
  context: string
}

export type PaymentStrategy = 'avalanche' | 'snowball'

export const STRATEGY_TO_API: Record<PaymentStrategy, ApiStrategy> = {
  avalanche: 'AVALANCHE',
  snowball: 'SNOWBALL',
}

export const API_TO_STRATEGY: Record<ApiStrategy, PaymentStrategy> = {
  AVALANCHE: 'avalanche',
  SNOWBALL: 'snowball',
}

export type ScheduleRowStatus = 'paid' | 'current' | 'pending'

export interface ScheduleRow {
  installmentId: string
  debtId: string
  debtName: string
  month: number
  date: string
  dueDate: string
  totalPayment: number
  extraPayment: number
  status: ScheduleRowStatus
}

export interface PlanSummary {
  planId: string
  strategy: PaymentStrategy
  aiSummary: string
  interestSaved: number
  monthsToPayoff: number
  paidInstallments: number
  totalInstallments: number
  startLabel: string
  endLabel: string
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
  plan: PlanResponseDTO | null
  messages: ChatMessage[]
  isLoadingPlan: boolean
  isGenerating: boolean
  isSendingChat: boolean
  isMarkingPaid: string | null
  planError: string | null
  chatError: string | null
  successMessage: string | null
}
