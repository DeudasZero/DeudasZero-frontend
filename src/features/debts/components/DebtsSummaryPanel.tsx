import type { FC } from 'react'
import { Badge } from '@atoms/badge/Badge.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { LoadScoreGauge } from './LoadScoreGauge.tsx'
import { DebtKPI } from './DebtKPI.tsx'
import type { Debt, DebtsSummary } from '../types/debts.types.ts'

interface DebtsSummaryPanelProps {
  summary: DebtsSummary | undefined
  debts: Debt[] | undefined
  isLoading: boolean
}

function buildRecommendation(debts: Debt[], totalMonthlyInterest: number): string {
  const active = debts.filter((d) => d.status === 'active')
  if (active.length === 0) {
    return `Pagas $${new Intl.NumberFormat('es-CO').format(totalMonthlyInterest)}/mes en intereses.`
  }

  const worst = [...active].sort((a, b) => b.monthlyRate - a.monthlyRate)[0]!

  const estimatedMonths =
    worst.balance > 0 && worst.minPayment > worst.monthlyInterest
      ? Math.ceil(
          Math.log(worst.minPayment / (worst.minPayment - worst.monthlyInterest)) /
            Math.log(1 + worst.monthlyRate / 100),
        )
      : null

  const interestFmt = `$${new Intl.NumberFormat('es-CO').format(totalMonthlyInterest)}`
  const base = `Pagas ${interestFmt}/mes en intereses.`

  if (active.length === 1) {
    return `${base} Enfoca tus pagos extra en "${worst.name}" (${worst.monthlyRate}%/mes) para liquidarla más rápido.`
  }

  const monthsText =
    estimatedMonths && isFinite(estimatedMonths) && estimatedMonths < 999
      ? ` en ~${estimatedMonths} meses`
      : ''

  return `${base} Liquida "${worst.name}" primero (${worst.monthlyRate}%/mes) y ahorra intereses${monthsText}.`
}

export const DebtsSummaryPanel: FC<DebtsSummaryPanelProps> = ({ summary, debts, isLoading }) => {
  if (isLoading || !summary) {
    return (
      <div
        className="grid gap-6 p-6 rounded-[10px]"
        style={{ gridTemplateColumns: '200px 1fr 1fr', background: 'rgb(20,28,36)' }}
      >
        {[180, 120, 120].map((w, i) => (
          <Skeleton key={i} width={`${w}px`} height="80px" />
        ))}
      </div>
    )
  }

  const recommendation = buildRecommendation(debts ?? [], summary.totalMonthlyInterest)

  return (
    <div
      className="grid gap-6 p-6 rounded-[10px]"
      style={{
        gridTemplateColumns: 'auto 1fr auto',
        background: 'rgb(20,28,36)',
        alignItems: 'start',
        gap: '32px',
      }}
    >
      <LoadScoreGauge score={summary.loadScore} label={summary.scoreLabel} />

      <div className="flex flex-col gap-3">
        <DebtKPI label="DEUDA TOTAL ACTIVA">
          <span
            className="font-sans tabular-nums leading-none"
            style={{
              fontSize: '56px',
              fontWeight: 500,
              letterSpacing: '-0.4px',
              color: 'var(--dz-text-primary)',
            }}
          >
            ${new Intl.NumberFormat('es-CO').format(summary.totalActiveDebt)}
          </span>
        </DebtKPI>

        <p
          className="font-sans m-0"
          style={{ fontSize: '13px', color: 'var(--dz-text-muted)', lineHeight: 1.55 }}
        >
          {recommendation}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <DebtKPI label="PAGO MÍNIMO MENSUAL" sublabel={`${summary.loadScore}% de ingresos`}>
          <span
            className="font-sans"
            style={{
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '-0.18px',
              color: 'var(--dz-text-primary)',
            }}
          >
            ${new Intl.NumberFormat('es-CO').format(summary.minPaymentTotal)}
          </span>
        </DebtKPI>

        <DebtKPI label="INTERÉS MENSUAL" sublabel="se va en humo">
          <span
            className="font-sans"
            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dz-expense)' }}
          >
            ${new Intl.NumberFormat('es-CO').format(summary.totalMonthlyInterest)}
          </span>
        </DebtKPI>

        <DebtKPI label="DEUDAS ACTIVAS">
          <Badge accent="signature" size="sm">
            {summary.activeCount}
          </Badge>
        </DebtKPI>

        <DebtKPI label="DEUDAS LIQUIDADAS">
          <Badge accent="income" size="sm">
            {summary.paidCount}
          </Badge>
        </DebtKPI>
      </div>
    </div>
  )
}
