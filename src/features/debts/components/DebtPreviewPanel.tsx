import type { FC } from 'react'
import type { DebtKind } from '../types/debts.types.ts'

function calcPreview(balance: number, monthlyRate: number, minPayment: number) {
  const interest = Math.round((balance * monthlyRate) / 100)
  const monthsOnly =
    minPayment > 0 && minPayment > interest
      ? Math.ceil(Math.log(minPayment / (minPayment - interest)) / Math.log(1 + monthlyRate / 100))
      : 0
  const eaRate = ((1 + monthlyRate / 100) ** 12 - 1) * 100
  return {
    interest,
    monthsOnly: isFinite(monthsOnly) ? monthsOnly : 999,
    eaRate: +eaRate.toFixed(1),
  }
}

function fmtNum(n: number) {
  return new Intl.NumberFormat('es-CO').format(Math.round(n))
}

interface DebtPreviewPanelProps {
  balance: number
  monthlyRate: number
  minPayment: number
  kind: DebtKind
}

export const DebtPreviewPanel: FC<DebtPreviewPanelProps> = ({
  balance,
  monthlyRate,
  minPayment,
  kind,
}) => {
  const { interest, monthsOnly, eaRate } = calcPreview(balance, monthlyRate, minPayment)
  if (interest === 0) return null

  return (
    <div
      className="flex flex-col gap-4 p-4 rounded-[8px]"
      style={{ background: 'rgb(8,13,18)', border: '1px solid rgba(220,235,255,0.06)' }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: '9.5px', letterSpacing: '1.33px', color: 'var(--dz-text-faint)' }}
      >
        VISTA PREVIA · CÁLCULO ESTIMADO
      </span>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <span
            className="font-mono uppercase"
            style={{ fontSize: '9px', letterSpacing: '0.9px', color: 'var(--dz-text-faint)' }}
          >
            INTERÉS / MES
          </span>
          <span
            className="font-sans"
            style={{ fontSize: '17px', fontWeight: 600, color: 'var(--dz-expense)' }}
          >
            ${fmtNum(interest)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="font-mono uppercase"
            style={{ fontSize: '9px', letterSpacing: '0.9px', color: 'var(--dz-text-faint)' }}
          >
            {kind === 'card' ? 'SI PAGAS SOLO MÍNIMO' : 'TASA E.A.'}
          </span>
          <span
            className="font-sans"
            style={{ fontSize: '17px', fontWeight: 600, color: 'var(--dz-text-primary)' }}
          >
            {kind === 'card' ? (monthsOnly > 0 ? `~${monthsOnly} meses` : '—') : `${eaRate}%`}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="font-mono uppercase"
            style={{ fontSize: '9px', letterSpacing: '0.9px', color: 'var(--dz-text-faint)' }}
          >
            TASA E.A.
          </span>
          <span
            className="font-sans"
            style={{ fontSize: '17px', fontWeight: 600, color: 'var(--dz-text-primary)' }}
          >
            {eaRate}%
          </span>
        </div>
      </div>
    </div>
  )
}
