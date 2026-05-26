import type { FC } from 'react'
import { Icon } from '@atoms/icon/Icon.tsx'
import { IncomeIcon, ExpenseIcon, SavingIcon, CreditCardIcon } from '@/assets/icons/index.ts'
import { Money } from '@atoms/money/Money.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
import { StatCard } from '@molecules/stat-card/StatCard.tsx'
import type { BudgetOverviewProps, BudgetCategory } from './BudgetOverview.types.ts'

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
  const balance = income - expenses - savings - debts
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0
  const debtRate = income > 0 ? Math.round((debts / income) * 100) : 0
  const expenseRate = income > 0 ? Math.round((expenses / income) * 100) : 0

  return (
    <div className={`flex flex-col gap-3.5 lg:gap-5 ${className ?? ''}`}>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
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
          icon={<Icon as={IncomeIcon} size={18} />}
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
          icon={<Icon as={ExpenseIcon} size={18} />}
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
          icon={<Icon as={SavingIcon} size={18} />}
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
          icon={<Icon as={CreditCardIcon} size={18} />}
          loading={loading}
        />
      </div>

      {!loading && (
        <div
          style={{
            background: 'var(--dz-bg-surface)',
            border: '1px solid var(--dz-border-base)',
            borderRadius: 'var(--dz-r-md)',
          }}
          className="flex flex-col gap-3 p-[14px_16px] lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:p-[16px_20px]"
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
            <div className="flex flex-col gap-1.5 w-full lg:flex-1 lg:min-w-50">
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
                  className="flex flex-col gap-2 p-[10px_16px] lg:p-[12px_20px] text-left bg-transparent border-none cursor-pointer"
                  style={{
                    borderBottom:
                      i < categories.length - 1 ? '1px solid var(--dz-border-soft)' : 'none',
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
                      <span className="hidden lg:contents">
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
                      </span>
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
