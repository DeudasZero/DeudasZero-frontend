import type { PlanDebt, PaymentStrategy, ScheduleRow, PlanSummary } from '../types/plan-ia.types.ts'

function sortedByStrategy(debts: PlanDebt[], strategy: PaymentStrategy): PlanDebt[] {
  return [...debts].sort((a, b) =>
    strategy === 'avalanche' ? b.interestRate - a.interestRate : a.balance - b.balance,
  )
}

export function buildSchedule(
  debts: PlanDebt[],
  strategy: PaymentStrategy,
  monthlyBudget: number,
  paidMonths = 2,
): ScheduleRow[] {
  if (!debts.length || monthlyBudget <= 0) return []

  const sorted = sortedByStrategy(debts, strategy)
  const balances = sorted.map((d) => d.balance)
  const rows: ScheduleRow[] = []
  const BASE_DATE = new Date(2026, 5, 1)
  const MAX_MONTHS = 120

  for (let month = 1; month <= MAX_MONTHS; month++) {
    if (!balances.some((b) => b > 0.5)) break

    let remaining = monthlyBudget
    const monthDate = new Date(BASE_DATE)
    monthDate.setMonth(BASE_DATE.getMonth() + month - 1)

    const shortMonth = monthDate
      .toLocaleString('es-CO', { month: 'short' })
      .replace('.', '')
      .toUpperCase()
    const dateLabel = monthDate
      .toLocaleString('es-CO', { month: 'short', year: 'numeric' })
      .toUpperCase()

    const payments: { capital: number; interest: number; total: number }[] = sorted.map((d, i) => {
      if (balances[i]! <= 0) return { capital: 0, interest: 0, total: 0 }
      const interest = balances[i]! * (d.interestRate / 100)
      const total = Math.min(d.minPayment, balances[i]! + interest)
      const capital = Math.max(0, total - interest)
      balances[i] = Math.max(0, balances[i]! + interest - total)
      remaining -= total
      return { capital, interest, total }
    })

    for (let i = 0; i < sorted.length; i++) {
      if (balances[i]! <= 0 || remaining <= 0) continue
      const extra = Math.min(remaining, balances[i]!)
      payments[i]!.capital += extra
      payments[i]!.total += extra
      balances[i] = balances[i]! - extra
      remaining -= extra
    }

    const isPaid = month <= paidMonths
    const isCurrent = month === paidMonths + 1

    for (let i = 0; i < sorted.length; i++) {
      if (payments[i]!.total < 1) continue
      rows.push({
        month,
        date: dateLabel,
        dueDate: `30 ${shortMonth.charAt(0) + shortMonth.slice(1).toLowerCase()}`,
        debtId: sorted[i]!.id,
        debtName: sorted[i]!.name,
        creditor: sorted[i]!.creditor,
        debtColor: sorted[i]!.color,
        totalPayment: Math.round(payments[i]!.total),
        capital: Math.round(payments[i]!.capital),
        interest: Math.round(payments[i]!.interest),
        status: isPaid ? 'paid' : isCurrent ? 'current' : 'pending',
      })
    }
  }

  return rows
}

export function calcPlanSummary(
  debts: PlanDebt[],
  strategy: PaymentStrategy,
  monthlyBudget: number,
  paidMonths = 2,
): PlanSummary {
  const schedule = buildSchedule(debts, strategy, monthlyBudget, paidMonths)
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0)
  const totalMonths = schedule.length > 0 ? Math.max(...schedule.map((r) => r.month)) : 0

  const minBudget = debts.reduce((s, d) => s + d.minPayment, 0)
  const minSchedule = buildSchedule(debts, strategy, minBudget, 0)
  const minInterest = minSchedule.reduce((s, r) => s + r.interest, 0)

  const BASE_DATE = new Date(2026, 5, 1)
  const endDate = new Date(BASE_DATE)
  endDate.setMonth(BASE_DATE.getMonth() + totalMonths - 1)

  const sorted = sortedByStrategy(debts, strategy)
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0)
  const avgRate =
    totalBalance > 0 ? debts.reduce((s, d) => s + d.interestRate * d.balance, 0) / totalBalance : 0

  return {
    strategy,
    totalMonths,
    totalInterest: Math.round(totalInterest),
    totalSavingsVsMin: Math.round(Math.max(0, minInterest - totalInterest)),
    startLabel: BASE_DATE.toLocaleString('es-CO', {
      month: 'short',
      year: 'numeric',
    }).toUpperCase(),
    endLabel: endDate.toLocaleString('es-CO', { month: 'long', year: 'numeric' }),
    monthlyPayment: monthlyBudget,
    extraSuggested: Math.max(0, monthlyBudget - minBudget),
    avgRate: Math.round(avgRate * 10) / 10,
    debtsRemaining: debts.length,
    mainCreditor:
      sorted[sorted.length - 1]?.creditor.charAt(0) +
      sorted[sorted.length - 1]!.creditor.slice(1).toLowerCase(),
    progressMonths: paidMonths,
  }
}
