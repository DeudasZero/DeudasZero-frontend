import { useState, useMemo, type FC } from 'react'
import { useTransactions } from '../hooks/useTransactions.ts'
import { NewMovementModal } from './NewMovementModal.tsx'
import type {
  Transaction,
  TxType,
  TxCategory,
  NewTransactionForm,
} from '../types/transactions.types.ts'

function cop(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace('COP', '$')
    .trim()
}

const CAT_COLOR: Record<string, string> = {
  Vivienda: 'rgb(156,201,242)',
  Alimentos: 'rgb(224,122,156)',
  Servicios: 'rgb(242,166,184)',
  Transporte: 'rgb(196,181,240)',
  Ocio: 'rgb(242,192,136)',
  Salario: 'rgb(94,225,230)',
  Freelance: 'rgb(141,232,184)',
  Otros: 'rgb(154,160,166)',
}
const CAT_BG: Record<string, string> = {
  Vivienda: 'rgba(156,201,242,0.14)',
  Alimentos: 'rgba(224,122,156,0.14)',
  Servicios: 'rgba(242,166,184,0.14)',
  Transporte: 'rgba(196,181,240,0.14)',
  Ocio: 'rgba(242,192,136,0.14)',
  Salario: 'rgba(94,225,230,0.12)',
  Freelance: 'rgba(141,232,184,0.14)',
  Otros: 'rgba(154,160,166,0.14)',
}

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const DownloadIcon = () => (
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
const IncomeArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M17 7L7 17M7 17H14M7 17V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CARD: React.CSSProperties = { background: 'rgb(20,28,36)', borderRadius: '10px' }

const SummaryCards: FC<{ data: ReturnType<typeof useTransactions>['data'] }> = ({ data }) => {
  if (!data) return null
  const { summary } = data
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div style={{ ...CARD, padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10.5px',
              fontWeight: 500,
              letterSpacing: '1.47px',
              textTransform: 'uppercase',
              color: 'rgb(110,121,134)',
            }}
          >
            INGRESOS · {summary.month}
          </span>
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10.5px',
              color: 'var(--dz-signature)',
            }}
          >
            {summary.incomeSources.length} fuentes
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--dz-font-display)',
            fontSize: '44px',
            fontWeight: 500,
            letterSpacing: '-0.4px',
            color: 'var(--dz-signature)',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '12px',
          }}
        >
          ${new Intl.NumberFormat('es-CO').format(summary.totalIncome)}
        </div>

        {/* Income sources breakdown */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {summary.incomeSources.map((src: { label: string; amount: number }) => (
            <div key={src.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span
                style={{
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '11px',
                  color: 'rgb(110,121,134)',
                }}
              >
                {cop(src.amount)}
              </span>
              <span
                style={{
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: '11.5px',
                  color: 'rgb(172,183,196)',
                }}
              >
                {src.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GASTOS */}
      <div style={{ ...CARD, padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10.5px',
              fontWeight: 500,
              letterSpacing: '1.47px',
              textTransform: 'uppercase',
              color: 'rgb(110,121,134)',
            }}
          >
            GASTOS · {summary.month}
          </span>
          <span
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--dz-expense)',
            }}
          >
            {summary.expenseRatio}% del ingreso
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--dz-font-display)',
            fontSize: '44px',
            fontWeight: 500,
            letterSpacing: '-0.4px',
            color: 'rgb(232,238,245)',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '12px',
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
          Equivale al{' '}
          <span style={{ color: 'var(--dz-expense)', fontWeight: 600 }}>
            {summary.expenseRatio}%
          </span>{' '}
          de tus ingresos del mes
        </p>
      </div>
    </div>
  )
}

type FilterTab = 'all' | TxType
const TABS: { id: FilterTab; label: string }[] = [
  { id: 'income', label: 'Ingresos' },
  { id: 'expense', label: 'Gastos' },
  { id: 'all', label: 'Todos' },
]
const ALL_CATS: TxCategory[] = [
  'Vivienda',
  'Alimentos',
  'Servicios',
  'Transporte',
  'Ocio',
  'Salario',
  'Freelance',
  'Otros',
]

