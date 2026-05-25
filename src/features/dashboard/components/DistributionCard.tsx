import type { FC } from 'react'
import { Skeleton } from '@atoms/skeleton/index.ts'

interface DistributionCardProps {
  expenses: number
  available: number
  isLoading?: boolean
}

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace('COP', '$')
    .trim()
}

export const DistributionCard: FC<DistributionCardProps> = ({
  expenses,
  available,
  isLoading = false,
}) => {
  const total = expenses + available
  const expPct = total > 0 ? Math.round((expenses / total) * 100) : 47
  const avlPct = 100 - expPct

  return (
    <div className="bg-[rgb(20,28,36)] rounded-[10px] overflow-hidden p-6 flex flex-col gap-4">
      <span className="font-mono text-[11px] font-medium tracking-[1.54px] uppercase text-(--dz-text-faint)">
        Distribución del Ingreso
      </span>

      {isLoading ? (
        <Skeleton width="100%" height="8px" rounded />
      ) : (
        <div className="flex h-2 rounded overflow-hidden gap-0.5">
          <div
            className="rounded-l transition-[width] duration-400 ease-in-out"
            style={{ width: `${expPct}%`, background: 'var(--dz-expense)' }}
          />
          <div className="flex-1 rounded-r" style={{ background: 'var(--dz-signature)' }} />
        </div>
      )}

      {!isLoading && (
        <div className="flex gap-6">
          {[
            { label: 'Gastos', pct: expPct, amount: expenses, color: 'var(--dz-expense)' },
            { label: 'Disponible', pct: avlPct, amount: available, color: 'var(--dz-signature)' },
          ].map(({ label, pct, amount, color }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <span className="font-sans text-xs text-(--dz-text-muted)">{label}</span>
                <span className="font-mono text-[11.5px] font-semibold" style={{ color }}>
                  {pct}%
                </span>
              </div>
              <span className="font-mono text-[13px] tracking-tight text-(--dz-text-secondary)">
                {formatCOP(amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
