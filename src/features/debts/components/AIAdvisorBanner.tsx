import type { FC } from 'react'
import { Button } from '@atoms/button/Button.tsx'

interface AIAdvisorBannerProps {
  onGeneratePlan?: () => void
}

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3l1.5 5.5H19l-4.5 3.3 1.5 5.5L12 14l-4 3.3 1.5-5.5L5 8.5h5.5z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
)

export const AIAdvisorBanner: FC<AIAdvisorBannerProps> = ({ onGeneratePlan }) => (
  <div
    className="flex items-center justify-between gap-4 px-5 py-4 rounded-[10px]"
    style={{ background: 'rgba(94,225,230,0.08)', border: '1px solid rgba(94,225,230,0.18)' }}
  >
    <div className="flex items-start gap-3 min-w-0">
      <span className="mt-0.5 shrink-0" style={{ color: 'var(--dz-signature)' }}>
        <SparkleIcon />
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
          Tu carga está en{' '}
          <span style={{ color: 'var(--dz-debt)', fontWeight: 600 }}>zona de alerta</span>. Tienes
          $1.94M de flujo disponible — destínalo a la deuda de mayor tasa y baja a 37% en 4 meses.
        </p>
      </div>
    </div>
    <Button variant="primary" size="sm" onClick={onGeneratePlan} style={{ flexShrink: 0 }}>
      Generar plan
    </Button>
  </div>
)
