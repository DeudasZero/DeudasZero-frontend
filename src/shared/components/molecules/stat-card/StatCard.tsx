import type { CSSProperties, FC } from 'react'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import type { StatCardProps, StatCardTrend } from './StatCard.types.ts'
import type { DZAccent } from '@atoms/tokens/types.ts'

const ACCENT_COLOR: Record<DZAccent, string> = {
  signature: 'var(--dz-signature)',
  income: 'var(--dz-income)',
  expense: 'var(--dz-expense)',
  saving: 'var(--dz-saving)',
  debt: 'var(--dz-debt)',
  neutral: 'var(--dz-text-muted)',
}

const ACCENT_TINT: Record<DZAccent, string> = {
  signature: 'var(--dz-tint-signature)',
  income: 'var(--dz-tint-income)',
  expense: 'var(--dz-tint-expense)',
  saving: 'var(--dz-tint-saving)',
  debt: 'var(--dz-tint-debt)',
  neutral: 'rgba(255,255,255,0.04)',
}

const TREND_COLOR: Record<StatCardTrend, string> = {
  up: 'var(--dz-income)',
  down: 'var(--dz-expense)',
  neutral: 'var(--dz-text-muted)',
}

const TREND_ICON: Record<StatCardTrend, string> = {
  up: '↑',
  down: '↓',
  neutral: '→',
}

export const StatCard: FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendLabel,
  accent = 'signature',
  icon,
  loading = false,
  onClick,
  className,
}) => {
  const isInteractive = Boolean(onClick)
  const accentColor = ACCENT_COLOR[accent]
  const accentTint = ACCENT_TINT[accent]

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: 'var(--dz-sp-5)',
    background: 'var(--dz-bg-surface)',
    border: '1px solid var(--dz-border-base)',
    borderRadius: 'var(--dz-r-md)',
    cursor: isInteractive ? 'pointer' : undefined,
    transition: isInteractive ? 'border-color var(--dz-transition-fast)' : undefined,
    textAlign: 'left',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  }

  const content = (
    <>
      {/* Accent bar */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: accentColor,
          opacity: 0.7,
        }}
      />

      {/* Label row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: 'var(--dz-fs-eyebrow)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 'var(--dz-ls-eyebrow)',
            color: 'var(--dz-text-muted)',
          }}
        >
          {label}
        </span>

        {icon && (
          <span
            aria-hidden
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--dz-r-sm)',
              background: accentTint,
              color: accentColor,
              flexShrink: 0,
              fontSize: '16px',
            }}
          >
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {loading ? (
          <Skeleton width="60%" height="32px" />
        ) : (
          <div
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-h1)',
              fontWeight: 600,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-tight)',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </div>
        )}

        {trend && trendLabel && !loading && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '11.5px',
              fontWeight: 500,
              color: TREND_COLOR[trend],
              letterSpacing: '0.02em',
            }}
          >
            <span aria-hidden>{TREND_ICON[trend]}</span>
            {trendLabel}
          </span>
        )}
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
