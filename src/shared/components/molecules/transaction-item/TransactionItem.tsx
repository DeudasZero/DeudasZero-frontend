import type { CSSProperties, FC } from 'react'
import { Money } from '@atoms/money/Money.tsx'
import { Badge } from '@atoms/badge/Badge.tsx'
import type { TransactionItemProps, TransactionType } from './TransactionItem.types.ts'
import { TRANSACTION_ACCENT } from './TransactionItem.types.ts'

const TYPE_ICON: Record<TransactionType, string> = {
  income: '↓',
  expense: '↑',
  saving: '⬡',
  debt: '↻',
}

const TYPE_LABEL: Record<TransactionType, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  saving: 'Ahorro',
  debt: 'Deuda',
}

const ACCENT_COLOR: Record<TransactionType, string> = {
  income: 'var(--dz-income)',
  expense: 'var(--dz-expense)',
  saving: 'var(--dz-saving)',
  debt: 'var(--dz-debt)',
}

const ACCENT_TINT: Record<TransactionType, string> = {
  income: 'var(--dz-tint-income)',
  expense: 'var(--dz-tint-expense)',
  saving: 'var(--dz-tint-saving)',
  debt: 'var(--dz-tint-debt)',
}

export const TransactionItem: FC<TransactionItemProps> = ({
  title,
  category,
  date,
  amount,
  type,
  currency = 'COP',
  locale = 'es-CO',
  note,
  onClick,
  className,
}) => {
  const isInteractive = Boolean(onClick)
  const accent = TRANSACTION_ACCENT[type]

  const rootStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: 'var(--dz-r-sm)',
    cursor: isInteractive ? 'pointer' : undefined,
    width: '100%',
    textAlign: 'left',
    transition: isInteractive ? 'background var(--dz-transition-fast)' : undefined,
  }

  const content = (
    <>
      {/* Type icon */}
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: 'var(--dz-r-sm)',
          background: ACCENT_TINT[type],
          border: `1px solid ${ACCENT_COLOR[type]}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: ACCENT_COLOR[type],
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {TYPE_ICON[type]}
      </span>

      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-body)',
            fontWeight: 500,
            color: 'var(--dz-text-primary)',
            letterSpacing: 'var(--dz-ls-normal)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: '2px 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-caption)',
            color: 'var(--dz-text-faint)',
            letterSpacing: '-0.005em',
          }}
        >
          {date}
          {category && (
            <>
              <span aria-hidden>·</span>
              <span style={{ color: 'var(--dz-text-muted)' }}>{category}</span>
            </>
          )}
          {note && (
            <>
              <span aria-hidden>·</span>
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px',
                  color: 'var(--dz-text-faint)',
                  fontStyle: 'italic',
                }}
              >
                {note}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Amount + badge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        <Money
          amount={type === 'expense' || type === 'debt' ? -amount : amount}
          currency={currency}
          locale={locale}
          variant="body"
          accent={accent}
          showSign
        />
        <Badge accent={accent} size="xs">
          {TYPE_LABEL[type]}
        </Badge>
      </div>
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
