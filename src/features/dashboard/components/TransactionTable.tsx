import type { FC } from 'react'
import type { Transaction } from '../types/dashboard.types.ts'
import { TransactionRow } from './TransactionRow.tsx'

interface TransactionTableProps {
  transactions: Transaction[]
  isLoading?: boolean
}

const COLUMNS = [
  { key: 'tx', label: 'Transacción', width: '36%' },
  { key: 'type', label: 'Tipo', width: '12%' },
  { key: 'method', label: 'Método', width: '18%' },
  { key: 'date', label: 'Fecha', width: '14%' },
  { key: 'amount', label: 'Monto', width: '20%', align: 'right' as const },
]

const SkeletonRow: FC = () => (
  <tr style={{ borderBottom: '1px solid rgba(220, 235, 255, 0.05)' }}>
    <td style={{ padding: '14px 24px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              width: 120,
              height: 10,
              borderRadius: 4,
              background: 'rgba(220,235,255,0.06)',
            }}
          />
          <div
            style={{ width: 70, height: 9, borderRadius: 4, background: 'rgba(220,235,255,0.04)' }}
          />
        </div>
      </div>
    </td>
    <td style={{ padding: '14px 24px' }}>
      <div
        style={{ width: 56, height: 22, borderRadius: 6, background: 'rgba(220,235,255,0.06)' }}
      />
    </td>
    <td style={{ padding: '14px 24px' }}>
      <div
        style={{ width: 70, height: 10, borderRadius: 4, background: 'rgba(220,235,255,0.06)' }}
      />
    </td>
    <td style={{ padding: '14px 24px' }}>
      <div
        style={{ width: 48, height: 10, borderRadius: 4, background: 'rgba(220,235,255,0.06)' }}
      />
    </td>
    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
      <div
        style={{
          width: 80,
          height: 10,
          borderRadius: 4,
          background: 'rgba(220,235,255,0.06)',
          marginLeft: 'auto',
        }}
      />
    </td>
  </tr>
)

export const TransactionTable: FC<TransactionTableProps> = ({
  transactions,
  isLoading = false,
}) => (
  <div
    style={{
      background: 'var(--dz-bg-card)',
      border: '1px solid rgba(220, 235, 255, 0.05)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}
  >
    {/* Table header */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(220, 235, 255, 0.05)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--dz-font-sans)',
          fontSize: '13.5px',
          fontWeight: 600,
          color: 'rgb(232, 238, 245)',
        }}
      >
        Transacciones recientes
      </span>
      <span
        style={{
          fontFamily: 'var(--dz-font-mono)',
          fontSize: '11px',
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          color: 'var(--dz-text-faint)',
        }}
      >
        {isLoading ? '...' : `${transactions.length} registros`}
      </span>
    </div>

    {/* Table */}
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(220, 235, 255, 0.05)' }}>
            {COLUMNS.map(({ key, label, width, align }) => (
              <th
                key={key}
                style={{
                  padding: '10px 24px',
                  textAlign: align ?? 'left',
                  width,
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: 'var(--dz-text-faint)',
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center' }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--dz-font-sans)',
                    fontSize: '13.5px',
                    color: 'var(--dz-text-faint)',
                  }}
                >
                  No hay transacciones recientes
                </p>
              </td>
            </tr>
          ) : (
            transactions.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)
          )}
        </tbody>
      </table>
    </div>
  </div>
)
