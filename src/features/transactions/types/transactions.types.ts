export type TxType = 'income' | 'expense'
export type TxCategory =
  | 'Vivienda'
  | 'Alimentos'
  | 'Servicios'
  | 'Transporte'
  | 'Ocio'
  | 'Salario'
  | 'Freelance'
  | 'Otros'

export interface Transaction {
  id: string
  name: string
  category: TxCategory
  type: TxType
  date: string
  amount: number
}

export interface TransactionSummary {
  totalIncome: number
  totalExpenses: number
  incomeSources: { label: string; amount: number }[]
  expenseRatio: number
  month: string
}

export interface TransactionsData {
  summary: TransactionSummary
  transactions: Transaction[]
}

export interface TransactionsState {
  data: TransactionsData | null
  isLoading: boolean
  error: string | null
}

export interface NewTransactionForm {
  type: TxType
  amount: string
  category: TxCategory
  name: string
  date: string
}
