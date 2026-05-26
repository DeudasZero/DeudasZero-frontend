import type { FC } from 'react'
import { Icon } from '@atoms/icon/Icon.tsx'
import { SparkleIcon } from '@/assets/icons/index.ts'
import { Button } from '@atoms/button/Button.tsx'
import type { PaymentStrategy } from '../types/plan-ia.types.ts'

const STRATEGY_LABEL: Record<PaymentStrategy, string> = {
  avalanche: 'Avalancha',
  snowball: 'Bola de Nieve',
}

interface EmptyPlanProps {
  strategy: PaymentStrategy
  isGenerating: boolean
  onGenerate: (s: PaymentStrategy) => void
}

export const EmptyPlan: FC<EmptyPlanProps> = ({ strategy, isGenerating, onGenerate }) => (
  <div
    className="flex flex-col items-center justify-center gap-5 rounded-[12px] p-10 text-center"
    style={{
      background: 'rgb(20,28,36)',
      border: '1px solid rgba(220,235,255,0.06)',
      minHeight: '320px',
    }}
  >
    <div style={{ color: 'var(--dz-signature)', opacity: 0.6 }}>
      <Icon as={SparkleIcon} size={14} />
    </div>
    <div className="flex flex-col gap-2">
      <p
        className="m-0 font-sans font-semibold"
        style={{ fontSize: '16px', color: 'var(--dz-text-primary)' }}
      >
        Aún no tienes un plan generado
      </p>
      <p
        className="m-0 font-sans"
        style={{ fontSize: '13px', color: 'var(--dz-text-muted)', maxWidth: '320px' }}
      >
        Genera tu plan de liquidación con la estrategia que prefieras. El consejero IA calculará el
        cronograma óptimo basado en tus deudas reales.
      </p>
    </div>

    <div className="flex gap-3 flex-wrap justify-center">
      {(['avalanche', 'snowball'] as PaymentStrategy[]).map((s) => (
        <Button
          key={s}
          variant={strategy === s ? 'primary' : 'ghost'}
          size="sm"
          disabled={isGenerating}
          onClick={() => onGenerate(s)}
        >
          {isGenerating && strategy === s ? 'Generando…' : `Plan ${STRATEGY_LABEL[s]}`}
        </Button>
      ))}
    </div>
  </div>
)
