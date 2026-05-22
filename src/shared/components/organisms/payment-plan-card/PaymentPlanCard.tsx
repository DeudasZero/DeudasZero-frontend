import { useMemo } from 'react'
import type { FC } from 'react'
import { Money } from '@atoms/money/Money.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
import { Badge } from '@atoms/badge/Badge.tsx'
import { SegmentedControl } from '@molecules/segmented-control/SegmentedControl.tsx'
import { AmountInput } from '@molecules/amount-input/AmountInput.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import type {
  PaymentPlanCardProps,
  PaymentStrategy,
  PaymentPlanDebt,
} from './PaymentPlanCard.types.ts'

const STRATEGY_OPTIONS: { value: PaymentStrategy; label: string }[] = [
  { value: 'avalanche', label: 'Avalancha' },
  { value: 'snowball', label: 'Bola de nieve' },
  { value: 'custom', label: 'Personalizado' },
]

const STRATEGY_DESCRIPTION: Record<PaymentStrategy, string> = {
  avalanche: 'Primero las deudas con mayor tasa. Minimiza el interés total pagado.',
  snowball: 'Primero las de menor saldo. Genera motivación con victorias rápidas.',
  custom: 'Define el orden de pago manualmente según tus prioridades.',
}

function calcPayoff(debts: PaymentPlanDebt[], monthlyBudget: number, strategy: PaymentStrategy) {
  if (debts.length === 0 || monthlyBudget <= 0)
    return { months: 0, totalInterest: 0, debtFreeDate: '—' }
  const sorted = [...debts].sort((a, b) => {
    if (strategy === 'avalanche') return b.interestRate - a.interestRate
    if (strategy === 'snowball') return a.balance - b.balance
    return 0
  })
  const balances = sorted.map((d) => d.balance)
  const monthlyRates = sorted.map((d) => d.interestRate / 100 / 12)
  const minPayments = sorted.map((d) => d.minPayment)
  let totalInterest = 0
  let months = 0
  const MAX_MONTHS = 600
  while (balances.some((b) => b > 0.01) && months < MAX_MONTHS) {
    months++
    let remaining = monthlyBudget
    for (let i = 0; i < balances.length; i++) {
      if (balances[i]! <= 0) continue
      const interest = balances[i]! * monthlyRates[i]!
      totalInterest += interest
      const payment = Math.min(minPayments[i]!, balances[i]! + interest)
      balances[i] = balances[i]! + interest - payment
      remaining -= payment
    }
    for (let i = 0; i < balances.length; i++) {
      if (balances[i]! <= 0 || remaining <= 0) continue
      const extra = Math.min(remaining, balances[i]!)
      balances[i] = balances[i]! - extra
      remaining -= extra
    }
  }
  const debtFreeDate =
    months >= MAX_MONTHS
      ? 'Más de 50 años'
      : new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO', {
          month: 'long',
          year: 'numeric',
        })
  return { months, totalInterest, debtFreeDate }
}

