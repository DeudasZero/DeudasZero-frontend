export type TransactionType = 'income' | 'expense' | 'saving' | 'debt'
export type PaymentMethod =
  | 'Débito'
  | 'Crédito'
  | 'Tarjeta'
  | 'PSE'
  | 'Transferencia'
  | 'PayPal'
  | 'Efectivo'
  | 'Otros'

export interface Transaction {
  id: string
  name: string
  category: string
  type: TransactionType
  paymentMethod: PaymentMethod
  date: string
  amount: number
}

export interface DashboardSummary {
  netBalance: number
  totalIncome: number
  totalExpenses: number
  totalDebts: number
  debtRatio: number
  incomeTrend: number
  expenseTrend: number
  worstDebt: { name: string; monthlyRate: number } | null
}

export interface CategorySpend {
  name: string
  amount: number
}

export interface MonthlyPoint {
  month: string
  income: number
  expense: number
}

export interface DashboardData {
  summary: DashboardSummary
  recentTransactions: Transaction[]
  categorySpend: CategorySpend[]
  monthlyHistory: MonthlyPoint[]
  userName: string
  currentMonth: string
}

export interface DashboardState {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
}
