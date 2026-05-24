import type { FC } from 'react'
import { Badge } from '@atoms/badge/Badge.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
import { Button } from '@atoms/button/Button.tsx'
import type { Debt } from '../types/debts.types.ts'

interface DebtCardProps {
  debt: Debt
  onLiquidar?: (id: string) => void
  priority?: number
}

const KIND_LABEL = { card: 'TARJETA', loan: 'CRÉDITO' } as const

const CardIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)
const LoanIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 2v20M6 12l6-6 6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const DebtCard: FC<DebtCardProps> = ({ debt, onLiquidar, priority }) => {
  const paid = Math.max(0, debt.totalDebt - debt.balance)
  const progress = debt.totalDebt > 0 ? Math.round((paid / debt.totalDebt) * 100) : 100
  const isPaid = debt.status === 'paid'

  const fmt = (n: number) => `$${new Intl.NumberFormat('es-CO').format(n)}`

  return (
    <div
      className="rounded-[10px] overflow-hidden"
      style={{
        background: 'rgb(20,28,36)',
        border: isPaid ? '1px solid rgba(94,225,230,0.15)' : '1px solid rgba(220,235,255,0.06)',
        opacity: isPaid ? 0.7 : 1,
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(220,235,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 font-mono uppercase"
            style={{ fontSize: '11px', letterSpacing: '0.44px', color: 'var(--dz-text-faint)' }}
          >
            {debt.kind === 'card' ? <CardIcon /> : <LoanIcon />}
            {debt.issuer}
          </span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: '9.5px', letterSpacing: '1.1px', color: 'rgba(220,235,255,0.2)' }}
          >
            {KIND_LABEL[debt.kind]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {priority && (
            <Badge accent="debt" size="xs">
              #{priority} Mayor tasa
            </Badge>
          )}
          {isPaid && (
            <Badge accent="income" size="xs" dot>
              Liquidada
            </Badge>
          )}
        </div>
      </div>

      <div className="px-5 py-4 flex gap-6" style={{ alignItems: 'flex-start' }}>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div>
            <p
              className="m-0 font-sans font-semibold"
              style={{
                fontSize: '15px',
                color: 'var(--dz-text-primary)',
                letterSpacing: '-0.075px',
              }}
            >
              {debt.name}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span
                className="font-sans"
                style={{
                  fontSize: '9.5px',
                  fontWeight: 500,
                  letterSpacing: '1.33px',
                  textTransform: 'uppercase',
                  color: 'var(--dz-text-faint)',
                }}
              >
                SALDO ACTUAL
              </span>
              <span
                className="font-sans"
                style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  letterSpacing: '-0.17px',
                  color: 'var(--dz-text-primary)',
                }}
              >
                {fmt(debt.balance)}
              </span>
            </div>

            <ProgressBar value={progress} accent={isPaid ? 'income' : 'debt'} size="sm" />

            <div className="flex items-center justify-between">
              <span
                className="font-mono"
                style={{ fontSize: '11px', letterSpacing: '0.44px', color: 'var(--dz-text-faint)' }}
              >
                <span
                  style={{ color: isPaid ? 'var(--dz-income)' : 'var(--dz-debt)', fontWeight: 600 }}
                >
                  {progress}%
                </span>{' '}
                PAGADO · DE{' '}
                <span style={{ color: 'var(--dz-text-secondary)' }}>{fmt(debt.totalDebt)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 shrink-0" style={{ minWidth: '200px' }}>
          <div className="flex flex-col gap-0.5">
            <span
              className="font-mono uppercase"
              style={{ fontSize: '9.5px', letterSpacing: '1.33px', color: 'var(--dz-text-faint)' }}
            >
              TASA
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className="font-sans"
                style={{ fontSize: '16px', fontWeight: 600, color: 'var(--dz-debt)' }}
              >
                {debt.monthlyRate}
              </span>
              <span
                className="font-mono"
                style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}
              >
                /mes
              </span>
              <span
                className="font-mono"
                style={{ fontSize: '11px', letterSpacing: '0.44px', color: 'var(--dz-text-faint)' }}
              >
                {debt.annualRate}% E.A.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span
              className="font-mono uppercase"
              style={{ fontSize: '9.5px', letterSpacing: '1.33px', color: 'var(--dz-text-faint)' }}
            >
              PAGO MÍNIMO
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className="font-sans"
                style={{ fontSize: '15px', fontWeight: 600, color: 'var(--dz-text-primary)' }}
              >
                {fmt(debt.minPayment)}
              </span>
              <span
                className="font-mono"
                style={{ fontSize: '11px', letterSpacing: '0.44px', color: 'var(--dz-expense)' }}
              >
                {fmt(debt.monthlyInterest)} interés
              </span>
            </div>
          </div>

          {debt.kind === 'loan' && debt.remainingMonths !== undefined && (
            <div className="flex flex-col gap-0.5">
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: '9.5px',
                  letterSpacing: '1.33px',
                  color: 'var(--dz-text-faint)',
                }}
              >
                PLAZO RESTANTE
              </span>
              <span
                className="font-sans"
                style={{ fontSize: '13px', fontWeight: 500, color: 'var(--dz-text-secondary)' }}
              >
                {debt.remainingMonths} meses
                {debt.originalMonths && (
                  <span
                    className="font-mono"
                    style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}
                  >
                    {' '}
                    de {debt.originalMonths}
                  </span>
                )}
              </span>
            </div>
          )}

          {debt.kind === 'card' && debt.cutDay !== undefined && (
            <div className="flex flex-col gap-0.5">
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: '9.5px',
                  letterSpacing: '1.33px',
                  color: 'var(--dz-text-faint)',
                }}
              >
                DÍA DE CORTE
              </span>
              <span
                className="font-sans"
                style={{ fontSize: '13px', fontWeight: 500, color: 'var(--dz-text-secondary)' }}
              >
                {debt.cutDay} del mes
              </span>
            </div>
          )}
        </div>

        {!isPaid && (
          <div className="flex flex-col justify-between shrink-0 self-stretch">
            <div />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLiquidar?.(debt.id)}
              style={{ color: 'var(--dz-signature)', borderColor: 'rgba(94,225,230,0.25)' }}
            >
              Liquidar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
