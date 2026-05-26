import { useState, useMemo, useEffect, useRef, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@atoms/icon/Icon.tsx'
import { PlusIcon } from '@/assets/icons/index.ts'
import { Button } from '@atoms/button/Button.tsx'
import { Alert } from '@/shared/components/molecules/alert/index.ts'
import { EmptyState } from '@molecules/empty-state/EmptyState.tsx'
import { SegmentedControl } from '@molecules/segmented-control/SegmentedControl.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { useDebts } from '../hooks/useDebts.ts'
import { DebtsSummaryPanel } from './DebtsSummaryPanel.tsx'
import { AIAdvisorBanner } from './AIAdvisorBanner.tsx'
import { DebtCard } from './DebtCard.tsx'
import { RegisterDebtModal } from './RegisterDebtModal.tsx'
import { ConfirmModal } from '@molecules/confirm-modal/ConfirmModal.tsx'
import type { Debt, DebtFormValues, FetchStatus } from '../types/debts.types.ts'

type StatusFilter = 'active' | 'paid' | 'all'
type SortMode = 'rate' | 'balance' | 'name'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'active', label: 'Activas' },
  { value: 'paid', label: 'Liquidadas' },
  { value: 'all', label: 'Todas' },
]

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'rate', label: 'Mayor tasa primero' },
  { value: 'balance', label: 'Mayor saldo' },
  { value: 'name', label: 'Nombre A–Z' },
]

const STATUS_MAP: Record<StatusFilter, FetchStatus> = {
  active: 'ACTIVE',
  paid: 'PAID',
  all: 'ALL',
}

function sortDebts(debts: Debt[], mode: SortMode): Debt[] {
  return [...debts].sort((a, b) => {
    if (mode === 'rate') return b.monthlyRate - a.monthlyRate
    if (mode === 'balance') return b.balance - a.balance
    return a.name.localeCompare(b.name)
  })
}

function debtToFormValues(debt: Debt): DebtFormValues {
  return {
    name: debt.name,
    type: debt.kind === 'card' ? 'CARD' : 'LOAN',
    balance: String(debt.balance),
    monthlyRate: String(debt.monthlyRate),
    minPayment: String(debt.minPayment),
  }
}

export const DebtsPage: FC = () => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')
  const [sortMode, setSortMode] = useState<SortMode>('rate')

  const apiStatus = STATUS_MAP[statusFilter]

  const {
    data,
    isLoading,
    isSaving,
    isPatching,
    isDeleting,
    error,
    saveError,
    successMessage,
    save,
    update,
    pay,
    remove,
    dismiss,
  } = useDebts(apiStatus)

  const [confirmPay, setConfirmPay] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [modalDebt, setModalDebt] = useState<Debt | null | 'new'>(null)
  const editingIdRef = useRef<string | null>(null)

  const modalOpen = modalDebt !== null
  const isEditMode = modalDebt !== null && modalDebt !== 'new'
  const initialValues = isEditMode ? debtToFormValues(modalDebt) : undefined

  useEffect(() => {
    if (!successMessage && !error) return
    const timer = setTimeout(dismiss, 4000)
    return () => clearTimeout(timer)
  }, [successMessage, error, dismiss])

  // API already returns filtered debts — only sort client-side
  const filtered = useMemo(() => {
    if (!data) return []
    return sortDebts(data.debts, sortMode)
  }, [data, sortMode])

  async function handleSave(values: DebtFormValues) {
    if (isEditMode && editingIdRef.current) {
      await update(editingIdRef.current, values)
    } else {
      await save(values)
    }
    setModalDebt(null)
    editingIdRef.current = null
  }

  function handleOpenEdit(debt: Debt) {
    editingIdRef.current = debt.id
    setModalDebt(debt)
  }

  function handleCloseModal() {
    setModalDebt(null)
    editingIdRef.current = null
    dismiss()
  }

  function handlePay(id: string) {
    setConfirmPay(id)
  }
  function handleDelete(id: string) {
    setConfirmDelete(id)
  }

  return (
    <div className="flex flex-col gap-5">
      {successMessage && (
        <Alert variant="success" onDismiss={dismiss}>
          {successMessage}
        </Alert>
      )}
      {(error ?? saveError) && (
        <Alert variant="danger" onDismiss={dismiss}>
          {error ?? saveError}
        </Alert>
      )}

      <DebtsSummaryPanel summary={data?.summary} debts={data?.debts} isLoading={isLoading} />

      {!isLoading && data && data.debts.some((d) => d.status === 'active') && (
        <AIAdvisorBanner
          summary={data.summary}
          debts={data.debts}
          onGeneratePlan={() => navigate('/ai')}
        />
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <SegmentedControl
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <div className="flex items-center gap-2">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="font-sans rounded-[6px] outline-none cursor-pointer"
              style={{
                padding: '7px 32px 7px 12px',
                background: 'rgb(8,13,18)',
                border: '1px solid rgba(220,235,255,0.08)',
                fontSize: '12.5px',
                color: 'var(--dz-text-secondary)',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 5l4 4 4-4' stroke='%236e7986' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                colorScheme: 'dark',
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <Button
              variant="primary"
              size="sm"
              iconLeft={<Icon as={PlusIcon} size={14} />}
              onClick={() => setModalDebt('new')}
            >
              Registrar deuda
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[10px] p-5"
                style={{ background: 'rgb(20,28,36)', height: '140px' }}
              >
                <Skeleton width="200px" height="16px" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="💳"
            title={
              statusFilter === 'paid'
                ? 'Sin deudas liquidadas'
                : statusFilter === 'all'
                  ? 'Sin deudas registradas'
                  : 'Sin deudas activas'
            }
            description={
              statusFilter === 'active'
                ? 'No cuentas con deudas activas. ¡Felicitaciones! 🎉'
                : statusFilter === 'all'
                  ? 'Aún no tienes deudas registradas.'
                  : 'Las deudas que liquides aparecerán aquí.'
            }
            {...(statusFilter === 'active' && {
              action: { label: 'Registrar deuda', onClick: () => setModalDebt('new') },
            })}
          />
        ) : (
          <div className="flex flex-col gap-3" role="list" aria-label="Lista de deudas">
            {filtered.map((debt, idx) => (
              <div key={debt.id} role="listitem">
                <DebtCard
                  debt={debt}
                  isPatching={isPatching === debt.id}
                  isDeleting={isDeleting === debt.id}
                  onLiquidar={handlePay}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  {...(sortMode === 'rate' && debt.status === 'active' && { priority: idx + 1 })}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <RegisterDebtModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        {...(initialValues !== undefined && { initialValues })}
        isSaving={isSaving}
        saveError={saveError}
        defaultKind={isEditMode ? modalDebt.kind : 'card'}
      />
      <ConfirmModal
        open={confirmPay !== null}
        title="Liquidar deuda"
        description="¿Marcar esta deuda como liquidada? Esta acción no se puede deshacer."
        confirmLabel="Liquidar"
        variant="warning"
        onConfirm={async () => {
          await pay(confirmPay!)
          setConfirmPay(null)
        }}
        onCancel={() => setConfirmPay(null)}
      />
      <ConfirmModal
        open={confirmDelete !== null}
        title="Eliminar deuda"
        description="¿Eliminar esta deuda permanentemente?"
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={async () => {
          await remove(confirmDelete!)
          setConfirmDelete(null)
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
