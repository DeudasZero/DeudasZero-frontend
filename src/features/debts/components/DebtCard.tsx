import type { FC } from 'react'
import { Badge } from '@atoms/badge/Badge.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
import { Button } from '@atoms/button/Button.tsx'
import type { Debt } from '../types/debts.types.ts'

interface DebtCardProps {
  debt: Debt
  onLiquidar?: (id: string) => void
  onEdit?: (debt: Debt) => void
  onDelete?: (id: string) => void
  isPatching?: boolean
  isDeleting?: boolean
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
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const IconButton: FC<{
  onClick: () => void
  disabled?: boolean
  label: string
  title: string
  hoverBorder: string
  hoverColor: string
  children: React.ReactNode
}> = ({ onClick, disabled = false, label, title, hoverBorder, hoverColor, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={title}
    style={{
      background: 'transparent',
      border: '1px solid rgba(220,235,255,0.5)',
      borderRadius: '6px',
      padding: '4px 6px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: 'rgba(220,235,255,0.5)',
      display: 'inline-flex',
      alignItems: 'center',
      lineHeight: 0,
      transition: 'all 0.15s',
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = hoverBorder
        ;(e.currentTarget as HTMLButtonElement).style.color = hoverColor
      }
    }}
    onMouseLeave={(e) => {
      ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,235,255,0.08)'
      ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--dz-text-faint)'
    }}
  >
    {children}
  </button>
)

export const DebtCard: FC<DebtCardProps> = ({
  debt,
  onLiquidar,
  onEdit,
  onDelete,
  isPatching = false,
  isDeleting = false,
  priority,
}) => {
  const fmt = (n: number) => `$${new Intl.NumberFormat('es-CO').format(n)}`
  const isPaid = debt.status === 'paid'
  const progress = isPaid ? 100 : 0
  const isBusy = isPatching || isDeleting

  return (
    <div
      className="rounded-[10px] overflow-hidden"
      style={{
        background: 'rgb(20,28,36)',
        border: isPaid ? '1px solid rgba(94,225,230,0.15)' : '1px solid rgba(220,235,255,0.06)',
        opacity: isBusy ? 0.6 : isPaid ? 0.7 : 1,
        transition: 'opacity 0.2s',
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
            {KIND_LABEL[debt.kind]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {priority !== undefined && (
            <Badge accent="debt" size="xs">
              #{priority} Mayor tasa
            </Badge>
          )}
          {isPaid && (
            <Badge accent="income" size="xs" dot>
              Liquidada
            </Badge>
          )}

          {onEdit && !isPaid && (
            <IconButton
              onClick={() => onEdit(debt)}
              disabled={isBusy}
              label={`Editar ${debt.name}`}
              title="Editar"
              hoverBorder="rgba(94,225,230,0.4)"
              hoverColor="var(--dz-signature)"
            >
              <EditIcon />
            </IconButton>
          )}

          {onDelete && (
            <IconButton
              onClick={() => onDelete(debt.id)}
              disabled={isBusy}
              label={`Eliminar ${debt.name}`}
              title="Eliminar"
              hoverBorder="rgba(224,122,156,0.4)"
              hoverColor="var(--dz-expense)"
            >
              <TrashIcon />
            </IconButton>
          )}
        </div>
      </div>

      <div className="px-5 py-4 flex gap-6" style={{ alignItems: 'flex-start' }}>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <p
            className="m-0 font-sans font-semibold"
            style={{ fontSize: '15px', color: 'var(--dz-text-primary)', letterSpacing: '-0.075px' }}
          >
            {debt.name}
          </p>

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

            <span
              className="font-mono"
              style={{ fontSize: '11px', letterSpacing: '0.44px', color: 'var(--dz-text-faint)' }}
            >
              {isPaid ? (
                <span style={{ color: 'var(--dz-income)', fontWeight: 600 }}>LIQUIDADA</span>
              ) : (
                <>
                  Interés mensual estimado:{' '}
                  <span style={{ color: 'var(--dz-expense)', fontWeight: 600 }}>
                    {fmt(debt.monthlyInterest)}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 shrink-0" style={{ minWidth: '180px' }}>
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
                {debt.monthlyRate}%
              </span>
              <span
                className="font-mono"
                style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}
              >
                /mes
              </span>
              <span
                className="font-mono"
                style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}
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
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--dz-expense)' }}>
                {fmt(debt.monthlyInterest)} interés
              </span>
            </div>
          </div>
        </div>

        {!isPaid && (
          <div className="flex flex-col justify-between shrink-0 self-stretch">
            <div />
            <Button
              variant="ghost"
              size="sm"
              disabled={isBusy}
              onClick={() => onLiquidar?.(debt.id)}
              style={{ color: 'var(--dz-signature)', borderColor: 'rgba(94,225,230,0.25)' }}
            >
              {isPatching ? 'Liquidando…' : 'Liquidar'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
