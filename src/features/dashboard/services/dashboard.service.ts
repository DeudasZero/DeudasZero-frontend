import { http } from '@/services/http.ts'
import type {
  DashboardData,
  CategorySpend,
  Transaction,
  MonthlyPoint,
} from '../types/dashboard.types.ts'
import type { IncomeResponseDTO } from '@/features/transactions/types/transactions.types.ts'
import type { ExpenseResponseDTO } from '@/features/transactions/types/transactions.types.ts'
import type { DebtListResponseDTO } from '@/features/debts/types/debts.types.ts'
import { SOURCE_LABEL } from '@/features/transactions/types/transactions.types.ts'

function extractArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw !== null && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    for (const key of ['incomes', 'expenses', 'debts', 'content', 'data']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
    const firstArr = Object.values(obj).find((v) => Array.isArray(v))
    if (firstArr) return firstArr as T[]
  }
  return []
}

function formatDateDisplay(isoDate: string): string {
  const d = new Date(isoDate + (isoDate.length === 10 ? 'T00:00:00' : ''))
  return d
    .toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
    .replace('.', '')
    .replace(
      /(\d+) (\w+)/,
      (_, day, mon) =>
        `${day} ${(mon as string).charAt(0).toUpperCase() + (mon as string).slice(1)}`,
    )
}

function currentMonthLabel(): string {
  return new Date().toLocaleString('es-CO', { month: 'long' }).toUpperCase()
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function shortMonthLabel(date: Date): string {
  return date
    .toLocaleString('es-CO', { month: 'short' })
    .replace('.', '')
    .replace(/^\w/, (c) => c.toUpperCase())
}

function mapIncomeToTransaction(dto: IncomeResponseDTO): Transaction {
  const category = SOURCE_LABEL[dto.source] ?? 'Otros'
  const dateISO = dto.createdAt.split('T')[0]!
  return {
    id: dto.id,
    name: dto.description ?? category,
    category,
    type: 'income',
    paymentMethod: 'Transferencia',
    date: formatDateDisplay(dateISO),
    amount: dto.amount,
  }
}

function mapExpenseToTransaction(dto: ExpenseResponseDTO): Transaction {
  return {
    id: dto.id,
    name: dto.description,
    category: 'Gasto',
    type: 'expense',
    paymentMethod: 'Débito',
    date: formatDateDisplay(dto.date),
    amount: -Math.abs(dto.amount),
  }
}

function buildMonthlyHistory(
  incomes: IncomeResponseDTO[],
  expenses: ExpenseResponseDTO[],
): MonthlyPoint[] {
  const now = new Date()

  const months: { key: string; label: string }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: monthKey(d), label: shortMonthLabel(d) })
  }

  const incomeByMonth: Record<string, number> = {}
  for (const inc of incomes) {
    const d = new Date(inc.createdAt.length === 10 ? inc.createdAt + 'T00:00:00' : inc.createdAt)
    const key = monthKey(d)
    incomeByMonth[key] = (incomeByMonth[key] ?? 0) + inc.amount
  }

  const expenseByMonth: Record<string, number> = {}
  for (const exp of expenses) {
    const d = new Date(exp.date + 'T00:00:00')
    const key = monthKey(d)
    expenseByMonth[key] = (expenseByMonth[key] ?? 0) + exp.amount
  }

  return months.map(({ key, label }) => ({
    month: label,
    income: incomeByMonth[key] ?? 0,
    expense: expenseByMonth[key] ?? 0,
  }))
}

function buildCategorySpend(expenses: ExpenseResponseDTO[]): CategorySpend[] {
  const now = new Date()
  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date + 'T00:00:00')
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })

  const totals = currentMonthExpenses.reduce<Record<string, number>>((acc, e) => {
    const label = e.description.trim() || 'Otros'
    acc[label] = (acc[label] ?? 0) + e.amount
    return acc
  }, {})

  return (Object.entries(totals) as [string, number][])
    .sort(([, amtA], [, amtB]) => amtB - amtA)
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount }))
}

