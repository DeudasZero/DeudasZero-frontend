import type { CSSProperties, FC } from 'react'
import type { MoneyProps, MoneyVariant } from './Money.types.ts'
import type { DZAccent } from '../tokens/types.ts'

const VARIANT_STYLES: Record<MoneyVariant, CSSProperties> = {
  display: {
    fontSize: 'var(--dz-fs-display)',
    fontWeight: 500,
    letterSpacing: 'var(--dz-ls-tight)',
    lineHeight: 1,
  },
  h1: {
    fontSize: 'var(--dz-fs-h1)',
    fontWeight: 600,
    letterSpacing: 'var(--dz-ls-snug)',
    lineHeight: 1,
  },
  h2: {
    fontSize: 'var(--dz-fs-h2)',
    fontWeight: 600,
    letterSpacing: 'var(--dz-ls-snug)',
    lineHeight: 1,
  },
  h3: {
    fontSize: 'var(--dz-fs-h3)',
    fontWeight: 500,
    letterSpacing: 'var(--dz-ls-normal)',
    lineHeight: 1,
  },
  body: {
    fontSize: 'var(--dz-fs-body)',
    fontWeight: 400,
    letterSpacing: 'var(--dz-ls-normal)',
    lineHeight: 1,
  },
  caption: {
    fontSize: 'var(--dz-fs-caption)',
    fontWeight: 400,
    letterSpacing: 'var(--dz-ls-normal)',
    lineHeight: 1,
  },
}

const ACCENT_COLOR: Record<DZAccent, string> = {
  signature: 'var(--dz-signature)',
  income: 'var(--dz-income)',
  expense: 'var(--dz-expense)',
  saving: 'var(--dz-saving)',
  debt: 'var(--dz-debt)',
  neutral: 'var(--dz-text-primary)',
}

export const Money: FC<MoneyProps> = ({
  amount,
  currency = 'COP',
  locale = 'es-CO',
  variant = 'body',
  showSign = false,
  dimCents = false,
  accent,
  className,
}) => {
  const isNegative = amount < 0
  const abs = Math.abs(amount)

  const fmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const formatted = fmt.format(abs)

  const color = accent
    ? ACCENT_COLOR[accent]
    : isNegative
      ? 'var(--dz-expense)'
      : 'var(--dz-text-primary)'

  const sign = showSign ? (isNegative ? '−' : amount > 0 ? '+' : '') : isNegative ? '−' : ''

  // Split cents for dimCents (only relevant when currency uses decimals)
  const fmtDecimals = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const withDecimals = fmtDecimals.format(abs)
  const decimalSep = (1.1).toLocaleString(locale).replace(/\d/g, '')
  const hasCents = withDecimals.includes(decimalSep)
  const parts = dimCents && hasCents ? withDecimals.split(new RegExp(`(${decimalSep}\\d+)`)) : null

  return (
    <span
      className={className}
      style={{
        ...VARIANT_STYLES[variant],
        fontFamily: 'var(--dz-font-sans)',
        fontVariantNumeric: 'tabular-nums',
        color,
        display: 'inline',
      }}
    >
      {sign}
      {parts ? (
        <>
          {parts[0]}
          <span style={{ opacity: 0.45 }}>{parts[1]}</span>
        </>
      ) : (
        formatted
      )}
    </span>
  )
}
