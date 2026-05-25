import type { FC } from 'react'
import { Skeleton } from '@atoms/skeleton/index.ts'

interface FlowCardProps {
  label: string
  value: string
  isLoading?: boolean
}

export const FlowCard: FC<FlowCardProps> = ({ label, value, isLoading = false }) => (
  <div className="bg-[rgb(20,28,36)] rounded-[10px] overflow-hidden p-6 flex flex-col gap-3">
    <span className="font-mono text-[11px] font-medium tracking-[1.54px] uppercase text-(--dz-signature)">
      {label}
    </span>

    {isLoading ? (
      <Skeleton width="260px" height="72px" />
    ) : (
      <div className="font-display text-[72px] font-medium leading-none tracking-tight text-(--dz-text-primary) tabular-nums">
        {value}
      </div>
    )}

    {!isLoading && (
      <p className="m-0 font-sans text-[13.5px] leading-relaxed text-[rgb(172,183,196)]">
        Lo que te queda después de gastos del mes. La IA recomienda destinarlo a tu deuda con tasa
        más alta — <span className="text-(--dz-signature)">Visa Bancolombia (3.1%/mes)</span>.
      </p>
    )}
  </div>
)
