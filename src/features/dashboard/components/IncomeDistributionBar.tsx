import type { FC } from 'react'

interface IncomeDistributionBarProps {
  expenses: number // amount
  available: number // amount
  isLoading?: boolean
}

function formatCOP(n: number) {
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

export const IncomeDistributionBar: FC<IncomeDistributionBarProps> = ({
  expenses,
  available,
  isLoading = false,
}) => {
  const total = expenses + available
  const expensePct = total > 0 ? Math.round((expenses / total) * 100) : 0
  const availablePct = 100 - expensePct

  return (
    <div
      style={{
        background: 'var(--dz-bg-card)',
        border: '1px solid var(--dz-border-soft)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header */}
      <span
        style={{
          fontFamily: 'var(--dz-font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '1.54px',
          textTransform: 'uppercase',
          color: 'var(--dz-text-faint)',
        }}
      >
        Distribución del Ingreso
      </span>

      {/* Progress bar */}
      {isLoading ? (
        <div
          style={{
            height: '8px',
            borderRadius: '4px',
            background: 'var(--dz-bg-raised)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ) : (
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
              width: `${expensePct}%`,
              background: 'var(--dz-expense)',
              borderRadius: '4px 0 0 4px',
              transition: 'width 0.4s ease',
            }}
          />
          <div
            style={{
              flex: 1,
              background: 'var(--dz-signature)',
              borderRadius: '0 4px 4px 0',
              transition: 'flex 0.4s ease',
            }}
          />
        </div>
      )}

      {/* Legend */}
      {!isLoading && (
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'Gastos', pct: expensePct, amount: expenses, color: 'var(--dz-expense)' },
            {
              label: 'Disponible',
              pct: availablePct,
              amount: available,
              color: 'var(--dz-signature)',
            },
          ].map(({ label, pct, amount, color }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
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
                    color: 'var(--dz-text-muted)',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: '11.5px',
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
                  color: 'var(--dz-text-secondary)',
                  letterSpacing: '-0.2px',
                }}
              >
                {formatCOP(amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
