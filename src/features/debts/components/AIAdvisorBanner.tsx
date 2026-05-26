import type { FC } from 'react'
import { Icon } from '@atoms/icon/Icon.tsx'
import { SparkleIcon } from '@/assets/icons/index.ts'
import { Button } from '@atoms/button/Button.tsx'
import type { Debt, DebtsSummary } from '../types/debts.types.ts'

interface AIAdvisorBannerProps {
  summary: DebtsSummary
  debts: Debt[]
  onGeneratePlan?: () => void
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${new Intl.NumberFormat('es-CO').format(Math.round(n))}`
  return `$${n}`
}

function buildAdvice(
  summary: DebtsSummary,
  debts: Debt[],
): { text: React.ReactNode; score: string } {
  const active = debts.filter((d) => d.status === 'active')
  const { scoreLabel, loadScore, totalMonthlyInterest } = summary
  const worst = [...active].sort((a, b) => b.monthlyRate - a.monthlyRate)[0]
  const scoreColor =
    scoreLabel === 'SALUDABLE'
      ? 'var(--dz-income)'
      : scoreLabel === 'ALERTA'
        ? 'var(--dz-debt)'
        : 'var(--dz-expense)'

  const scoreNode = (
    <span style={{ color: scoreColor, fontWeight: 600 }}>zona {scoreLabel.toLowerCase()}</span>
  )

  if (active.length === 0) {
    return {
      text: (
        <>
          ¡Sin deudas activas! Tu carga financiera está en{' '}
          <span style={{ color: 'var(--dz-income)', fontWeight: 600 }}>zona saludable</span>. Sigue
          así.
        </>
      ),
      score: `${loadScore}%`,
    }
  }

  if (!worst) {
    return {
      text: <>Tu carga está en {scoreNode}. Genera un plan para optimizar tus pagos.</>,
      score: `${loadScore}%`,
    }
  }

  const estimatedMonths =
    worst.minPayment > worst.monthlyInterest
      ? Math.ceil(
          Math.log(worst.minPayment / (worst.minPayment - worst.monthlyInterest)) /
            Math.log(1 + worst.monthlyRate / 100),
        )
      : null

  const worstName = worst.name.length > 20 ? worst.name.slice(0, 20) + '…' : worst.name

  const text = (
    <>
      Tu carga está en {scoreNode}. Pagas {fmt(totalMonthlyInterest)}/mes en intereses — enfoca
      pagos extra en{' '}
      <span style={{ color: 'var(--dz-signature)', fontWeight: 500 }}>
        &ldquo;{worstName}&rdquo;
      </span>{' '}
      ({worst.monthlyRate}%/mes)
      {estimatedMonths && isFinite(estimatedMonths) && estimatedMonths < 240
        ? ` y liquídala en ~${estimatedMonths} meses`
        : ''}
      .
    </>
  )

  return { text, score: `${loadScore}%` }
}

export const AIAdvisorBanner: FC<AIAdvisorBannerProps> = ({ summary, debts, onGeneratePlan }) => {
  const { text } = buildAdvice(summary, debts)

  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-4 rounded-[10px]"
      style={{ background: 'rgba(94,225,230,0.08)', border: '1px solid rgba(94,225,230,0.18)' }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className="mt-0.5 shrink-0" style={{ color: 'var(--dz-signature)' }}>
          <Icon as={SparkleIcon} size={14} />
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span
            className="font-mono uppercase"
            style={{ fontSize: '9.5px', letterSpacing: '1.33px', color: 'var(--dz-signature)' }}
          >
            ★ CONSEJERO IA
          </span>
          <p
            className="m-0 font-sans"
            style={{ fontSize: '13px', color: 'var(--dz-text-secondary)', lineHeight: 1.5 }}
          >
            {text}
          </p>
        </div>
      </div>
      <Button variant="primary" size="sm" onClick={onGeneratePlan} style={{ flexShrink: 0 }}>
        Generar plan
      </Button>
    </div>
  )
}
