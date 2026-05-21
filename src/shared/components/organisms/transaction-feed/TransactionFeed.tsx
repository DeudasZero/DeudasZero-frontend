import type { FC } from 'react'
import { TransactionItem } from '@molecules/transaction-item/TransactionItem.tsx'
import { EmptyState } from '@molecules/empty-state/EmptyState.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { Button } from '@atoms/button/Button.tsx'
import { Divider } from '@atoms/divider/Divider.tsx'
import { useBreakpoint } from '@shared/hooks/useBreakpoint.ts'
import type {
  TransactionFeedProps,
  TransactionFeedItem,
  TransactionFeedFilter,
  TransactionFeedGroup,
} from './TransactionFeed.types.ts'

const FILTER_OPTIONS: { value: TransactionFeedFilter; label: string; short: string }[] = [
  { value: 'all', label: 'Todos', short: 'Todos' },
  { value: 'income', label: 'Ingresos', short: 'Ing.' },
  { value: 'expense', label: 'Gastos', short: 'Gas.' },
  { value: 'saving', label: 'Ahorros', short: 'Aho.' },
  { value: 'debt', label: 'Deudas', short: 'Deu.' },
]

function groupByDate(items: TransactionFeedItem[]): TransactionFeedGroup[] {
  const map = new Map<string, TransactionFeedItem[]>()
  for (const item of items) {
    const existing = map.get(item.date) ?? []
    map.set(item.date, [...existing, item])
  }
  return Array.from(map.entries()).map(([label, groupItems]) => ({
    label,
    items: groupItems,
  }))
}

function TransactionSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px' }}
        >
          <Skeleton circle width={36} height={36} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Skeleton width="40%" height="14px" />
            <Skeleton width="25%" height="11px" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              alignItems: 'flex-end',
            }}
          >
            <Skeleton width="64px" height="14px" />
            <Skeleton width="40px" height="18px" rounded />
          </div>
        </div>
      ))}
    </div>
  )
}

export const TransactionFeed: FC<TransactionFeedProps> = ({
  transactions,
  filter = 'all',
  onFilterChange,
  groupBy = 'date',
  onTransactionClick,
  onAddTransaction,
  loading = false,
  maxItems,
  showViewAll = false,
  onViewAll,
  className,
}) => {
  const { isNarrow } = useBreakpoint()

  const filtered =
    filter === 'all'
      ? transactions
      : transactions.filter((t: TransactionFeedItem) => t.type === filter)

  const sliced = maxItems ? filtered.slice(0, maxItems) : filtered
  const hasMore = maxItems !== undefined && filtered.length > maxItems
  const groups: TransactionFeedGroup[] =
    groupBy === 'date' ? groupByDate(sliced) : [{ label: '', items: sliced }]

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          flexDirection: isNarrow ? 'column' : 'row',
          alignItems: isNarrow ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
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
          Movimientos
        </h2>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: isNarrow ? '100%' : undefined,
          }}
        >
          {onFilterChange && (
            <div
              role="group"
              aria-label="Filtrar por tipo"
              style={{
                display: 'flex',
                gap: '3px',
                background: 'var(--dz-bg-sunken)',
                border: '1px solid var(--dz-border-base)',
                borderRadius: 'var(--dz-r-pill)',
                padding: '3px',
                flex: isNarrow ? 1 : undefined,
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {FILTER_OPTIONS.map((opt) => {
                const isActive = opt.value === filter
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFilterChange(opt.value)}
                    style={{
                      flex: isNarrow ? 1 : undefined,
                      padding: isNarrow ? '5px 8px' : '5px 12px',
                      borderRadius: 'var(--dz-r-pill)',
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: 'var(--dz-fs-caption)',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--dz-text-primary)' : 'var(--dz-text-muted)',
                      background: isActive ? 'var(--dz-bg-raised)' : 'transparent',
                      border: isActive
                        ? '1px solid var(--dz-border-strong)'
                        : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all var(--dz-transition-fast)',
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.005em',
                      boxShadow: isActive ? 'var(--dz-shadow-sm)' : 'none',
                    }}
                  >
                    {/* Show abbreviated labels on narrow */}
                    {isNarrow ? opt.short : opt.label}
                  </button>
                )
              })}
            </div>
          )}

          {onAddTransaction && !isNarrow && (
            <Button variant="ghost" size="sm" onClick={onAddTransaction}>
              + Nuevo
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          background: 'var(--dz-bg-surface)',
          border: '1px solid var(--dz-border-base)',
          borderRadius: 'var(--dz-r-md)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <TransactionSkeleton rows={isNarrow ? 3 : 5} />
        ) : sliced.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Sin movimientos"
            description={
              filter === 'all'
                ? 'Registra tus ingresos, gastos y ahorros.'
                : `Sin movimientos de tipo "${FILTER_OPTIONS.find((o) => o.value === filter)?.label}".`
            }
            {...(onAddTransaction !== undefined && {
              action: { label: 'Registrar movimiento', onClick: onAddTransaction },
            })}
          />
        ) : (
          <>
            {groups.map((group: TransactionFeedGroup, gi: number) => (
              <div key={group.label + gi}>
                {groupBy === 'date' && group.label && (
                  <div
                    style={{
                      padding: '10px 16px 4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--dz-font-mono)',
                        fontSize: '10.5px',
                        fontWeight: 500,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--dz-text-faint)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {group.label}
                    </span>
                    <span style={{ flex: 1, height: '1px', background: 'var(--dz-border-soft)' }} />
                  </div>
                )}

                {group.items.map((tx: TransactionFeedItem, ti: number) => (
                  <div key={tx.id}>
                    <TransactionItem
                      title={tx.title}
                      date={tx.date}
                      amount={tx.amount}
                      type={tx.type}
                      {...(tx.category !== undefined && { category: tx.category })}
                      {...(tx.currency !== undefined && { currency: tx.currency })}
                      {...(tx.locale !== undefined && { locale: tx.locale })}
                      {...(tx.note !== undefined && { note: tx.note })}
                      {...(onTransactionClick !== undefined && {
                        onClick: () => onTransactionClick(tx),
                      })}
                    />
                    {ti < group.items.length - 1 && (
                      <div style={{ marginInline: '16px' }}>
                        <Divider spacing="sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {(hasMore || (showViewAll && onViewAll)) && (
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid var(--dz-border-soft)',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button variant="ghost" size="sm" onClick={onViewAll}>
                  {hasMore
                    ? `Ver ${filtered.length - (maxItems ?? 0)} más`
                    : 'Ver todos los movimientos'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
