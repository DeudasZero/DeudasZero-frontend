import { useState, useMemo, useEffect, type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions.ts'
import { NewMovementModal } from './NewMovementModal.tsx'
import { Alert } from '@/shared/components/molecules/alert/index.ts'
import { TransactionRow } from './TransactionRow.tsx'
import { TransactionSkeletonRow } from './TransactionSkeletonRow.tsx'
import { TransactionSummaryCards } from './TransactionSummaryCards.tsx'
import { ConfirmModal } from '@molecules/confirm-modal/ConfirmModal.tsx'
import type { Transaction, TxType, NewTransactionForm } from '../types/transactions.types.ts'

const CARD: React.CSSProperties = {
  background: 'rgb(13,20,25)',
  borderRadius: '12px',
  border: '1px solid rgba(220,235,255,0.06)',
}

type FilterTab = 'all' | TxType

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

  const location = useLocation()
  const initialTab = (location.state as { tab?: FilterTab } | null)?.tab ?? 'income'

  const [confirmTx, setConfirmTx] = useState<Transaction | null>(null)
  const [tab, setTab] = useState<FilterTab>(initialTab)
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

  function handleDelete(tx: Transaction) {
    setConfirmTx(tx)
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
        <TransactionSummaryCards data={data} />
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
                    color: active ? 'rgb(232,238,245)' : 'var(--dz-text-faint)',
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
              - Gasto
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
                      color: 'var(--dz-text-faint)',
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
                Array.from({ length: 6 }).map((_, i) => <TransactionSkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '13.5px',
                      color: 'var(--dz-text-faint)',
                    }}
                  >
                    {data ? 'Sin movimientos registrados' : 'Cargando…'}
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <TransactionRow
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
      <ConfirmModal
        open={confirmTx !== null}
        title="Eliminar movimiento"
        description={
          confirmTx ? `¿Eliminar "${confirmTx.name}"? Esta acción no se puede deshacer.` : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={async () => {
          await remove({ id: confirmTx!.id, type: confirmTx!.type })
          setConfirmTx(null)
        }}
        onCancel={() => setConfirmTx(null)}
      />
    </div>
  )
}
