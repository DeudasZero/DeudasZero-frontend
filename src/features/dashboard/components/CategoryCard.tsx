import type { FC } from 'react'
import { Skeleton } from '@atoms/skeleton/index.ts'
import { Button } from '@atoms/button/index.js'
import type { CategorySpend } from '../types/dashboard.types.ts'

interface CategoryCardProps {
  categories: CategorySpend[]
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

export const CategoryCard: FC<CategoryCardProps> = ({ categories, isLoading = false }) => {
  const max = categories.length > 0 ? Math.max(...categories.map((c) => c.amount)) : 1

  return (
    <div className="bg-[rgb(20,28,36)] rounded-[10px] overflow-hidden p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[1.4px] uppercase text-[rgb(110,121,134)]">
            POR CATEGORÍA
          </span>
          <span className="font-sans text-[13.5px] font-medium text-(--dz-text-primary)">
            Gastos · Junio
          </span>
        </div>
        <Button variant="ghost" size="sm">
          Ver todo →
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <Skeleton width="80px" height="11px" />
                  <Skeleton width="60px" height="11px" />
                </div>
                <Skeleton width="100%" height="4px" rounded />
              </div>
            ))
          : categories.map((cat, i) => {
              const pct = Math.round((cat.amount / max) * 100)
              const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length] ?? 'var(--dz-text-muted)'
              return (
                <div key={cat.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[12.5px] text-(--dz-text-primary)">
                      {cat.name}
                    </span>
                    <span className="font-mono text-[12px] text-(--dz-text-muted)">
                      {formatCOP(cat.amount)}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}
