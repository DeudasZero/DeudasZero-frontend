import type { FC } from 'react'
import { Skeleton } from '@atoms/skeleton/index.ts'
import { Button } from '@atoms/button/index.js'
import type { CategorySpend } from '../types/dashboard.types.ts'

interface CategoryCardProps {
  categories: CategorySpend[]
  currentMonth?: string
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

const CATEGORY_COLORS = [
  'var(--dz-signature)',
  'var(--dz-expense)',
  'var(--dz-saving)',
  'var(--dz-debt)',
  'var(--dz-text-muted)',
]

export const CategoryCard: FC<CategoryCardProps> = ({
  categories,
  currentMonth,
  isLoading = false,
}) => {
  const max = categories.length > 0 ? Math.max(...categories.map((c) => c.amount)) : 1

  const monthLabel = currentMonth
    ? currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1).toLowerCase()
    : new Date().toLocaleString('es-CO', { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className="bg-[rgb(20,28,36)] rounded-[10px] overflow-hidden p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[1.4px] uppercase text-(--dz-text-faint)">
            POR CATEGORÍA
          </span>
          <span className="font-sans text-[13.5px] font-medium text-(--dz-text-primary)">
            Gastos · {monthLabel}
          </span>
        </div>
        <Button variant="ghost" size="sm">
          Ver todo →
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <Skeleton width="80px" height="11px" />
                <Skeleton width="60px" height="11px" />
              </div>
              <Skeleton width="100%" height="4px" rounded />
            </div>
          ))
        ) : categories.length === 0 ? (
          <p
            className="text-center py-6 m-0"
            style={{ fontSize: '13px', color: 'var(--dz-text-faint)' }}
          >
            Sin gastos este mes
          </p>
        ) : (
          categories.map((cat, i) => {
            const pct = Math.round((cat.amount / max) * 100)
            const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length] ?? 'var(--dz-text-muted)'
            return (
              <div key={cat.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className="font-sans text-[12px] font-medium"
                    style={{ color: 'var(--dz-text-secondary)' }}
                  >
                    {cat.name}
                  </span>
                  <span
                    className="font-mono text-[11.5px] font-medium tabular-nums"
                    style={{ color: 'var(--dz-text-primary)' }}
                  >
                    {formatCOP(cat.amount)}
                  </span>
                </div>
                <div
                  className="h-1 rounded overflow-hidden"
                  style={{ background: 'rgba(220,235,255,0.06)' }}
                >
                  <div
                    className="h-full rounded transition-[width] duration-500 ease-out"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
