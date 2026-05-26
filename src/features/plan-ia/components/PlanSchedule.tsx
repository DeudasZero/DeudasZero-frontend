import { useState, type FC } from 'react'
import { Icon } from '@atoms/icon/Icon.tsx'
import { CheckIcon, FilterIcon } from '@/assets/icons/index.ts'
import { Badge } from '@atoms/badge/Badge.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import type { ScheduleRow, HistoryRow } from '../types/plan-ia.types.ts'

type TabView = 'cronograma' | 'historial'

interface PlanScheduleProps {
  rows: ScheduleRow[]
  historyRows?: HistoryRow[]
  isLoading?: boolean
  isLoadingHistory?: boolean
  isMarkingPaid?: string | null
  onMarkPaid?: (installmentId: string) => void
}

function fmtCOP(n: number, locale = 'es-CO') {
  return '$' + Math.round(n).toLocaleString(locale)
}

const STRATEGY_LABEL: Record<string, string> = {
  avalanche: 'Avalancha',
  snowball: 'Bola de nieve',
}

export const PlanSchedule: FC<PlanScheduleProps> = ({
  rows,
  historyRows = [],
  isLoading = false,
  isLoadingHistory = false,
  isMarkingPaid = null,
  onMarkPaid,
}) => {
  const [tab, setTab] = useState<TabView>('cronograma')
  const [filter, setFilter] = useState<string>('all')

  const debtOptions = Array.from(new Set(rows.map((r) => r.debtId))).map((id) => ({
    id,
    name: rows.find((r) => r.debtId === id)?.debtName ?? id,
  }))

  const displayedSchedule = rows.filter((r) => {
    if (filter !== 'all') return r.debtId === filter
    return true
  })

  if (isLoading) {
    return (
      <div
        style={{
          background: 'var(--dz-bg-surface)',
          border: '1px solid var(--dz-border-base)',
          borderRadius: 'var(--dz-r-lg)',
          padding: '20px',
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              padding: '14px 0',
              borderBottom: '1px solid var(--dz-border-soft)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <Skeleton width="32px" height="32px" />
            <div style={{ flex: 1 }}>
              <Skeleton width="160px" height="14px" />
              <div style={{ marginTop: '4px' }}>
                <Skeleton width="100px" height="10px" />
              </div>
            </div>
            <Skeleton width="80px" height="14px" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--dz-bg-surface)',
        border: '1px solid var(--dz-border-base)',
        borderRadius: 'var(--dz-r-lg)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid var(--dz-border-soft)',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['cronograma', 'historial'] as TabView[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--dz-r-sm)',
                border: 'none',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background var(--dz-transition-fast), color var(--dz-transition-fast)',
                background: tab === t ? 'var(--dz-bg-raised)' : 'transparent',
                color: tab === t ? 'var(--dz-text-primary)' : 'var(--dz-text-muted)',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'cronograma' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon as={FilterIcon} size={14} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                background: 'var(--dz-bg-raised)',
                border: '1px solid var(--dz-border-base)',
                borderRadius: 'var(--dz-r-xs)',
                padding: '5px 24px 5px 10px',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '12px',
                color: 'var(--dz-text-secondary)',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 14 14' fill='none'%3E%3Cpath d='M3 5l4 4 4-4' stroke='%236e7986' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                colorScheme: 'dark',
              }}
            >
              <option value="all">Por deuda</option>
              {debtOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {tab === 'cronograma' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '56px 1fr 120px 100px 110px',
              padding: '8px 20px',
              background: 'var(--dz-bg-raised)',
              borderBottom: '1px solid var(--dz-border-soft)',
            }}
          >
            {[
              { label: 'Mes', align: 'left' },
              { label: 'Deuda · Vencimiento', align: 'left' },
              { label: 'Pago Total', align: 'right' },
              { label: 'Extra', align: 'right' },
              { label: '', align: 'right' },
            ].map((h, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--dz-text-faint)',
                  textAlign: h.align as 'left' | 'right',
                }}
              >
                {h.label}
              </span>
            ))}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {displayedSchedule.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: '13px',
                  color: 'var(--dz-text-faint)',
                }}
              >
                Sin cuotas pendientes
              </div>
            ) : (
              displayedSchedule.map((row) => {
                const isPaid = row.status === 'paid'
                const isCurrent = row.status === 'current'
                const isBusy = isMarkingPaid === row.installmentId

                return (
                  <div
                    key={row.installmentId}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '56px 1fr 120px 100px 110px',
                      padding: '14px 20px',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--dz-border-soft)',
                      background: isCurrent ? 'rgba(94,225,230,0.04)' : 'transparent',
                      opacity: isBusy ? 0.6 : 1,
                      transition: 'background var(--dz-transition-fast), opacity 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--dz-font-mono)',
                          fontSize: '12px',
                          fontWeight: 700,
                          flexShrink: 0,
                          background: isPaid
                            ? 'var(--dz-signature)'
                            : isCurrent
                              ? 'rgba(94,225,230,0.15)'
                              : 'var(--dz-bg-raised)',
                          border: `1.5px solid ${
                            isPaid
                              ? 'var(--dz-signature)'
                              : isCurrent
                                ? 'var(--dz-signature)'
                                : 'var(--dz-border-strong)'
                          }`,
                          color: isPaid
                            ? 'var(--dz-bg-page)'
                            : isCurrent
                              ? 'var(--dz-signature)'
                              : 'var(--dz-text-muted)',
                        }}
                      >
                        {isPaid ? <Icon as={CheckIcon} size={13} /> : row.month}
                      </div>
                    </div>

                    <div>
                      <span
                        style={{
                          fontFamily: 'var(--dz-font-sans)',
                          fontSize: '13.5px',
                          fontWeight: 500,
                          color: 'var(--dz-text-primary)',
                          display: 'block',
                        }}
                      >
                        {row.debtName}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--dz-font-mono)',
                          fontSize: '10.5px',
                          color: 'var(--dz-text-faint)',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {row.date} · DUE {row.dueDate}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: 'var(--dz-font-sans)',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: 'var(--dz-text-primary)',
                          display: 'block',
                        }}
                      >
                        {fmtCOP(row.totalPayment)}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: 'var(--dz-font-sans)',
                          fontSize: '13px',
                          fontWeight: 500,
                          color:
                            row.extraPayment > 0 ? 'var(--dz-signature)' : 'var(--dz-text-faint)',
                        }}
                      >
                        {row.extraPayment > 0 ? `+${fmtCOP(row.extraPayment)}` : '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {isPaid ? (
                        <Badge accent="income" size="xs">
                          Pagado
                        </Badge>
                      ) : isCurrent ? (
                        <button
                          onClick={() => onMarkPaid?.(row.installmentId)}
                          disabled={isBusy}
                          style={{
                            padding: '4px 6px',
                            borderRadius: 'var(--dz-r-sm)',
                            border: '1px solid var(--dz-signature)',
                            background: 'var(--dz-signature)',
                            fontFamily: 'var(--dz-font-sans)',
                            fontSize: '10px',
                            fontWeight: 600,
                            color: 'var(--dz-bg-page)',
                            cursor: isBusy ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'opacity var(--dz-transition-fast)',
                          }}
                        >
                          {isBusy ? '…' : 'Marcar pagado'}
                        </button>
                      ) : (
                        <span
                          style={{
                            fontFamily: 'var(--dz-font-mono)',
                            fontSize: '10.5px',
                            color: 'var(--dz-text-faint)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          PENDIENTE
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </>
      )}

      {tab === 'historial' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 120px 110px 80px',
              padding: '8px 20px',
              background: 'var(--dz-bg-raised)',
              borderBottom: '1px solid var(--dz-border-soft)',
            }}
          >
            {[
              { label: 'Creado', align: 'left' },
              { label: 'Estrategia', align: 'left' },
              { label: 'Int. ahorrado', align: 'right' },
              { label: 'Cuotas', align: 'right' },
              { label: 'Estado', align: 'right' },
            ].map((h, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--dz-text-faint)',
                  textAlign: h.align as 'left' | 'right',
                }}
              >
                {h.label}
              </span>
            ))}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {isLoadingHistory ? (
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--dz-border-soft)',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Skeleton width="160px" height="14px" />
                    <div style={{ marginTop: '4px' }}>
                      <Skeleton width="100px" height="10px" />
                    </div>
                  </div>
                  <Skeleton width="80px" height="14px" />
                </div>
              ))
            ) : historyRows.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: '13px',
                  color: 'var(--dz-text-faint)',
                }}
              >
                Sin planes anteriores
              </div>
            ) : (
              historyRows.map((row) => (
                <div
                  key={row.planId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 100px 120px 110px 80px',
                    padding: '14px 20px',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--dz-border-soft)',
                    background: row.active ? 'rgba(94,225,230,0.04)' : 'transparent',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--dz-font-sans)',
                        fontSize: '13.5px',
                        fontWeight: 500,
                        color: 'var(--dz-text-primary)',
                        display: 'block',
                      }}
                    >
                      {row.createdAt}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--dz-font-mono)',
                        fontSize: '10.5px',
                        color: 'var(--dz-text-faint)',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {row.monthsToPayoff} {row.monthsToPayoff === 1 ? 'mes' : 'meses'} para
                      liquidar
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '12px',
                      color: 'var(--dz-text-secondary)',
                    }}
                  >
                    {STRATEGY_LABEL[row.strategy] ?? row.strategy}
                  </span>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontFamily: 'var(--dz-font-sans)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--dz-signature)',
                      }}
                    >
                      {fmtCOP(row.interestSaved)}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontFamily: 'var(--dz-font-mono)',
                        fontSize: '12px',
                        color: 'var(--dz-text-secondary)',
                      }}
                    >
                      {row.totalInstallments}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {row.active ? (
                      <Badge accent="income" size="xs">
                        Activo
                      </Badge>
                    ) : (
                      <Badge accent="neutral" size="xs">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
