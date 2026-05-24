import type { FC } from 'react'
import { Badge } from '@atoms/badge/Badge.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { LoadScoreGauge } from './LoadScoreGauge.tsx'
import type { DebtsSummary } from '../types/debts.types.ts'

interface DebtsSummaryPanelProps {
  summary: DebtsSummary | undefined
  isLoading: boolean
}

const KPI: FC<{ label: string; sublabel?: string; children: React.ReactNode }> = ({
  label,
  sublabel,
  children,
}) => (
  <div className="flex flex-col gap-1">
    <span
      className="font-mono uppercase"
      style={{ fontSize: '9.5px', letterSpacing: '1.33px', color: 'var(--dz-text-faint)' }}
    >
      {label}
    </span>
    <div className="leading-none">{children}</div>
    {sublabel && (
      <span className="font-sans" style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}>
        {sublabel}
      </span>
    )}
  </div>
)

export const DebtsSummaryPanel: FC<DebtsSummaryPanelProps> = ({ summary, isLoading }) => {
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
        <KPI label="DEUDA TOTAL ACTIVA">
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
        </KPI>

        <p
          className="font-sans m-0"
          style={{ fontSize: '13px', color: 'var(--dz-text-muted)', lineHeight: 1.55 }}
        >
          Pagas{' '}
          <span style={{ color: 'var(--dz-expense)', fontWeight: 600 }}>
            ${new Intl.NumberFormat('es-CO').format(summary.totalMonthlyInterest)}
          </span>
          /mes en intereses. Si liquidas la{' '}
          <span style={{ color: 'var(--dz-signature)', fontWeight: 500 }}>Visa Bancolombia</span>{' '}
          primero (3.1%/mes), ahorras ~$690k en 9 meses.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <KPI label="PAGO MÍNIMO MENSUAL" sublabel={`${summary.loadScore}% de ingresos`}>
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
        </KPI>

        <KPI label="INTERÉS MENSUAL" sublabel="se va en humo">
          <span
            className="font-sans"
            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dz-expense)' }}
          >
            ${new Intl.NumberFormat('es-CO').format(summary.totalMonthlyInterest)}
          </span>
        </KPI>

        <KPI
          label="DEUDAS ACTIVAS"
          sublabel={`${summary.paidCount} liquidada${summary.paidCount !== 1 ? 's' : ''}`}
        >
          <Badge accent="signature" size="sm">
            {summary.activeCount}
          </Badge>
        </KPI>
      </div>
    </div>
  )
}
