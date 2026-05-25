import { http } from '@/services/http.ts'
import type {
  IncomeResponseDTO,
  ExpenseResponseDTO,
  Transaction,
  TransactionsData,
  NewTransactionForm,
  TransactionSummary,
} from '../types/transactions.types.ts'
import { SOURCE_LABEL, CATEGORY_TO_SOURCE } from '../types/transactions.types.ts'

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

function mapIncome(dto: IncomeResponseDTO): Transaction {
  const category = SOURCE_LABEL[dto.source] ?? 'Otros'
  const dateISO = dto.createdAt.split('T')[0]!
  return {
    id: dto.id,
    name: dto.description ?? category,
    category,
    type: 'income',
    date: formatDateDisplay(dateISO),
    dateISO,
    amount: dto.amount,
  }
}

function mapExpense(dto: ExpenseResponseDTO): Transaction {
  const dateISO = dto.date
  return {
    id: dto.id,
    name: dto.description,
    category: 'Gasto',
    type: 'expense',
    date: formatDateDisplay(dateISO),
    dateISO,
    amount: dto.amount,
  }
}

function buildSummary(
  incomes: IncomeResponseDTO[],
  expenses: ExpenseResponseDTO[],
): TransactionSummary {
  const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0)
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)
  const expenseRatio = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0

  const bySource = incomes.reduce<Record<string, number>>((acc, i) => {
    const label = SOURCE_LABEL[i.source] ?? 'Otros'
    acc[label] = (acc[label] ?? 0) + i.amount
    return acc
  }, {})

  const incomeSources = Object.entries(bySource).map(([label, amount]) => ({ label, amount }))

  const month = new Date().toLocaleString('es-CO', { month: 'long' }).toUpperCase()

  return { totalIncome, totalExpenses, expenseRatio, month, incomeSources }
}

function extractArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw !== null && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    for (const key of ['incomes', 'expenses', 'content', 'data']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
    const firstArr = Object.values(obj).find((v) => Array.isArray(v))
    if (firstArr) return firstArr as T[]
  }
  return []
}

export async function getTransactions(): Promise<TransactionsData> {
  const [incomesRes, expensesRes] = await Promise.all([http.get('/incomes'), http.get('/expenses')])

  const rawIncomes = extractArray<IncomeResponseDTO>(incomesRes.data)
  const rawExpenses = extractArray<ExpenseResponseDTO>(expensesRes.data)

  const transactions = [...rawIncomes.map(mapIncome), ...rawExpenses.map(mapExpense)].sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
  )

  return { summary: buildSummary(rawIncomes, rawExpenses), transactions }
}

export async function createIncome(form: NewTransactionForm): Promise<IncomeResponseDTO> {
  const source = form.source ? CATEGORY_TO_SOURCE[form.source] : 'OTHER'
  const trimmed = form.description.trim()
  const payload = trimmed
    ? { source, description: trimmed, amount: Number(form.amount) }
    : { source, amount: Number(form.amount) }

  const res = await http.post<IncomeResponseDTO>('/incomes', payload)
  return res.data
}

export async function createExpense(form: NewTransactionForm): Promise<ExpenseResponseDTO> {
  const payload = {
    description: form.description.trim(),
    amount: Number(form.amount),
    date: form.date,
  }
  const res = await http.post<ExpenseResponseDTO>('/expenses', payload)
  return res.data
}

export async function createTransaction(
  form: NewTransactionForm,
): Promise<IncomeResponseDTO | ExpenseResponseDTO> {
  return form.type === 'income' ? createIncome(form) : createExpense(form)
}

export async function deleteIncome(id: string): Promise<void> {
  await http.delete(`/incomes/${id}`)
}

export async function deleteExpense(id: string): Promise<void> {
  await http.delete(`/expenses/${id}`)
}
