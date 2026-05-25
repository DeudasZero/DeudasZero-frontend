import type { FC } from 'react'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { Button } from '@atoms/button/Button.tsx'
import type { PlanSummary, PaymentStrategy } from '../types/plan-ia.types.ts'

interface PlanSummaryCardProps {
  summary: PlanSummary
  isLoading?: boolean
  isGenerating?: boolean
  strategy: PaymentStrategy
  onStrategyChange?: (s: PaymentStrategy) => void
}

const STRATEGY_LABEL: Record<PaymentStrategy, string> = {
  avalanche: 'Avalancha',
  snowball: 'Bola de Nieve',
}

function fmt(n: number, locale = 'es-CO') {
  return '$' + Math.round(n).toLocaleString(locale)
}

export const PlanSummaryCard: FC<PlanSummaryCardProps> = ({
  summary,
  isLoading = false,
  isGenerating = false,
  strategy,
  onStrategyChange,
}) => {
  const progressPct =
    summary.totalInstallments > 0
      ? Math.round((summary.paidInstallments / summary.totalInstallments) * 100)
      : 0

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
        {/* Strategy toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              {summary.monthsToPayoff} meses
            </span>
          </div>

          {/* Cambiar estrategia */}
          {onStrategyChange && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['avalanche', 'snowball'] as PaymentStrategy[]).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={strategy === s ? 'primary' : 'ghost'}
                  disabled={isGenerating}
                  onClick={() => onStrategyChange(s)}
                >
                  {isGenerating && strategy === s ? '…' : STRATEGY_LABEL[s]}
                </Button>
              ))}
            </div>
          )}
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
              Intereses Ahorrados
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
              {fmt(summary.interestSaved)}
            </p>
          </div>
          <div style={{ paddingBottom: '4px' }}>
            <p
              style={{
                margin: '0 0 2px',
                fontFamily: 'var(--dz-font-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--dz-text-faint)',
              }}
            >
              vs pago solo mínimos
            </p>
            {summary.aiSummary && (
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: '12.5px',
                  color: 'var(--dz-text-muted)',
                  maxWidth: '380px',
                  lineHeight: 1.4,
                }}
              >
                {summary.aiSummary}
              </p>
            )}
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
            {summary.paidInstallments} / {summary.totalInstallments} cuotas
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
            label: 'Meses Para Terminar',
            text: `${summary.monthsToPayoff}`,
            sub: 'desde hoy',
            accent: false,
          },
          {
            label: 'Cuotas Pagadas',
            text: `${summary.paidInstallments} / ${summary.totalInstallments}`,
            sub: `${progressPct}% completado`,
            accent: true,
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
