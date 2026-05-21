import { useMemo } from 'react'
import type { FC } from 'react'
import { Money } from '@atoms/money/Money.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
import { Badge } from '@atoms/badge/Badge.tsx'
import { SegmentedControl } from '@molecules/segmented-control/SegmentedControl.tsx'
import { AmountInput } from '@molecules/amount-input/AmountInput.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { useBreakpoint } from '@shared/hooks/useBreakpoint.ts'
import type {
  PaymentPlanCardProps,
  PaymentStrategy,
  PaymentPlanDebt,
} from './PaymentPlanCard.types.ts'

const STRATEGY_OPTIONS: { value: PaymentStrategy; label: string; short: string }[] = [
  { value: 'avalanche', label: 'Avalancha', short: 'Avalancha' },
  { value: 'snowball', label: 'Bola de nieve', short: 'Snowball' },
  { value: 'custom', label: 'Personalizado', short: 'Custom' },
]

const STRATEGY_DESCRIPTION: Record<PaymentStrategy, string> = {
  avalanche: 'Primero las deudas con mayor tasa. Minimiza el interés total pagado.',
  snowball: 'Primero las de menor saldo. Genera motivación con victorias rápidas.',
  custom: 'Define el orden de pago manualmente según tus prioridades.',
}

function calcPayoff(
  debts: PaymentPlanDebt[],
  monthlyBudget: number,
  strategy: PaymentStrategy,
): { months: number; totalInterest: number; debtFreeDate: string } {
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
  const { isNarrow } = useBreakpoint()

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

  /* Metrics grid: 2 cols on narrow, 4 on wider */
  const metricsGrid = isNarrow ? '1fr 1fr' : 'repeat(4, 1fr)'

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        background: 'var(--dz-bg-surface)',
        border: '1px solid var(--dz-border-base)',
        borderRadius: 'var(--dz-r-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: isNarrow ? '16px 16px 0' : '20px 24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isNarrow ? 'column' : 'row',
            alignItems: isNarrow ? 'flex-start' : 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
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
            {!isNarrow && (
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: 'var(--dz-fs-caption)',
                  color: 'var(--dz-text-muted)',
                }}
              >
                {STRATEGY_DESCRIPTION[strategy]}
              </p>
            )}
          </div>

          {onStrategyChange && (
            <SegmentedControl
              options={STRATEGY_OPTIONS.map((o) => ({
                value: o.value,
                label: isNarrow ? o.short : o.label,
              }))}
              value={strategy}
              onChange={onStrategyChange}
              fullWidth={isNarrow}
            />
          )}
        </div>

        {onMonthlyBudgetChange && (
          <div style={{ maxWidth: isNarrow ? '100%' : '280px' }}>
            <AmountInput
              label="Presupuesto mensual"
              value={monthlyBudget || ''}
              onChange={(v) => onMonthlyBudgetChange(typeof v === 'number' ? v : 0)}
              currency={currency as 'COP' | 'USD' | 'EUR'}
              hint={`Mín. requerido: ${totalMinPayments.toLocaleString(locale)} ${currency}`}
              fullWidth={isNarrow}
            />
          </div>
        )}
      </div>

      {/* Summary metrics */}
      {loading ? (
        <div
          style={{
            padding: isNarrow ? '16px' : '16px 24px',
            display: 'grid',
            gridTemplateColumns: metricsGrid,
            gap: '10px',
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Skeleton width="60px" height="10px" />
              <Skeleton width="90px" height="20px" />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: isNarrow ? '14px 16px' : '16px 24px',
            display: 'grid',
            gridTemplateColumns: metricsGrid,
            gap: '10px',
          }}
        >
          {[
            {
              label: 'Libre de deudas',
              value: plan.debtFreeDate,
              isText: true,
              accent: 'var(--dz-income)',
            },
            {
              label: isNarrow ? 'Meses' : 'Meses estimados',
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
              style={{
                padding: isNarrow ? '10px 12px' : '12px 14px',
                background: 'var(--dz-bg-raised)',
                borderRadius: 'var(--dz-r-md)',
                border: '1px solid var(--dz-border-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                minWidth: 0,
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
                  style={{
                    fontFamily: 'var(--dz-font-sans)',
                    fontSize: isNarrow ? 'var(--dz-fs-body)' : 'var(--dz-fs-h3)',
                    fontWeight: 600,
                    color: metric.accent,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {metric.value as string}
                </span>
              ) : (
                <Money
                  amount={metric.value as number}
                  currency={currency}
                  locale={locale}
                  variant={isNarrow ? 'caption' : 'h3'}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Priority order */}
      {!loading && sortedDebts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: isNarrow ? '10px 16px' : '12px 24px',
              borderTop: '1px solid var(--dz-border-soft)',
              borderBottom: '1px solid var(--dz-border-soft)',
              background: 'var(--dz-bg-raised)',
            }}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isNarrow ? '10px' : '14px',
                  padding: isNarrow ? '12px 16px' : '14px 24px',
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

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '2px',
                    flexShrink: 0,
                  }}
                >
                  <Money
                    amount={debt.balance}
                    currency={debt.currency ?? currency}
                    locale={debt.locale ?? locale}
                    variant="caption"
                    accent="debt"
                  />
                  {!isNarrow && (
                    <span
                      style={{
                        fontFamily: 'var(--dz-font-mono)',
                        fontSize: '10.5px',
                        color: 'var(--dz-text-faint)',
                      }}
                    >
                      {debt.interestRate}% EA
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {extraPayment > 0 && (
            <div
              style={{
                margin: isNarrow ? '12px 16px' : '0 24px 20px',
                marginTop: '14px',
                padding: '12px 14px',
                background: 'var(--dz-tint-income)',
                border: '1px solid rgba(94,225,230,0.2)',
                borderRadius: 'var(--dz-r-sm)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
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
