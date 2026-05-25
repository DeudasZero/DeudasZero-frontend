import { http } from '@/services/http.ts'
import type {
  DebtResponseDTO,
  DebtListResponseDTO,
  DebtRequestDTO,
  Debt,
  DebtsData,
  DebtsSummary,
  ScoreLabel,
  DebtFormValues,
} from '../types/debts.types.ts'

function calcAnnualRate(monthlyRate: number): number {
  return +((Math.pow(1 + monthlyRate / 100, 12) - 1) * 100).toFixed(1)
}

function calcMonthlyInterest(balance: number, monthlyRate: number): number {
  return Math.round((balance * monthlyRate) / 100)
}

function mapDebt(dto: DebtResponseDTO): Debt {
  return {
    id: dto.id,
    kind: dto.type === 'CARD' ? 'card' : 'loan',
    name: dto.name,
    balance: dto.balance,
    monthlyRate: dto.monthlyRate,
    annualRate: calcAnnualRate(dto.monthlyRate),
    minPayment: dto.minPayment,
    monthlyInterest: calcMonthlyInterest(dto.balance, dto.monthlyRate),
    status: dto.status === 'ACTIVE' ? 'active' : 'paid',
  }
}

function scoreLabel(score: number): ScoreLabel {
  if (score < 30) return 'SALUDABLE'
  if (score < 50) return 'ALERTA'
  return 'RIESGO'
}

function buildSummary(debts: DebtResponseDTO[], loadScore: number): DebtsSummary {
  const active = debts.filter((d) => d.status === 'ACTIVE')
  const paid = debts.filter((d) => d.status === 'PAID')

  const totalActiveDebt = active.reduce((acc, d) => acc + d.balance, 0)
  const totalMonthlyInterest = active.reduce(
    (acc, d) => acc + calcMonthlyInterest(d.balance, d.monthlyRate),
    0,
  )
  const minPaymentTotal = active.reduce((acc, d) => acc + d.minPayment, 0)

  return {
    loadScore,
    scoreLabel: scoreLabel(loadScore),
    totalActiveDebt,
    totalMonthlyInterest,
    minPaymentTotal,
    activeCount: active.length,
    paidCount: paid.length,
  }
}

export async function getDebts(): Promise<DebtsData> {
  const res = await http.get<DebtListResponseDTO>('/debts')
  const { debts: raw, debtLoadScore } = res.data

  return {
    summary: buildSummary(raw, debtLoadScore),
    debts: raw.map(mapDebt),
  }
}

export async function createDebt(values: DebtFormValues): Promise<DebtResponseDTO> {
  const payload: DebtRequestDTO = {
    name: values.name.trim(),
    type: values.type,
    balance: Number(values.balance),
    monthlyRate: Number(values.monthlyRate),
    minPayment: Number(values.minPayment),
  }
  const res = await http.post<DebtResponseDTO>('/debts', payload)
  return res.data
}

export async function updateDebt(id: string, values: DebtFormValues): Promise<DebtResponseDTO> {
  const payload: DebtRequestDTO = {
    name: values.name.trim(),
    type: values.type,
    balance: Number(values.balance),
    monthlyRate: Number(values.monthlyRate),
    minPayment: Number(values.minPayment),
  }
  const res = await http.put<DebtResponseDTO>(`/debts/${id}`, payload)
  return res.data
}

export async function markDebtPaid(id: string): Promise<DebtResponseDTO> {
  const res = await http.patch<DebtResponseDTO>(`/debts/${id}/pay`)
  return res.data
}

export async function deleteDebt(id: string): Promise<void> {
  await http.delete(`/debts/${id}`)
}
