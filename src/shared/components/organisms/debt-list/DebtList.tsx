import type { FC } from 'react'
import { DebtRow } from '@molecules/debt-row/DebtRow.tsx'
import { EmptyState } from '@molecules/empty-state/EmptyState.tsx'
import { SegmentedControl } from '@molecules/segmented-control/SegmentedControl.tsx'
import { Button } from '@atoms/button/Button.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { useBreakpoint } from '@shared/hooks/useBreakpoint.ts'
import type { DebtListProps, DebtListItem, DebtListFilterStatus } from './DebtList.types.ts'

const FILTER_OPTIONS: { value: DebtListFilterStatus; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Activas' },
  { value: 'paused', label: 'Pausadas' },
  { value: 'paid', label: 'Pagadas' },
]

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

function DebtListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: '16px 20px',
            background: 'var(--dz-bg-surface)',
            border: '1px solid var(--dz-border-base)',
            borderRadius: 'var(--dz-r-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Skeleton width="160px" height="16px" />
              <Skeleton width="100px" height="12px" />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'flex-end',
              }}
            >
              <Skeleton width="80px" height="18px" />
              <Skeleton width="52px" height="20px" rounded />
            </div>
          </div>
          <Skeleton width="100%" height="3px" rounded />
        </div>
      ))}
    </div>
  )
}

export const DebtList: FC<DebtListProps> = ({
  debts,
  onDebtClick,
  onAddDebt,
  filterStatus = 'all',
  onFilterChange,
  loading = false,
  emptyAction,
  header,
  className,
}) => {
  const { isNarrow } = useBreakpoint()

  const filtered =
    filterStatus === 'all' ? debts : debts.filter((d: DebtListItem) => d.status === filterStatus)

  const emptyStateAction =
    emptyAction ?? (onAddDebt ? { label: 'Agregar primera deuda', onClick: onAddDebt } : undefined)

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          /* Stack on narrow */
          flexDirection: isNarrow ? 'column' : 'row',
          alignItems: isNarrow ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {header ?? (
            <>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: 'var(--dz-fs-h2)',
                  fontWeight: 600,
                  color: 'var(--dz-text-primary)',
                  letterSpacing: 'var(--dz-ls-snug)',
                }}
              >
                Mis deudas
              </h2>
              {!loading && filtered.length > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: 'var(--dz-fs-caption)',
                    color: 'var(--dz-text-muted)',
                  }}
                >
                  {filtered.length} {filtered.length === 1 ? 'deuda' : 'deudas'}
                </span>
              )}
            </>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            /* On narrow: fill full width, wrap filter and button */
            flexWrap: 'wrap',
            width: isNarrow ? '100%' : undefined,
          }}
        >
          {onFilterChange && (
            <div style={{ flex: isNarrow ? 1 : undefined }}>
              <SegmentedControl
                options={FILTER_OPTIONS}
                value={filterStatus}
                onChange={onFilterChange}
                fullWidth={isNarrow}
              />
            </div>
          )}
          {onAddDebt && (
            <Button
              variant="primary"
              size="sm"
              iconLeft={<AddIcon />}
              onClick={onAddDebt}
              fullWidth={isNarrow && !onFilterChange}
            >
              {isNarrow ? 'Agregar' : 'Agregar deuda'}
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <DebtListSkeleton rows={isNarrow ? 2 : 3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="💳"
          title={
            filterStatus === 'all'
              ? 'Sin deudas registradas'
              : `Sin deudas ${filterStatus === 'active' ? 'activas' : filterStatus === 'paused' ? 'pausadas' : 'pagadas'}`
          }
          description={
            filterStatus === 'all'
              ? 'Registra tus deudas para empezar a crear tu plan de pago.'
              : 'No hay deudas en esta categoría.'
          }
          {...(emptyStateAction ? { action: emptyStateAction } : {})}
        />
      ) : (
        <div
          role="list"
          aria-label="Lista de deudas"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {filtered.map((debt: DebtListItem) => (
            <div key={debt.id} role="listitem">
              <DebtRow
                name={debt.name}
                creditor={debt.creditor}
                balance={debt.balance}
                totalDebt={debt.totalDebt}
                nextPayment={debt.nextPayment ?? 0}
                nextPaymentDate={debt.nextPaymentDate ?? ''}
                interestRate={debt.interestRate ?? 0}
                status={debt.status}
                currency={debt.currency ?? ''}
                locale={debt.locale ?? ''}
                onClick={onDebtClick ? () => onDebtClick(debt) : () => {}}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
