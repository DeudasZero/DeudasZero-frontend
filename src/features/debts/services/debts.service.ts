import { http } from '@/services/http.ts'
import { MOCK_DEBTS } from './debts.mock.ts'
import type { DebtsData, CardFormValues, LoanFormValues } from '../types/debts.types.ts'

export async function getDebts(): Promise<DebtsData> {
  try {
    const res = await http.get<DebtsData>('/debts')
    return res.data
  } catch {
    return MOCK_DEBTS
  }
}

export async function createCard(values: CardFormValues): Promise<void> {
  try {
    await http.post('/debts/card', values)
  } catch {
    /* mock */
  }
}

export async function createLoan(values: LoanFormValues): Promise<void> {
  try {
    await http.post('/debts/loan', values)
  } catch {
    /* mock */
  }
}

export async function markDebtPaid(id: string): Promise<void> {
  try {
    await http.patch(`/debts/${id}/paid`)
  } catch {
    /* mock */
  }
}
