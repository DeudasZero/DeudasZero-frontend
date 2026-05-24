import type { FC } from 'react'
import { Money } from '@atoms/money/Money.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import type { PlanSummary, PaymentStrategy } from '../types/plan-ia.types.ts'

interface PlanSummaryCardProps {
  onStrategyChange?: (s: PaymentStrategy) => void
  summary: PlanSummary
  isLoading?: boolean
  currency?: string
  locale?: string
}

const STRATEGY_LABEL: Record<PaymentStrategy, string> = {
  avalanche: 'Avalancha',
  snowball: 'Bola de Nieve',
}

export const PlanSummaryCard: FC<PlanSummaryCardProps> = ({
  summary,
  isLoading = false,
  currency = 'COP',
  locale = 'es-CO',
}) => {
  const progressPct = Math.round((summary.progressMonths / summary.totalMonths) * 100)

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
        <Skeleton width="200px" height="14px" />
        <div style={{ marginTop: '12px' }}>
          <Skeleton width="280px" height="48px" />
        </div>
        <div style={{ marginTop: '20px' }}>
          <Skeleton width="100%" height="6px" />
        </div>
        <div
          style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px' }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ padding: '14px 16px' }}>
              <Skeleton width="80px" height="10px" />
              <div style={{ marginTop: '6px' }}>
                <Skeleton width="120px" height="20px" />
              </div>
            </div>
          ))}
        </div>
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
      <div style={{ padding: '18px 20px 14px' }}>
        {/* Strategy badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: 'var(--dz-signature)',
            }}
          >
            Plan {STRATEGY_LABEL[summary.strategy]} Activo
          </span>
          <span
            aria-hidden
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'var(--dz-signature)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: 'var(--dz-signature)',
            }}
          >
            {summary.totalMonths} meses
          </span>
        </div>

        {/* Savings hero */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <p
              style={{
                margin: '0 0 2px',
                fontFamily: 'var(--dz-font-mono)',
                fontSize: '10.5px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--dz-text-faint)',
              }}
            >
              Ahorro Total
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '42px',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: 'var(--dz-signature)',
              }}
            >
              {'$' + summary.totalSavingsVsMin.toLocaleString(locale)}
            </p>
          </div>
          <div style={{ paddingBottom: '4px' }}>
            <p
              style={{
                margin: '0 0 1px',
                fontFamily: 'var(--dz-font-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--dz-text-faint)',
              }}
            >
              VS pago mínimo
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--dz-text-muted)',
                textDecoration: 'line-through',
              }}
            >
              {'$' + (summary.totalSavingsVsMin + summary.totalInterest).toLocaleString(locale)} en
              intereses
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10.5px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--dz-text-faint)',
            }}
          >
            Progreso del plan
          </span>
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10.5px',
              color: 'var(--dz-text-muted)',
            }}
          >
            {summary.progressMonths} / {summary.totalMonths} meses
          </span>
        </div>

        <div
          style={{
            height: '6px',
            background: 'var(--dz-bg-raised)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: 'var(--dz-signature)',
              borderRadius: '999px',
              transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10px',
              color: 'var(--dz-text-faint)',
              letterSpacing: '0.08em',
            }}
          >
            {summary.startLabel} · Inicio
          </span>
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10px',
              color: 'var(--dz-text-muted)',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            {summary.endLabel.toUpperCase()} · Deuda Zero 🎯
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          background: 'var(--dz-border-soft)',
          borderTop: '1px solid var(--dz-border-soft)',
        }}
      >
        {[
          {
            label: 'Abono Mensual',
            value: summary.monthlyPayment,
            sub: 'mín + extra',
            accent: false,
          },
          {
            label: 'Extra Sugerido',
            value: summary.extraSuggested,
            sub: 'de tu flujo',
            accent: true,
          },
          {
            label: 'Tasa Promedio',
            text: `${summary.avgRate}%/mes`,
            sub: 'ponderada',
            accent: false,
          },
          {
            label: 'Deudas Restantes',
            text: String(summary.debtsRemaining),
            sub: `incluye ${summary.mainCreditor}`,
            accent: false,
          },
        ].map((m, i) => (
          <div key={i} style={{ padding: '14px 16px', background: 'var(--dz-bg-surface)' }}>
            <p
              style={{
                margin: '0 0 4px',
                fontFamily: 'var(--dz-font-mono)',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--dz-text-faint)',
              }}
            >
              {m.label}
            </p>
            {m.text ? (
              <p
                style={{
                  margin: '0 0 2px',
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: m.accent ? 'var(--dz-signature)' : 'var(--dz-text-primary)',
                  lineHeight: 1,
                }}
              >
                {m.text}
              </p>
            ) : (
              <div style={{ marginBottom: '2px' }}>
                <Money
                  amount={m.value!}
                  currency={currency}
                  locale={locale}
                  variant="h2"
                  {...(m.accent && { accent: 'income' })}
                />
              </div>
            )}
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '11.5px',
                color: 'var(--dz-text-faint)',
              }}
            >
              {m.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
