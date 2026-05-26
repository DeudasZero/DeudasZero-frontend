import type { FC } from 'react'
import type { useTransactions } from '../hooks/useTransactions.ts'

const CARD: React.CSSProperties = {
  background: 'rgb(13,20,25)',
  borderRadius: '12px',
  border: '1px solid rgba(220,235,255,0.06)',
}

interface TransactionSummaryCardsProps {
  data: ReturnType<typeof useTransactions>['data']
}

export const TransactionSummaryCards: FC<TransactionSummaryCardsProps> = ({ data }) => {
  if (!data) return null
  const { summary } = data
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      {/* Ingresos */}
      <div style={{ ...CARD, padding: '24px' }}>
        <div
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: 'var(--dz-text-faint)',
            marginBottom: '8px',
          }}
        >
          INGRESOS · {summary.month}
        </div>
        <div
          style={{
            fontFamily: 'var(--dz-font-display, var(--dz-font-sans))',
            fontSize: '36px',
            fontWeight: 500,
            letterSpacing: '-0.4px',
            color: 'rgb(94,225,230)',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '10px',
          }}
        >
          +${new Intl.NumberFormat('es-CO').format(summary.totalIncome)}
        </div>
        {summary.incomeSources.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {summary.incomeSources.map(({ label, amount }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: '12px',
                  color: 'var(--dz-text-faint)',
                }}
              >
                <span>{label}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  ${new Intl.NumberFormat('es-CO').format(amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gastos */}
      <div style={{ ...CARD, padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: 'var(--dz-text-faint)',
            }}
          >
            GASTOS · {summary.month}
          </span>
          {summary.expenseRatio > 0 && (
            <span
              style={{
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '11.5px',
                fontWeight: 600,
                color: summary.expenseRatio > 80 ? 'rgb(224,122,156)' : 'rgb(141,232,184)',
              }}
            >
              {summary.expenseRatio}% del ingreso
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: 'var(--dz-font-display, var(--dz-font-sans))',
            fontSize: '36px',
            fontWeight: 500,
            letterSpacing: '-0.4px',
            color: 'rgb(232,238,245)',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '10px',
          }}
        >
          −${new Intl.NumberFormat('es-CO').format(summary.totalExpenses)}
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '12.5px',
            color: 'rgb(172,183,196)',
            lineHeight: 1.45,
          }}
        >
          {summary.totalIncome > 0 ? (
            <>
              Equivale al{' '}
              <span
                style={{
                  color: summary.expenseRatio > 80 ? 'rgb(224,122,156)' : 'rgb(141,232,184)',
                  fontWeight: 600,
                }}
              >
                {summary.expenseRatio}%
              </span>{' '}
              de tus ingresos
            </>
          ) : (
            'Sin ingresos registrados este mes'
          )}
        </p>
      </div>
    </div>
  )
}
