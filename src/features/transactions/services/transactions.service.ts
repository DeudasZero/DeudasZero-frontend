import { http } from '@/services/http.ts'
import { MOCK_TRANSACTIONS } from './transactions.mock.ts'
import type { TransactionsData, NewTransactionForm } from '../types/transactions.types.ts'

export async function getTransactions(): Promise<TransactionsData> {
  try {
    const res = await http.get<TransactionsData>('/transactions')
    return res.data
  } catch {
    return MOCK_TRANSACTIONS
  }
}

export async function createTransaction(form: NewTransactionForm): Promise<void> {
  try {
    await http.post('/transactions', form)
  } catch {
    // Offline: silently succeed (mock)
  }
}
