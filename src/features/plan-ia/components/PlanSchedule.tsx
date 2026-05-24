import { useState, type FC } from 'react'
import { Badge } from '@atoms/badge/Badge.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import type { ScheduleRow } from '../types/plan-ia.types.ts'

type TabView = 'cronograma' | 'historial'

interface PlanScheduleProps {
  rows: ScheduleRow[]
  isLoading?: boolean
}

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 6h18M7 12h10M11 18h2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

function fmtCOP(n: number, locale = 'es-CO') {
  return '$' + Math.round(n).toLocaleString(locale)
}

export const PlanSchedule: FC<PlanScheduleProps> = ({ rows, isLoading = false }) => {
  const [tab, setTab] = useState<TabView>('cronograma')
  const [filter, setFilter] = useState<string>('all')
  const [markedPaid, setMarkedPaid] = useState<Set<string>>(new Set())

  const debtOptions = Array.from(new Set(rows.map((r) => r.debtId))).map((id) => ({
    id,
    name: rows.find((r) => r.debtId === id)?.debtName ?? id,
  }))

  function rowKey(r: ScheduleRow) {
    return `${r.month}-${r.debtId}`
  }
  function isPaid(r: ScheduleRow) {
    return r.status === 'paid' || markedPaid.has(rowKey(r))
  }
  function isCurrent(r: ScheduleRow) {
    return r.status === 'current' && !markedPaid.has(rowKey(r))
  }

  function handleMarkPaid(key: string) {
    setMarkedPaid((prev) => {
      const n = new Set(prev)
      n.add(key)
      return n
    })
  }

  const displayed = rows.filter((r) => {
    if (tab === 'historial') return isPaid(r)
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
          marginTop: '14px',
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
        marginTop: '14px',
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
            <FilterIcon />
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '56px 1fr 120px 100px 90px 110px',
          padding: '8px 20px',
          background: 'var(--dz-bg-raised)',
          borderBottom: '1px solid var(--dz-border-soft)',
        }}
      >
        {[
          { label: 'Mes', align: 'left' },
          { label: 'Deuda · Fecha', align: 'left' },
          { label: 'Pago', align: 'right' },
          { label: 'Capital', align: 'right' },
          { label: 'Interés', align: 'right' },
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
        {displayed.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '13px',
              color: 'var(--dz-text-faint)',
            }}
          >
            {tab === 'historial' ? 'Sin pagos registrados aún' : 'Sin pagos en este período'}
          </div>
        ) : (
          displayed.map((row) => {
            const key = rowKey(row)
            const paid = isPaid(row)
            const current = isCurrent(row)

            return (
              <div
                key={key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1fr 120px 100px 90px 110px',
                  padding: '14px 20px',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--dz-border-soft)',
                  background: current ? 'rgba(94,225,230,0.04)' : 'transparent',
                  transition: 'background var(--dz-transition-fast)',
                }}
              >
                {/* Month circle */}
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
                      background: paid
                        ? 'var(--dz-signature)'
                        : current
                          ? 'rgba(94,225,230,0.15)'
                          : 'var(--dz-bg-raised)',
                      border: `1.5px solid ${paid ? 'var(--dz-signature)' : current ? 'var(--dz-signature)' : 'var(--dz-border-strong)'}`,
                      color: paid
                        ? 'var(--dz-bg-page)'
                        : current
                          ? 'var(--dz-signature)'
                          : 'var(--dz-text-muted)',
                    }}
                  >
                    {paid ? <CheckIcon /> : row.month}
                  </div>
                </div>

                {/* Debt name + date */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: row.debtColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--dz-font-sans)',
                        fontSize: '13.5px',
                        fontWeight: 500,
                        color: 'var(--dz-text-primary)',
                      }}
                    >
                      {row.debtName}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-mono)',
                      fontSize: '10.5px',
                      color: 'var(--dz-text-faint)',
                      letterSpacing: '0.03em',
                      marginLeft: '12px',
                    }}
                  >
                    {row.date} · DUE {row.dueDate}
                  </span>
                </div>

                {/* Total */}
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
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-mono)',
                      fontSize: '9.5px',
                      color: 'var(--dz-text-faint)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    pago total
                  </span>
                </div>

                {/* Capital */}
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: 'var(--dz-signature)',
                      display: 'block',
                    }}
                  >
                    {fmtCOP(row.capital)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-mono)',
                      fontSize: '9.5px',
                      color: 'var(--dz-text-faint)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    capital
                  </span>
                </div>

                {/* Interest */}
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: row.interest > 0 ? 'var(--dz-expense)' : 'var(--dz-text-faint)',
                      display: 'block',
                    }}
                  >
                    {fmtCOP(row.interest)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-mono)',
                      fontSize: '9.5px',
                      color: 'var(--dz-text-faint)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    interés
                  </span>
                </div>

                {/* Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {paid ? (
                    <Badge accent="income" size="xs">
                      Pagado
                    </Badge>
                  ) : current ? (
                    <button
                      onClick={() => handleMarkPaid(key)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--dz-r-sm)',
                        border: '1px solid var(--dz-signature)',
                        background: 'var(--dz-signature)',
                        fontFamily: 'var(--dz-font-sans)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--dz-bg-page)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'opacity var(--dz-transition-fast)',
                      }}
                    >
                      Marcar pagado
                    </button>
                  ) : (
                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--dz-r-sm)',
                        border: '1px solid var(--dz-border-base)',
                        background: 'transparent',
                        fontFamily: 'var(--dz-font-sans)',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--dz-text-muted)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Detalle
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
