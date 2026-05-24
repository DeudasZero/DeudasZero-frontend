import type { FC } from 'react'
import { CARD } from './DashboardPage.tsx'

interface FlowCardProps {
  label: string
  value: string
  isLoading?: boolean
}

export const FlowCard: FC<FlowCardProps> = ({ label, value, isLoading = false }) => (
  <div style={{ ...CARD, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <span
      style={{
        fontFamily: 'var(--dz-font-mono)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '1.54px',
        textTransform: 'uppercase',
        color: 'var(--dz-signature)',
      }}
    >
      {label}
    </span>

    {isLoading ? (
      <div
        style={{
          height: '72px',
          width: '260px',
          borderRadius: '6px',
          background: 'rgba(220,235,255,0.06)',
        }}
      />
    ) : (
      <div
        style={{
          fontFamily: 'var(--dz-font-display)',
          fontSize: '72px',
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

    {!isLoading && (
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--dz-font-sans)',
          fontSize: '13.5px',
          lineHeight: 1.5,
          color: 'rgb(172, 183, 196)',
        }}
      >
        Lo que te queda después de gastos del mes. La IA recomienda destinarlo a tu deuda con tasa
        más alta — <span style={{ color: 'var(--dz-signature)' }}>Visa Bancolombia (3.1%/mes)</span>
        .
      </p>
    )}
  </div>
)
