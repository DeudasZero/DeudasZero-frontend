import type { FC } from 'react'
import { Icon } from '@atoms/icon/Icon.tsx'
import { IncomeIcon, ExpenseIcon } from '@/assets/icons/index.ts'
import { IconButton } from '@atoms/icon-button/IconButton.tsx'
import { TrashIcon } from '@/assets/icons/index.ts'
import type { Transaction } from '../types/transactions.types.ts'

const CAT_BG: Record<string, string> = {
  Salario: 'rgba(94,225,230,0.12)',
  Freelance: 'rgba(141,232,184,0.12)',
  Otros: 'rgba(154,160,166,0.12)',
  Gasto: 'rgba(224,122,156,0.12)',
}

const CAT_COLOR: Record<string, string> = {
  Salario: 'rgb(94,225,230)',
  Freelance: 'rgb(141,232,184)',
  Otros: 'rgb(154,160,166)',
  Gasto: 'rgb(224,122,156)',
}

interface TransactionRowProps {
  tx: Transaction
  isDeleting: boolean
  onDelete: (tx: Transaction) => void
}

export const TransactionRow: FC<TransactionRowProps> = ({ tx, isDeleting, onDelete }) => {
  const isIncome = tx.type === 'income'
  const iconBg = isIncome ? 'rgba(94,225,230,0.12)' : 'rgba(224,122,156,0.14)'
  const iconColor = isIncome ? 'rgb(94,225,230)' : 'rgb(224,122,156)'
  const amtColor = isIncome ? 'rgb(94,225,230)' : 'rgb(232,238,245)'

  return (
    <tr
      style={{
        borderBottom: '1px solid rgba(220,235,255,0.05)',
        opacity: isDeleting ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background = 'rgba(220,235,255,0.02)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
      }}
    >
      {/* Concepto */}
      <td style={{ padding: '14px 24px', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: iconBg,
              color: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isIncome ? <Icon as={IncomeIcon} size={14} /> : <Icon as={ExpenseIcon} size={14} />}
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgb(232,238,245)',
              }}
            >
              {tx.name}
            </span>
            <div
              style={{
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '11.5px',
                color: 'var(--dz-text-faint)',
                marginTop: '2px',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '1px 7px',
                  borderRadius: '4px',
                  background: CAT_BG[tx.category] ?? 'rgba(154,160,166,0.14)',
                  color: CAT_COLOR[tx.category] ?? 'rgb(154,160,166)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {tx.category}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Fecha */}
      <td style={{ padding: '14px 24px', verticalAlign: 'middle' }}>
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '12px',
            color: 'var(--dz-text-faint)',
          }}
        >
          {tx.date}
        </span>
      </td>

      {/* Monto */}
      <td style={{ padding: '14px 24px', verticalAlign: 'middle', textAlign: 'right' }}>
        <span
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '13px',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            color: amtColor,
          }}
        >
          {isIncome ? '+' : '-'}${new Intl.NumberFormat('es-CO').format(tx.amount)}
        </span>
      </td>

      {/* Acciones */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
        <IconButton
          onClick={() => onDelete(tx)}
          disabled={isDeleting}
          label={`Eliminar ${tx.name}`}
          title="Eliminar"
          hoverBorder="rgba(224,122,156,0.4)"
          hoverColor="var(--dz-expense)"
        >
          <Icon as={TrashIcon} size={13} />
        </IconButton>
      </td>
    </tr>
  )
}