function buildDashboardData(
  incomes: IncomeResponseDTO[],
  expenses: ExpenseResponseDTO[],
  debtPayload: DebtListResponseDTO,
): DashboardData {
  const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0)
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)

  const activeDebts = debtPayload.debts.filter((d) => d.status === 'ACTIVE')
  const totalDebts = activeDebts.reduce((acc, d) => acc + d.balance, 0)

  const netBalance = totalIncome - totalExpenses
  const debtRatio = totalIncome > 0 ? Math.round((totalDebts / totalIncome) * 100) : 0

  const worstDebt =
    activeDebts.length > 0
      ? (() => {
          const worst = [...activeDebts].sort((a, b) => b.monthlyRate - a.monthlyRate)[0]!
          return { name: worst.name, monthlyRate: worst.monthlyRate }
        })()
      : null

  const now = new Date()
  const isThisMonth = (dateStr: string) => {
    const d = new Date(dateStr.length === 10 ? dateStr + 'T00:00:00' : dateStr)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }
  const isLastMonth = (dateStr: string) => {
    const d = new Date(dateStr.length === 10 ? dateStr + 'T00:00:00' : dateStr)
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth()
  }

  const incomeThisMonth = incomes
    .filter((i) => isThisMonth(i.createdAt))
    .reduce((acc, i) => acc + i.amount, 0)
  const incomeLastMonth = incomes
    .filter((i) => isLastMonth(i.createdAt))
    .reduce((acc, i) => acc + i.amount, 0)
  const expenseThisMonth = expenses
    .filter((e) => isThisMonth(e.date))
    .reduce((acc, e) => acc + e.amount, 0)
  const expenseLastMonth = expenses
    .filter((e) => isLastMonth(e.date))
    .reduce((acc, e) => acc + e.amount, 0)

  const incomeTrend =
    incomeLastMonth > 0
      ? Math.round(((incomeThisMonth - incomeLastMonth) / incomeLastMonth) * 100)
      : 0
  const expenseTrend =
    expenseLastMonth > 0
      ? Math.round(((expenseThisMonth - expenseLastMonth) / expenseLastMonth) * 100)
      : 0

  type RawEntry = { dateISO: string; tx: Transaction }
  const allRaw: RawEntry[] = [
    ...incomes.map((i): RawEntry => ({ dateISO: i.createdAt, tx: mapIncomeToTransaction(i) })),
    ...expenses.map(
      (e): RawEntry => ({ dateISO: e.date + 'T00:00:00', tx: mapExpenseToTransaction(e) }),
    ),
  ]
  allRaw.sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())

  return {
    userName: '',
    currentMonth: currentMonthLabel(),
    summary: {
      netBalance,
      totalIncome,
      totalExpenses,
      totalDebts,
      debtRatio,
      incomeTrend,
      expenseTrend,
      worstDebt,
    },
    categorySpend: buildCategorySpend(expenses),
    monthlyHistory: buildMonthlyHistory(incomes, expenses),
    recentTransactions: allRaw.slice(0, 8).map((r) => r.tx),
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const [incomesRes, expensesRes, debtsRes] = await Promise.all([
    http.get('/incomes'),
    http.get('/expenses'),
    http.get<DebtListResponseDTO>('/debts'),
  ])

  const rawIncomes = extractArray<IncomeResponseDTO>(incomesRes.data)
  const rawExpenses = extractArray<ExpenseResponseDTO>(expensesRes.data)

  const debtPayload: DebtListResponseDTO =
    debtsRes.data && typeof debtsRes.data === 'object' && 'debts' in debtsRes.data
      ? (debtsRes.data as DebtListResponseDTO)
      : { debts: extractArray(debtsRes.data), debtLoadScore: 0 }

  return buildDashboardData(rawIncomes, rawExpenses, debtPayload)
}