const TxRow: FC<{ tx: Transaction }> = ({ tx }) => {
  const isIncome = tx.type === 'income'
  const iconBg = isIncome ? 'rgba(94,225,230,0.12)' : 'rgba(224,122,156,0.14)'
  const iconColor = isIncome ? 'rgb(94,225,230)' : 'rgb(224,122,156)'
  const amtColor = isIncome ? 'rgb(94,225,230)' : 'rgb(232,238,245)'

  return (
    <tr
      style={{ borderBottom: '1px solid rgba(220,235,255,0.05)', cursor: 'pointer' }}
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
          {isIncome ? '+' : '−'}${new Intl.NumberFormat('es-CO').format(tx.amount)}
        </span>
      </td>
    </tr>
  )
}

export const TransactionsPage: FC = () => {
  const { data, isLoading } = useTransactions()
  const [tab, setTab] = useState<FilterTab>('income')
  const [catFilter, setCatFilter] = useState<TxCategory | 'Categoría'>('Categoría')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'income' | 'expense'>('income')

  const filtered = useMemo(() => {
    if (!data) return []
    let list: Transaction[] = data.transactions
    if (tab !== 'all') list = list.filter((t) => t.type === tab)
    if (catFilter !== 'Categoría') list = list.filter((t) => t.category === catFilter)
    return list
  }, [data, tab, catFilter])

  function handleSave(form: NewTransactionForm) {
    console.log('save', form)
  }

  const openModal = (type: 'income' | 'expense') => {
    setModalType(type)
    setModalOpen(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

      <div style={{ ...CARD, overflow: 'hidden' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Category filter */}
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value as TxCategory | 'Categoría')}
              style={{
                padding: '7px 12px',
                background: 'rgb(8,13,18)',
                border: '1px solid rgba(220,235,255,0.08)',
                borderRadius: '6px',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '12.5px',
                color: catFilter === 'Categoría' ? 'rgb(110,121,134)' : 'rgb(232,238,245)',
                outline: 'none',
                cursor: 'pointer',
                colorScheme: 'dark',
              }}
            >
              <option value="Categoría">Categoría</option>
              {ALL_CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Export CSV */}
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                background: 'rgba(220,235,255,0.06)',
                border: '1px solid rgba(220,235,255,0.08)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '12.5px',
                color: 'rgb(172,183,196)',
              }}
            >
              <DownloadIcon /> Exportar CSV
            </button>

            {/* + Nuevo movimiento */}
            <button
              type="button"
              onClick={() => openModal(tab === 'expense' ? 'expense' : 'income')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                background: 'var(--dz-signature)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'rgb(13,20,25)',
              }}
            >
              <PlusIcon /> Nuevo movimiento
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  background: 'rgb(8,13,18)',
                  borderBottom: '1px solid rgba(220,235,255,0.09)',
                }}
              >
                {[
                  ['Concepto', '60%', 'left'],
                  ['Fecha', '18%', 'left'],
                  ['Monto', '22%', 'right'],
                ].map(([label, w, align]) => (
                  <th
                    key={label}
                    style={{
                      padding: '10px 24px',
                      textAlign: align as 'left' | 'right',
                      width: w,
                      fontFamily: 'var(--dz-font-mono)',
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '1.4px',
                      textTransform: 'uppercase',
                      color: 'rgb(70,80,91)',
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(220,235,255,0.05)' }}>
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
                          style={{
                            width: 140,
                            height: 10,
                            borderRadius: 3,
                            background: 'rgba(220,235,255,0.06)',
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <div
                        style={{
                          width: 50,
                          height: 10,
                          borderRadius: 3,
                          background: 'rgba(220,235,255,0.06)',
                        }}
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
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '13.5px',
                      color: 'rgb(110,121,134)',
                    }}
                  >
                    Sin movimientos en esta categoría
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => <TxRow key={tx.id} tx={tx} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <NewMovementModal
        open={modalOpen}
        defaultType={modalType}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
