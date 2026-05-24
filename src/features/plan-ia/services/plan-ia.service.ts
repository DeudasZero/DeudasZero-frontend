import { http } from '@/services/http.ts'
import { MOCK_PLAN_DEBTS, MOCK_MONTHLY_BUDGET } from './plan-ia.mock.ts'
import type { PlanDebt } from '../types/plan-ia.types.ts'

export interface PlanIAData {
  debts: PlanDebt[]
  monthlyBudget: number
}

export async function getPlanIA(): Promise<PlanIAData> {
  try {
    const res = await http.get<PlanIAData>('/plan-ia')
    return res.data
  } catch {
    return { debts: MOCK_PLAN_DEBTS, monthlyBudget: MOCK_MONTHLY_BUDGET }
  }
}

export async function updateStrategy(strategy: string): Promise<void> {
  try {
    await http.patch('/plan-ia/strategy', { strategy })
  } catch {
    /* mock */
  }
}

export async function markPaymentDone(debtId: string, month: number): Promise<void> {
  try {
    await http.patch(`/plan-ia/payments/${debtId}/${month}/done`)
  } catch {
    /* mock */
  }
}
