import type { FC } from 'react'
import { CARD } from './DashboardPage.tsx'

interface StatCardProps {
  label: string
  value: string
  trend?: string | undefined
  trendLabel?: string | undefined
  trendUp?: boolean | undefined
  badge?: string | undefined
  isLoading?: boolean | undefined
}

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const StatCard: FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendLabel,
  trendUp,
  badge,
  isLoading = false,
}) => (
  <div style={{ ...CARD, padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '12.5px',
            fontWeight: 600,
            color: 'var(--dz-text-primary)',
          }}
        >
          {label}
        </span>
        {badge && (
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.46px',
              textTransform: 'uppercase',
              color: 'rgb(240, 181, 122)',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 9px',
          background: 'transparent',
          border: '1px solid rgba(220,235,255,0.1)',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'var(--dz-font-sans)',
          fontSize: '11.5px',
          color: 'rgb(172, 183, 196)',
        }}
      >
        <PlusIcon /> Agregar
      </button>
    </div>

    {/* Value */}
    {isLoading ? (
      <div
        style={{
          height: '32px',
          width: '140px',
          borderRadius: '4px',
          background: 'rgba(220,235,255,0.06)',
        }}
      />
    ) : (
      <div
        style={{
          fontFamily: 'var(--dz-font-display)',
          fontSize: '32px',
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: '-0.4px',
          color: 'var(--dz-text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    )}

    {/* Trend */}
    {trend && !isLoading && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '11.5px',
            fontWeight: 600,
            letterSpacing: '0.23px',
            color: trendUp ? 'var(--dz-signature)' : 'var(--dz-expense)',
          }}
        >
          {trend}
        </span>
        {trendLabel && (
          <span
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '11.5px',
              color: 'rgb(110, 121, 134)',
            }}
          >
            {trendLabel}
          </span>
        )}
      </div>
    )}
  </div>
)
