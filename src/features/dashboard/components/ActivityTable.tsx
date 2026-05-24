import type { FC } from 'react'
import { CARD } from './DashboardPage.tsx'
import type { Transaction } from '../types/dashboard.types.ts'

interface ActivityTableProps {
  transactions: Transaction[]
  isLoading?: boolean
}

const IncomeArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M7 17L17 7M17 7H10M17 7V14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const ExpenseArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M17 7L7 17M7 17H14M7 17V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const TYPE_ICON: Record<Transaction['type'], { bg: string; color: string }> = {
  income: { bg: 'rgba(94,225,230,0.12)', color: '#5EE1E6' },
  expense: { bg: 'rgba(224,122,156,0.14)', color: '#E07A9C' },
  saving: { bg: 'rgba(141,232,184,0.14)', color: '#8DE8B8' },
  debt: { bg: 'rgba(224,122,156,0.14)', color: '#E07A9C' },
}

const TYPE_BADGE: Record<Transaction['type'], { bg: string; color: string; label: string }> = {
  income: { bg: 'rgba(94,225,230,0.12)', color: '#5EE1E6', label: 'Ingreso' },
  expense: { bg: 'rgba(224,122,156,0.14)', color: '#E07A9C', label: 'Gasto' },
  saving: { bg: 'rgba(141,232,184,0.14)', color: '#8DE8B8', label: 'Ahorro' },
  debt: { bg: 'rgba(224,122,156,0.14)', color: '#E07A9C', label: 'Deuda' },
}

const AMOUNT_COLOR: Record<Transaction['type'], string> = {
  income: 'rgb(94, 225, 230)',
  expense: 'rgb(224, 122, 156)',
  saving: 'rgb(141, 232, 184)',
  debt: 'rgb(224, 122, 156)',
}

function formatAmount(amount: number): string {
  const abs = Math.abs(amount)
  const str = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(abs)
    .replace('COP', '')
    .trim()
  return (amount >= 0 ? '+$' : '−$') + str
}

const SKELETON_ROW: FC = () => (
  <tr style={{ borderBottom: '1px solid rgba(220,235,255,0.05)' }}>
    <td style={{ padding: '14px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(220,235,255,0.06)',
            flexShrink: 0,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div
            style={{
              width: 120,
              height: 10,
              borderRadius: 3,
              background: 'rgba(220,235,255,0.06)',
            }}
          />
          <div
            style={{ width: 70, height: 9, borderRadius: 3, background: 'rgba(220,235,255,0.04)' }}
          />
        </div>
      </div>
    </td>
    {[60, 60, 50, 80].map((w, i) => (
      <td key={i} style={{ padding: '14px 20px' }}>
        <div
          style={{
            height: 10,
            width: w,
            borderRadius: 3,
            background: 'rgba(220,235,255,0.06)',
            marginLeft: i === 3 ? 'auto' : 0,
          }}
        />
      </td>
    ))}
  </tr>
)

export const ActivityTable: FC<ActivityTableProps> = ({ transactions, isLoading = false }) => (
  <div style={{ ...CARD, overflow: 'hidden' }}>
    {/* Header */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(220,235,255,0.05)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--dz-font-mono)',
          fontSize: '11px',
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          color: 'rgb(110, 121, 134)',
        }}
      >
        ACTIVIDAD RECIENTE
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '13.5px',
            fontWeight: 600,
            color: 'var(--dz-text-primary)',
          }}
        >
          Últimos movimientos
        </span>
        <button
          type="button"
          style={{
            padding: '4px 10px',
            background: 'rgba(220,235,255,0.06)',
            border: '1px solid rgba(220,235,255,0.08)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '12px',
            color: 'rgb(172,183,196)',
          }}
        >
          Filtrar
        </button>
        <button
          type="button"
          style={{
            padding: '4px 10px',
            background: 'rgba(220,235,255,0.06)',
            border: '1px solid rgba(220,235,255,0.08)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '12px',
            color: 'rgb(172,183,196)',
          }}
        >
          Ver todo
        </button>
      </div>
    </div>

    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {/* Column headers */}
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(220,235,255,0.05)' }}>
            {[
              ['Movimiento', '38%', 'left'],
              ['Categoría', '14%', 'left'],
              ['Método', '16%', 'left'],
              ['Fecha', '12%', 'left'],
              ['Monto', '20%', 'right'],
            ].map(([label, w, align]) => (
              <th
                key={label}
                style={{
                  padding: '10px 20px',
                  textAlign: align as 'left' | 'right',
                  width: w,
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: 'rgb(70, 80, 91)',
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <SKELETON_ROW key={i} />)
            : transactions.map((tx) => {
                const icon = TYPE_ICON[tx.type]
                const badge = TYPE_BADGE[tx.type]
                return (
                  <tr
                    key={tx.id}
                    style={{ borderBottom: '1px solid rgba(220,235,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLTableRowElement).style.background =
                        'rgba(220,235,255,0.02)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
                    }}
                  >
                    {/* Movimiento */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: icon.bg,
                            color: icon.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {tx.amount >= 0 ? <IncomeArrow /> : <ExpenseArrow />}
                        </div>
                        <div
                          style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--dz-font-sans)',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: 'rgb(232,238,245)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {tx.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* Categoría */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          background: badge.bg,
                          color: badge.color,
                          fontFamily: 'var(--dz-font-sans)',
                          fontSize: '11.5px',
                          fontWeight: 600,
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    {/* Método */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontFamily: 'var(--dz-font-mono)',
                          fontSize: '12px',
                          letterSpacing: '0.24px',
                          color: 'rgb(172,183,196)',
                        }}
                      >
                        {tx.paymentMethod}
                      </span>
                    </td>
                    {/* Fecha */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontFamily: 'var(--dz-font-mono)',
                          fontSize: '12px',
                          letterSpacing: '0.24px',
                          color: 'rgb(110,121,134)',
                        }}
                      >
                        {tx.date}
                      </span>
                    </td>
                    {/* Monto */}
                    <td
                      style={{ padding: '14px 20px', verticalAlign: 'middle', textAlign: 'right' }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--dz-font-sans)',
                          fontSize: '13px',
                          fontWeight: 600,
                          letterSpacing: '-0.13px',
                          fontVariantNumeric: 'tabular-nums',
                          color: AMOUNT_COLOR[tx.type],
                        }}
                      >
                        {formatAmount(tx.amount)}
                      </span>
                    </td>
                  </tr>
                )
              })}
        </tbody>
      </table>
    </div>
  </div>
)
