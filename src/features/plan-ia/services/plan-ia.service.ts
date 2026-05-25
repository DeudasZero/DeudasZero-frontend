import { http } from '@/services/http.ts'
import type {
  PlanResponseDTO,
  InstallmentResponseDTO,
  ChatResponseDTO,
  WhatIfResponseDTO,
  AiAdviceResponseDTO,
  AiReportResponseDTO,
  ApiStrategy,
  PlanHistoryResponseDTO,
} from '../types/plan-ia.types.ts'

export async function getActivePlan(): Promise<PlanResponseDTO> {
  const res = await http.get<PlanResponseDTO>('/plans/active')
  return res.data
}

export async function getPlanHistory(): Promise<PlanHistoryResponseDTO[]> {
  const res = await http.get<PlanHistoryResponseDTO[]>('/plans/history')
  return res.data
}

export async function generatePlan(strategy: ApiStrategy): Promise<PlanResponseDTO> {
  const res = await http.post<PlanResponseDTO>('/plans/generate', { strategy })
  return res.data
}

export async function payInstallment(installmentId: string): Promise<InstallmentResponseDTO> {
  const res = await http.put<InstallmentResponseDTO>(`/plans/installments/${installmentId}/pay`)
  return res.data
}

export async function sendChatMessage(message: string): Promise<string> {
  const res = await http.post<ChatResponseDTO>('/ai/chat', { message })
  return res.data.response
}

export async function getWhatIfAnalysis(extraAmount: number): Promise<string> {
  const res = await http.post<WhatIfResponseDTO>('/ai/what-if', { extraAmount })
  return res.data.analysis
}

export async function getPlanAdvice(): Promise<string> {
  const res = await http.post<AiAdviceResponseDTO>('/ai/plan-advice')
  return res.data.advice
}

export async function getAiReport(): Promise<AiReportResponseDTO> {
  const res = await http.get<AiReportResponseDTO>('/ai/report')
  return res.data
}
