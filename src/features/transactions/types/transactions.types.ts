export type IncomeSource = 'SALARY' | 'FREELANCE' | 'OTHER'

export interface IncomeRequestDTO {
  source: IncomeSource
  description?: string
  amount: number
}

export interface IncomeResponseDTO {
  id: string
  source: IncomeSource
  description?: string
  amount: number
  createdAt: string
}

export interface ExpenseRequestDTO {
  description: string
  amount: number
  date: string
}

export interface ExpenseResponseDTO {
  id: string
  description: string
  amount: number
  date: string
  createdAt: string
}

export type TxType = 'income' | 'expense'

export type TxCategory = 'Salario' | 'Freelance' | 'Otros' | 'Gasto'

export const SOURCE_LABEL: Record<IncomeSource, TxCategory> = {
  SALARY: 'Salario',
  FREELANCE: 'Freelance',
  OTHER: 'Otros',
}

export const CATEGORY_TO_SOURCE: Record<'Salario' | 'Freelance' | 'Otros', IncomeSource> = {
  Salario: 'SALARY',
  Freelance: 'FREELANCE',
  Otros: 'OTHER',
}

export interface Transaction {
  id: string
  name: string
  category: TxCategory
  type: TxType
  date: string
  dateISO: string
  amount: number
}

export interface NewTransactionForm {
  type: TxType
  amount: string
  source?: 'Salario' | 'Freelance' | 'Otros'
  description: string
  date: string
}

export interface TransactionSummary {
  totalIncome: number
  totalExpenses: number
  expenseRatio: number
  month: string
  incomeSources: { label: string; amount: number }[]
}

export interface TransactionsData {
  summary: TransactionSummary
  transactions: Transaction[]
}

export interface TransactionsState {
  data: TransactionsData | null
  isLoading: boolean
  isSaving: boolean
  isDeleting: string | null
  error: string | null
  saveError: string | null
  successMessage: string | null
  deleteError: string | null
}
