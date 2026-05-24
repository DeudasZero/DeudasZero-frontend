import type { FC } from 'react'
import { CARD } from './DashboardPage.tsx'
import type { CategorySpend } from '../types/dashboard.types.ts'

interface CategoryCardProps {
  categories: CategorySpend[]
  isLoading?: boolean
}

function cop(n: number) {
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

export const CategoryCard: FC<CategoryCardProps> = ({ categories, isLoading = false }) => {
  const max = categories.length > 0 ? Math.max(...categories.map((c) => c.amount)) : 1

  return (
    <div
      style={{ ...CARD, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '11px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: 'rgb(110, 121, 134)',
            }}
          >
            POR CATEGORÍA
          </span>
          <div
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '13.5px',
              fontWeight: 500,
              color: 'var(--dz-text-primary)',
              marginTop: '4px',
            }}
          >
            Gastos · Junio
          </div>
        </div>
        <button
          type="button"
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '12px',
            color: 'var(--dz-signature)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Ver todo →
        </button>
      </div>

      {/* Category rows */}
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                  style={{
                    height: '12px',
                    width: '80px',
                    borderRadius: '3px',
                    background: 'rgba(220,235,255,0.06)',
                  }}
                />
                <div
                  style={{
                    height: '12px',
                    width: '70px',
                    borderRadius: '3px',
                    background: 'rgba(220,235,255,0.06)',
                  }}
                />
              </div>
              <div
                style={{ height: '4px', borderRadius: '2px', background: 'rgba(220,235,255,0.06)' }}
              />
            </div>
          ))
        : categories.map((cat) => {
            const pct = (cat.amount / max) * 100
            return (
              <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--dz-text-primary)',
                    }}
                  >
                    {cat.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--dz-font-mono)',
                      fontSize: '12.5px',
                      color: 'rgb(172, 183, 196)',
                    }}
                  >
                    {cop(cat.amount)}
                  </span>
                </div>
                <div
                  style={{
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(220,235,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: '2px',
                      background: 'var(--dz-expense)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            )
          })}
    </div>
  )
}
