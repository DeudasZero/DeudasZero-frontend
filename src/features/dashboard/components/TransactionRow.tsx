import type { FC } from 'react'
import type { Transaction } from '../types/dashboard.types.ts'

interface TransactionRowProps {
  transaction: Transaction
}

// Icono ↑ ingresos
const IncomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M7 17L17 7M17 7H10M17 7V14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Icono ↓ gastos/deudas
const ExpenseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M17 7L7 17M7 17H14M7 17V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ICON_STYLE: Record<Transaction['type'], { bg: string; color: string }> = {
  income: { bg: 'rgba(94, 225, 230, 0.12)', color: '#5EE1E6' },
  expense: { bg: 'rgba(224, 122, 156, 0.14)', color: '#E07A9C' },
  saving: { bg: 'rgba(141, 232, 184, 0.14)', color: '#8DE8B8' },
  debt: { bg: 'rgba(224, 122, 156, 0.14)', color: '#E07A9C' },
}

const BADGE_STYLE: Record<Transaction['type'], { bg: string; color: string; label: string }> = {
  income: { bg: 'rgba(94, 225, 230, 0.12)', color: '#5EE1E6', label: 'Ingreso' },
  expense: { bg: 'rgba(224, 122, 156, 0.14)', color: '#E07A9C', label: 'Gasto' },
  saving: { bg: 'rgba(141, 232, 184, 0.14)', color: '#8DE8B8', label: 'Ahorro' },
  debt: { bg: 'rgba(224, 122, 156, 0.14)', color: '#E07A9C', label: 'Deuda' },
}

const AMOUNT_COLOR: Record<Transaction['type'], string> = {
  income: '#5EE1E6',
  expense: '#E07A9C',
  saving: '#8DE8B8',
  debt: '#E07A9C',
}

function formatCOP(amount: number): string {
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

export const TransactionRow: FC<TransactionRowProps> = ({ transaction }) => {
  const { name, category, type, paymentMethod, date, amount } = transaction
  const icon = ICON_STYLE[type]
  const badge = BADGE_STYLE[type]
  const isIncome = amount >= 0

  return (
    <tr
      style={{ borderBottom: '1px solid rgba(220, 235, 255, 0.05)', cursor: 'pointer' }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background = 'rgba(220,235,255,0.02)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
      }}
    >
      {/* Nombre + icono + categoría */}
      <td style={{ padding: '14px 24px', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Icono 32×32 */}
          <div
            aria-hidden
            style={{
              flexShrink: 0,
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: icon.bg,
              color: icon.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isIncome ? <IncomeIcon /> : <ExpenseIcon />}
          </div>

          {/* Texto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
            <span
              style={{
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'rgb(232, 238, 245)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '11.5px',
                color: 'rgb(110, 121, 134)',
              }}
            >
              {category}
            </span>
          </div>
        </div>
      </td>

      {/* Badge tipo */}
      <td style={{ padding: '14px 24px', verticalAlign: 'middle' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 10px',
            borderRadius: '6px',
            background: badge.bg,
            color: badge.color,
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '11.5px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {badge.label}
        </span>
      </td>

      {/* Método */}
      <td style={{ padding: '14px 24px', verticalAlign: 'middle' }}>
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '12px',
            letterSpacing: '0.24px',
            color: 'rgb(172, 183, 196)',
          }}
        >
          {paymentMethod}
        </span>
      </td>

      {/* Fecha */}
      <td style={{ padding: '14px 24px', verticalAlign: 'middle' }}>
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '12px',
            letterSpacing: '0.24px',
            color: 'rgb(110, 121, 134)',
          }}
        >
          {date}
        </span>
      </td>

      {/* Monto */}
      <td style={{ padding: '14px 24px', verticalAlign: 'middle', textAlign: 'right' }}>
        <span
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            fontVariantNumeric: 'tabular-nums',
            color: AMOUNT_COLOR[type],
          }}
        >
          {formatCOP(amount)}
        </span>
      </td>
    </tr>
  )
}
