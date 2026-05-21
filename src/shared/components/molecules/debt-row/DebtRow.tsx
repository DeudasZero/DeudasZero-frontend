import type { CSSProperties, FC } from 'react'
import { Badge } from '@atoms/badge/Badge.tsx'
import { Money } from '@atoms/money/Money.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
import type { DebtRowProps, DebtStatus } from './DebtRow.types.ts'

const STATUS_LABEL: Record<DebtStatus, string> = {
  active: 'Activa',
  paused: 'Pausada',
  paid: 'Pagada',
}

const STATUS_ACCENT = {
  active: 'debt',
  paused: 'neutral',
  paid: 'income',
} as const

export const DebtRow: FC<DebtRowProps> = ({
  name,
  creditor,
  balance,
  totalDebt,
  nextPayment,
  nextPaymentDate,
  interestRate,
  status = 'active',
  currency = 'COP',
  locale = 'es-CO',
  onClick,
  className,
}) => {
  const paid = Math.max(0, totalDebt - balance)
  const progress = totalDebt > 0 ? Math.round((paid / totalDebt) * 100) : 0
  const isInteractive = Boolean(onClick)

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: 'var(--dz-sp-4) var(--dz-sp-5)',
    background: 'var(--dz-bg-surface)',
    border: '1px solid var(--dz-border-base)',
    borderRadius: 'var(--dz-r-md)',
    cursor: isInteractive ? 'pointer' : undefined,
    transition: isInteractive
      ? 'border-color var(--dz-transition-fast), background var(--dz-transition-fast)'
      : undefined,
    textAlign: 'left',
    width: '100%',
  }

  const content = (
    <>
      {/* Top row: name + status + balance */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-body)',
              fontWeight: 600,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-normal)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </p>
          <p
            style={{
              margin: '2px 0 0',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              color: 'var(--dz-text-muted)',
              letterSpacing: '-0.005em',
            }}
          >
            {creditor}
            {interestRate !== undefined && (
              <span style={{ marginLeft: '8px', color: 'var(--dz-text-faint)' }}>
                · {interestRate}% EA
              </span>
            )}
          </p>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}
        >
          <Money amount={balance} currency={currency} locale={locale} variant="h3" accent="debt" />
          <Badge accent={STATUS_ACCENT[status]} size="xs" dot>
            {STATUS_LABEL[status]}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <ProgressBar value={progress} accent="debt" size="xs" />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '11px',
              color: 'var(--dz-text-faint)',
              letterSpacing: '0.02em',
            }}
          >
            {progress}% pagado
          </span>
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '11px',
              color: 'var(--dz-text-faint)',
              letterSpacing: '0.02em',
            }}
          >
            <Money amount={totalDebt} currency={currency} locale={locale} variant="caption" /> total
          </span>
        </div>
      </div>

      {/* Next payment */}
      {nextPayment !== undefined && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 10px',
            background: 'var(--dz-bg-raised)',
            borderRadius: 'var(--dz-r-sm)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              color: 'var(--dz-text-muted)',
            }}
          >
            Próximo pago
            {nextPaymentDate && (
              <span style={{ marginLeft: '6px', color: 'var(--dz-text-faint)' }}>
                · {nextPaymentDate}
              </span>
            )}
          </span>
          <Money
            amount={nextPayment}
            currency={currency}
            locale={locale}
            variant="caption"
            accent="debt"
          />
        </div>
      )}
    </>
  )

  if (isInteractive) {
    return (
      <button type="button" style={rootStyle} className={className} onClick={onClick}>
        {content}
      </button>
    )
  }

  return (
    <div style={rootStyle} className={className}>
      {content}
    </div>
  )
}