export const PaymentPlanCard: FC<PaymentPlanCardProps> = ({
  debts,
  monthlyBudget,
  strategy,
  onStrategyChange,
  onMonthlyBudgetChange,
  currency = 'COP',
  locale = 'es-CO',
  loading = false,
  className,
}) => {
  const plan = useMemo(
    () => calcPayoff(debts, monthlyBudget, strategy),
    [debts, monthlyBudget, strategy],
  )
  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0)
  const extraPayment = Math.max(0, monthlyBudget - totalMinPayments)

  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'avalanche') return b.interestRate - a.interestRate
    if (strategy === 'snowball') return a.balance - b.balance
    return 0
  })

  return (
    <div
      className={`flex flex-col bg-(--dz-bg-surface) border border-(--dz-border-base) rounded-(--dz-r-lg) overflow-hidden ${className ?? ''}`}
    >
      <div className="flex flex-col gap-3.5 p-[16px_16px_0] lg:p-[20px_24px_0]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2
              style={{
                margin: '0 0 4px',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: 'var(--dz-fs-h2)',
                fontWeight: 600,
                color: 'var(--dz-text-primary)',
                letterSpacing: 'var(--dz-ls-snug)',
              }}
            >
              Plan de pago
            </h2>
            <p
              className="hidden lg:block m-0"
              style={{
                fontFamily: 'var(--dz-font-sans)',
                fontSize: 'var(--dz-fs-caption)',
                color: 'var(--dz-text-muted)',
              }}
            >
              {STRATEGY_DESCRIPTION[strategy]}
            </p>
          </div>
          {onStrategyChange && (
            <SegmentedControl
              options={STRATEGY_OPTIONS}
              value={strategy}
              onChange={onStrategyChange}
              fullWidth={false}
            />
          )}
        </div>

        {onMonthlyBudgetChange && (
          <div className="w-full lg:max-w-70">
            <AmountInput
              label="Presupuesto mensual"
              value={monthlyBudget || ''}
              onChange={(v) => onMonthlyBudgetChange(typeof v === 'number' ? v : 0)}
              currency={currency as 'COP' | 'USD' | 'EUR'}
              hint={`Mín. requerido: ${totalMinPayments.toLocaleString(locale)} ${currency}`}
              fullWidth
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-[14px_16px] lg:p-[16px_24px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton width="60px" height="10px" />
              <Skeleton width="90px" height="20px" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-[14px_16px] lg:p-[16px_24px]">
          {[
            {
              label: 'Libre de deudas',
              value: plan.debtFreeDate,
              isText: true,
              accent: 'var(--dz-income)',
            },
            {
              label: 'Meses estimados',
              value: plan.months > 0 ? `${plan.months}m` : '—',
              isText: true,
              accent: 'var(--dz-signature)',
            },
            {
              label: 'Interés total',
              value: plan.totalInterest,
              isText: false,
              accent: 'var(--dz-debt)',
            },
            {
              label: 'Saldo pendiente',
              value: totalBalance,
              isText: false,
              accent: 'var(--dz-debt)',
            },
          ].map((metric, i) => (
            <div
              key={i}
              className="flex flex-col gap-1.5 p-[10px_12px] lg:p-[12px_14px] min-w-0"
              style={{
                background: 'var(--dz-bg-raised)',
                borderRadius: 'var(--dz-r-md)',
                border: '1px solid var(--dz-border-soft)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: 'var(--dz-fs-eyebrow)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--dz-ls-eyebrow)',
                  color: 'var(--dz-text-faint)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {metric.label}
              </span>
              {metric.isText ? (
                <span
                  className="text-(--dz-fs-body) lg:text-(--dz-fs-h3) font-semibold overflow-hidden text-ellipsis whitespace-nowrap leading-tight"
                  style={{
                    fontFamily: 'var(--dz-font-sans)',
                    color: metric.accent,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {metric.value as string}
                </span>
              ) : (
                <Money
                  amount={metric.value as number}
                  currency={currency}
                  locale={locale}
                  variant="h3"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && sortedDebts.length > 0 && (
        <div className="flex flex-col">
          <div
            className="p-[10px_16px] lg:p-[12px_24px] border-t border-b border-(--dz-border-soft)"
            style={{ background: 'var(--dz-bg-raised)' }}
          >
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
              Orden de prioridad
            </span>
          </div>

          {sortedDebts.map((debt, i) => {
            const pct = totalBalance > 0 ? Math.round((debt.balance / totalBalance) * 100) : 0
            const isFocus = i === 0
            return (
              <div
                key={debt.id}
                className="flex items-center gap-2.5 p-[12px_16px] lg:gap-3.5 lg:p-[14px_24px]"
                style={{
                  borderBottom:
                    i < sortedDebts.length - 1 ? '1px solid var(--dz-border-soft)' : 'none',
                  background: isFocus ? 'var(--dz-tint-debt)' : 'transparent',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isFocus ? 'var(--dz-debt)' : 'var(--dz-bg-raised)',
                    border: `1.5px solid ${isFocus ? 'var(--dz-debt)' : 'var(--dz-border-strong)'}`,
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isFocus ? 'var(--dz-bg-page)' : 'var(--dz-text-muted)',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '4px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--dz-font-sans)',
                        fontSize: 'var(--dz-fs-body)',
                        fontWeight: isFocus ? 600 : 400,
                        color: 'var(--dz-text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {debt.name}
                    </span>
                    {isFocus && (
                      <Badge accent="debt" size="xs" dot>
                        Enfoque
                      </Badge>
                    )}
                  </div>
                  <ProgressBar value={pct} accent="debt" size="xs" animate={false} />
                </div>

                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <Money
                    amount={debt.balance}
                    currency={debt.currency ?? currency}
                    locale={debt.locale ?? locale}
                    variant="caption"
                    accent="debt"
                  />
                  <span
                    className="hidden lg:block"
                    style={{
                      fontFamily: 'var(--dz-font-mono)',
                      fontSize: '10.5px',
                      color: 'var(--dz-text-faint)',
                    }}
                  >
                    {debt.interestRate}% EA
                  </span>
                </div>
              </div>
            )
          })}

          {extraPayment > 0 && (
            <div
              className="m-[14px_16px_12px] lg:m-[0_24px_20px] mt-3.5 p-[12px_14px] flex items-start gap-2.5"
              style={{
                background: 'var(--dz-tint-income)',
                border: '1px solid rgba(94,225,230,0.2)',
                borderRadius: 'var(--dz-r-sm)',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>💡</span>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: 'var(--dz-fs-caption)',
                  color: 'var(--dz-text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                Poniendo{' '}
                <strong style={{ color: 'var(--dz-income)' }}>
                  <Money
                    amount={extraPayment}
                    currency={currency}
                    locale={locale}
                    variant="caption"
                    accent="income"
                  />
                </strong>{' '}
                extra al mes hacia tu primera deuda. ¡Vas bien!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
