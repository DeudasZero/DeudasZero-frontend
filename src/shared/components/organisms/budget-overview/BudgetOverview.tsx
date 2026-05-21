import type { FC } from 'react'
import { Money } from '@atoms/money/Money.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
import { StatCard } from '@molecules/stat-card/StatCard.tsx'
import { useBreakpoint } from '@shared/hooks/useBreakpoint.ts'
import type { BudgetOverviewProps, BudgetCategory } from './BudgetOverview.types.ts'

const IncomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path
      d="M9 14V4M4 9l5-5 5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const ExpenseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path
      d="M9 4v10M14 9l-5 5-5-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const SavingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M6.5 9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5S10.38 7 9 7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path d="M9 5.5V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
const DebtIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <rect x="2.5" y="4.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.5 7.5h13" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 11h2M10 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const BudgetOverview: FC<BudgetOverviewProps> = ({
  income,
  expenses,
  savings,
  debts,
  categories = [],
  currency = 'COP',
  locale = 'es-CO',
  period,
  loading = false,
  onCategoryClick,
  className,
}) => {
  const { isNarrow, isCompact } = useBreakpoint()

  const balance = income - expenses - savings - debts
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0
  const debtRate = income > 0 ? Math.round((debts / income) * 100) : 0
  const expenseRate = income > 0 ? Math.round((expenses / income) * 100) : 0

  /**
   * Grid columns:
   * - narrow  (< 640)  → 1 column  (stacked)
   * - compact (< 1024) → 2 columns
   * - desktop          → 4 columns
   */
  const gridCols = isNarrow ? '1fr 1fr' : isCompact ? '1fr 1fr' : 'repeat(4, 1fr)'

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: isNarrow ? '14px' : '20px' }}
    >
      {period && (
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: 'var(--dz-fs-eyebrow)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 'var(--dz-ls-eyebrow)',
            color: 'var(--dz-text-muted)',
          }}
        >
          {period}
        </span>
      )}

      {/* Stats grid — 2 cols on narrow/compact, 4 on desktop */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: '10px',
        }}
      >
        <StatCard
          label="Ingresos"
          value={
            <Money
              amount={income}
              currency={currency}
              locale={locale}
              variant="h2"
              accent="income"
            />
          }
          accent="income"
          icon={<IncomeIcon />}
          loading={loading}
        />
        <StatCard
          label="Gastos"
          value={
            <Money
              amount={expenses}
              currency={currency}
              locale={locale}
              variant="h2"
              accent="expense"
            />
          }
          trend={expenseRate > 80 ? 'up' : 'neutral'}
          trendLabel={`${expenseRate}% ing.`}
          accent="expense"
          icon={<ExpenseIcon />}
          loading={loading}
        />
        <StatCard
          label="Ahorros"
          value={
            <Money
              amount={savings}
              currency={currency}
              locale={locale}
              variant="h2"
              accent="saving"
            />
          }
          trend={savingsRate >= 20 ? 'up' : savingsRate >= 10 ? 'neutral' : 'down'}
          trendLabel={`${savingsRate}% ing.`}
          accent="saving"
          icon={<SavingIcon />}
          loading={loading}
        />
        <StatCard
          label="Deudas"
          value={
            <Money amount={debts} currency={currency} locale={locale} variant="h2" accent="debt" />
          }
          trend={debtRate > 30 ? 'down' : 'neutral'}
          trendLabel={`${debtRate}% ing.`}
          accent="debt"
          icon={<DebtIcon />}
          loading={loading}
        />
      </div>

      {/* Balance summary bar */}
      {!loading && (
        <div
          style={{
            padding: isNarrow ? '14px 16px' : '16px 20px',
            background: 'var(--dz-bg-surface)',
            border: '1px solid var(--dz-border-base)',
            borderRadius: 'var(--dz-r-md)',
            display: 'flex',
            flexDirection: isNarrow ? 'column' : 'row',
            alignItems: isNarrow ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: isNarrow ? '12px' : '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: 'var(--dz-font-mono)',
                fontSize: 'var(--dz-fs-eyebrow)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 'var(--dz-ls-eyebrow)',
                color: 'var(--dz-text-muted)',
              }}
            >
              Balance disponible
            </span>
            <Money
              amount={balance}
              currency={currency}
              locale={locale}
              variant="h2"
              accent={balance >= 0 ? 'income' : 'expense'}
              showSign
            />
          </div>

          {income > 0 && (
            <div
              style={{
                flex: 1,
                minWidth: isNarrow ? '100%' : '200px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  height: '8px',
                  borderRadius: 'var(--dz-r-pill)',
                  overflow: 'hidden',
                  gap: '2px',
                }}
              >
                {expenses > 0 && (
                  <div
                    style={{
                      flex: expenses / income,
                      background: 'var(--dz-expense)',
                      opacity: 0.85,
                      borderRadius: 'var(--dz-r-pill)',
                    }}
                  />
                )}
                {savings > 0 && (
                  <div
                    style={{
                      flex: savings / income,
                      background: 'var(--dz-saving)',
                      opacity: 0.85,
                      borderRadius: 'var(--dz-r-pill)',
                    }}
                  />
                )}
                {debts > 0 && (
                  <div
                    style={{
                      flex: debts / income,
                      background: 'var(--dz-debt)',
                      opacity: 0.85,
                      borderRadius: 'var(--dz-r-pill)',
                    }}
                  />
                )}
                {balance > 0 && (
                  <div
                    style={{
                      flex: balance / income,
                      background: 'var(--dz-income)',
                      opacity: 0.5,
                      borderRadius: 'var(--dz-r-pill)',
                    }}
                  />
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Gastos', pct: expenseRate, color: 'var(--dz-expense)' },
                  { label: 'Ahorros', pct: savingsRate, color: 'var(--dz-saving)' },
                  { label: 'Deudas', pct: debtRate, color: 'var(--dz-debt)' },
                ].map((seg) => (
                  <span
                    key={seg.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: 'var(--dz-font-mono)',
                      fontSize: '10.5px',
                      color: 'var(--dz-text-muted)',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: seg.color,
                        flexShrink: 0,
                      }}
                    />
                    {seg.label} {seg.pct}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && !loading && (
        <div
          style={{
            background: 'var(--dz-bg-surface)',
            border: '1px solid var(--dz-border-base)',
            borderRadius: 'var(--dz-r-md)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--dz-border-soft)' }}>
            <h3
              style={{
                margin: 0,
                fontFamily: 'var(--dz-font-sans)',
                fontSize: 'var(--dz-fs-h3)',
                fontWeight: 600,
                color: 'var(--dz-text-primary)',
                letterSpacing: 'var(--dz-ls-snug)',
              }}
            >
              Categorías
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {categories.map((cat: BudgetCategory, i: number) => {
              const pct =
                cat.budget > 0 ? Math.min(100, Math.round((cat.spent / cat.budget) * 100)) : 0
              const isOver = cat.spent > cat.budget
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={onCategoryClick ? () => onCategoryClick(cat) : undefined}
                  disabled={!onCategoryClick}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: isNarrow ? '10px 16px' : '12px 20px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom:
                      i < categories.length - 1 ? '1px solid var(--dz-border-soft)' : 'none',
                    cursor: onCategoryClick ? 'pointer' : 'default',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--dz-font-sans)',
                        fontSize: 'var(--dz-fs-body)',
                        fontWeight: 500,
                        color: 'var(--dz-text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cat.name}
                    </span>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                    >
                      <Money
                        amount={cat.spent}
                        currency={currency}
                        locale={locale}
                        variant="caption"
                        accent={isOver ? 'expense' : 'neutral'}
                      />
                      {!isNarrow && (
                        <>
                          <span
                            style={{
                              fontFamily: 'var(--dz-font-mono)',
                              fontSize: 'var(--dz-fs-caption)',
                              color: 'var(--dz-text-faint)',
                            }}
                          >
                            /
                          </span>
                          <Money
                            amount={cat.budget}
                            currency={currency}
                            locale={locale}
                            variant="caption"
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <ProgressBar
                    value={pct}
                    accent={isOver ? 'expense' : 'saving'}
                    size="xs"
                    animate={false}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
