import { useState, useMemo, type FC } from 'react'
import { Button } from '@atoms/button/Button.tsx'
import { EmptyState } from '@molecules/empty-state/EmptyState.tsx'
import { SegmentedControl } from '@molecules/segmented-control/SegmentedControl.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { useDebts } from '../hooks/useDebts.ts'
import { DebtsSummaryPanel } from './DebtsSummaryPanel.tsx'
import { AIAdvisorBanner } from './AIAdvisorBanner.tsx'
import { DebtCard } from './DebtCard.tsx'
import { RegisterDebtModal } from './RegisterDebtModal.tsx'
import type { Debt, DebtStatus } from '../types/debts.types.ts'

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

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3v13M7 11l5 5 5-5M4 20h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function sortDebts(debts: Debt[], mode: SortMode): Debt[] {
  return [...debts].sort((a, b) => {
    if (mode === 'rate') return b.monthlyRate - a.monthlyRate
    if (mode === 'balance') return b.balance - a.balance
    return a.name.localeCompare(b.name)
  })
}

export const DebtsPage: FC = () => {
  const { data, isLoading } = useDebts()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')
  const [sortMode, setSortMode] = useState<SortMode>('rate')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!data) return []
    const list =
      statusFilter === 'all'
        ? data.debts
        : data.debts.filter((d) => d.status === (statusFilter as DebtStatus))
    return sortDebts(list, sortMode)
  }, [data, statusFilter, sortMode])

  function handleLiquidar(id: string) {
    console.log('liquidar', id)
  }

  return (
    <div className="flex flex-col gap-5">
      <DebtsSummaryPanel summary={data?.summary} isLoading={isLoading} />

      {!isLoading && data && (
        <AIAdvisorBanner onGeneratePlan={() => console.log('generate plan')} />
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

            <Button variant="ghost" size="sm" iconLeft={<ExportIcon />}>
              Exportar
            </Button>

            <Button
              variant="primary"
              size="sm"
              iconLeft={<PlusIcon />}
              onClick={() => setModalOpen(true)}
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
            title={statusFilter === 'paid' ? 'Sin deudas liquidadas' : 'Sin deudas activas'}
            description={
              statusFilter === 'active'
                ? 'Registra tus deudas para ver tu plan de pago.'
                : 'Las deudas que liquides aparecerán aquí.'
            }
            {...(statusFilter === 'active' && {
              action: { label: 'Registrar deuda', onClick: () => setModalOpen(true) },
            })}
          />
        ) : (
          <div className="flex flex-col gap-3" role="list" aria-label="Lista de deudas">
            {filtered.map((debt, idx) => (
              <div key={debt.id} role="listitem">
                <DebtCard
                  debt={debt}
                  onLiquidar={handleLiquidar}
                  {...(sortMode === 'rate' && debt.status === 'active' && { priority: idx + 1 })}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <RegisterDebtModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveCard={(v) => {
          console.log('card', v)
          setModalOpen(false)
        }}
        onSaveLoan={(v) => {
          console.log('loan', v)
          setModalOpen(false)
        }}
      />
    </div>
  )
}
