import type { FC } from 'react'
import { CARD } from './DashboardPage.tsx'

interface DistributionCardProps {
  expenses: number
  available: number
  isLoading?: boolean
}

function cop(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace('COP', '$')
    .trim()
}

export const DistributionCard: FC<DistributionCardProps> = ({
  expenses,
  available,
  isLoading = false,
}) => {
  const total = expenses + available
  const expPct = total > 0 ? Math.round((expenses / total) * 100) : 47
  const avlPct = 100 - expPct

  return (
    <div
      style={{ ...CARD, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <span
        style={{
          fontFamily: 'var(--dz-font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '1.54px',
          textTransform: 'uppercase',
          color: 'rgb(110, 121, 134)',
        }}
      >
        Distribución del Ingreso
      </span>

      {isLoading ? (
        <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(220,235,255,0.06)' }} />
      ) : (
        <>
          {/* Bar */}
          <div
            style={{
              display: 'flex',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
              gap: '2px',
            }}
          >
            <div
              style={{
                width: `${expPct}%`,
                background: 'var(--dz-expense)',
                transition: 'width 0.4s ease',
              }}
            />
            <div
              style={{ flex: 1, background: 'var(--dz-signature)', transition: 'flex 0.4s ease' }}
            />
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { label: 'Gastos', pct: expPct, amount: expenses, color: 'var(--dz-expense)' },
              { label: 'Disponible', pct: avlPct, amount: available, color: 'var(--dz-signature)' },
            ].map(({ label, pct, amount, color }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '12px',
                      color: 'rgb(172, 183, 196)',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-mono)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color,
                    }}
                  >
                    {pct}%
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: '13px',
                    color: 'var(--dz-text-primary)',
                  }}
                >
                  {cop(amount)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
