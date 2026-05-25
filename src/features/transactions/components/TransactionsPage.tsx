import { useState, useMemo, useEffect, type FC } from 'react'
import { useTransactions } from '../hooks/useTransactions.ts'
import { NewMovementModal } from './NewMovementModal.tsx'
import { Alert } from '@/shared/components/molecules/alert/index.ts'
import type { Transaction, TxType, NewTransactionForm } from '../types/transactions.types.ts'

const CARD: React.CSSProperties = {
  background: 'rgb(13,20,25)',
  borderRadius: '12px',
  border: '1px solid rgba(220,235,255,0.06)',
}

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

const IncomeArrow = () => (
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

const ExpenseArrow = () => (
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

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const SummaryCards: FC<{ data: ReturnType<typeof useTransactions>['data'] }> = ({ data }) => {
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
            color: 'rgb(110,121,134)',
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
                  color: 'rgb(110,121,134)',
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
              color: 'rgb(110,121,134)',
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

type FilterTab = 'all' | TxType

interface TxRowProps {
  tx: Transaction
  isDeleting: boolean
  onDelete: (tx: Transaction) => void
}

const TxRow: FC<TxRowProps> = ({ tx, isDeleting, onDelete }) => {
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
            {isIncome ? <IncomeArrow /> : <ExpenseArrow />}
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
                color: 'rgb(110,121,134)',
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
          style={{ fontFamily: 'var(--dz-font-mono)', fontSize: '12px', color: 'rgb(110,121,134)' }}
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
        <button
          type="button"
          onClick={() => onDelete(tx)}
          disabled={isDeleting}
          aria-label={`Eliminar ${tx.name}`}
          title="Eliminar"
          style={{
            background: 'transparent',
            border: '1px solid rgba(220,235,255,0.08)',
            borderRadius: '6px',
            padding: '6px',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            color: 'rgb(110,121,134)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
            lineHeight: 0,
            opacity: isDeleting ? 0.4 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isDeleting) {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(224,122,156,0.4)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgb(224,122,156)'
            }
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,235,255,0.08)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgb(110,121,134)'
          }}
        >
          <TrashIcon />
        </button>
      </td>
    </tr>
  )
}

const SkeletonRow = () => (
  <tr style={{ borderBottom: '1px solid rgba(220,235,255,0.05)' }}>
    <td style={{ padding: '14px 24px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'rgba(220,235,255,0.06)',
            flexShrink: 0,
          }}
        />
        <div
          style={{ width: 140, height: 10, borderRadius: 3, background: 'rgba(220,235,255,0.06)' }}
        />
      </div>
    </td>
    <td style={{ padding: '14px 24px' }}>
      <div
        style={{ width: 50, height: 10, borderRadius: 3, background: 'rgba(220,235,255,0.06)' }}
      />
    </td>
    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
      <div
        style={{
          width: 80,
          height: 10,
          borderRadius: 3,
          background: 'rgba(220,235,255,0.06)',
          marginLeft: 'auto',
        }}
      />
    </td>
    <td style={{ padding: '14px 16px' }} />
  </tr>
)

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'income', label: 'Ingresos' },
  { id: 'expense', label: 'Gastos' },
  { id: 'all', label: 'Todos' },
]

export const TransactionsPage: FC = () => {
  const {
    data,
    isLoading,
    isSaving,
    isDeleting,
    error,
    saveError,
    successMessage,
    deleteError,
    save,
    remove,
    dismiss,
  } = useTransactions()

  useEffect(() => {
    if (!successMessage && !deleteError) return
    const timer = setTimeout(() => dismiss(), 4000)
    return () => clearTimeout(timer)
  }, [successMessage, deleteError, dismiss])

  const [tab, setTab] = useState<FilterTab>('income')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<TxType>('income')

  const filtered = useMemo(() => {
    if (!data) return []
    if (tab === 'all') return data.transactions
    return data.transactions.filter((t) => t.type === tab)
  }, [data, tab])

  async function handleSave(form: NewTransactionForm) {
    await save(form)
    setModalOpen(false)
  }

  async function handleDelete(tx: Transaction) {
    if (!confirm(`¿Eliminar "${tx.name}"? Esta acción no se puede deshacer.`)) return
    await remove({ id: tx.id, type: tx.type })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Alertas de feedback */}
      {successMessage && (
        <Alert variant="success" onDismiss={dismiss}>
          {successMessage}
        </Alert>
      )}
      {(deleteError ?? saveError ?? error) && (
        <Alert variant="danger" onDismiss={dismiss}>
          {deleteError ?? saveError ?? error}
        </Alert>
      )}

      {/* Summary */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ ...CARD, height: '160px', padding: '24px' }}>
              <div
                style={{
                  height: '20px',
                  width: '120px',
                  borderRadius: '4px',
                  background: 'rgba(220,235,255,0.06)',
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <SummaryCards data={data} />
      )}

      {/* Tabla de movimientos */}
      <div style={{ ...CARD, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(220,235,255,0.05)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: 'rgb(8,13,18)',
              borderRadius: '6px',
              padding: '3px',
            }}
          >
            {TABS.map(({ id, label }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--dz-font-sans)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    transition: 'all 0.15s',
                    background: active ? 'rgb(20,28,36)' : 'transparent',
                    color: active ? 'rgb(232,238,245)' : 'rgb(110,121,134)',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setModalType('expense')
                setModalOpen(true)
              }}
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                border: '1px solid rgba(224,122,156,0.3)',
                background: 'rgba(224,122,156,0.06)',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'rgb(224,122,156)',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              + Gasto
            </button>
            <button
              type="button"
              onClick={() => {
                setModalType('income')
                setModalOpen(true)
              }}
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                border: '1px solid rgba(94,225,230,0.3)',
                background: 'rgba(94,225,230,0.06)',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'rgb(94,225,230)',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              + Ingreso
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{ width: '100%', borderCollapse: 'collapse' }}
            role="table"
            aria-label="Movimientos"
          >
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(220,235,255,0.05)' }}>
                {['Concepto', 'Fecha', 'Monto', ''].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '10px 24px',
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                      color: 'rgb(110,121,134)',
                      textAlign: i === 2 ? 'right' : i === 3 ? 'right' : 'left',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '13.5px',
                      color: 'rgb(110,121,134)',
                    }}
                  >
                    {data ? 'Sin movimientos registrados' : 'Cargando…'}
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <TxRow
                    key={tx.id}
                    tx={tx}
                    isDeleting={isDeleting === tx.id}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <NewMovementModal
        open={modalOpen}
        defaultType={modalType}
        onClose={() => {
          setModalOpen(false)
          dismiss()
        }}
        onSave={handleSave}
        isSaving={isSaving}
        saveError={saveError}
      />
    </div>
  )
}
