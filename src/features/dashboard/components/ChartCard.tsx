import type { FC } from 'react'
import { Skeleton } from '@atoms/skeleton/index.ts'
import type { MonthlyPoint } from '../types/dashboard.types.ts'

interface ChartCardProps {
  history: MonthlyPoint[]
  isLoading?: boolean
}

const W = 560,
  H = 200,
  PAD_L = 36,
  PAD_R = 12,
  PAD_T = 16,
  PAD_B = 32

function toY(v: number, max: number) {
  return PAD_T + (1 - v / max) * (H - PAD_T - PAD_B)
}
function toX(i: number, total: number) {
  return PAD_L + (i / Math.max(total - 1, 1)) * (W - PAD_L - PAD_R)
}
function polyline(vals: number[], max: number, total: number) {
  return vals.map((v, i) => `${toX(i, total)},${toY(v, max)}`).join(' ')
}

const LEGEND = [
  { label: 'INGRESOS', color: 'var(--dz-signature)' },
  { label: 'GASTOS', color: 'var(--dz-expense)' },
] as const

const GRID_RATIOS = [0, 0.25, 0.5, 0.75, 1]

export const ChartCard: FC<ChartCardProps> = ({ history, isLoading = false }) => {
  const incomeVals = history.map((p) => p.income)
  const expenseVals = history.map((p) => p.expense)
  const months = history.map((p) => p.month)

  const maxVal = Math.max(...incomeVals, ...expenseVals, 1) * 1.05

  return (
    <div className="bg-[rgb(20,28,36)] rounded-[10px] overflow-hidden p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[1.4px] uppercase text-(--dz-text-faint)">
            HISTÓRICO · ÚLTIMOS 6 MESES
          </span>
          <span className="font-sans text-[17px] font-semibold tracking-tight text-(--dz-text-primary)">
            Ingresos vs Gastos
          </span>
        </div>
        <div className="flex gap-3">
          {LEGEND.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span className="font-mono text-[10px] tracking-[1px] text-(--dz-text-faint)">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton width="100%" height={`${H}px`} />
      ) : history.length === 0 ? (
        <div
          className="flex items-center justify-center"
          style={{ height: `${H}px`, color: 'var(--dz-text-faint)', fontSize: '13px' }}
        >
          Sin datos históricos aún
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          style={{ overflow: 'visible' }}
          aria-label="Gráfico de ingresos vs gastos últimos 6 meses"
          role="img"
        >
          {GRID_RATIOS.map((ratio) => {
            const yVal = maxVal * ratio
            return (
              <line
                key={ratio}
                x1={PAD_L}
                x2={W - PAD_R}
                y1={toY(yVal, maxVal)}
                y2={toY(yVal, maxVal)}
                stroke="rgba(220,235,255,0.05)"
                strokeWidth="1"
              />
            )
          })}

          <polyline
            points={polyline(incomeVals, maxVal, months.length)}
            fill="none"
            stroke="var(--dz-signature)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <polyline
            points={polyline(expenseVals, maxVal, months.length)}
            fill="none"
            stroke="var(--dz-expense)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {incomeVals.map((v, i) => (
            <circle
              key={i}
              cx={toX(i, months.length)}
              cy={toY(v, maxVal)}
              r="3"
              fill="var(--dz-signature)"
            />
          ))}

          {expenseVals.map((v, i) => (
            <circle
              key={i}
              cx={toX(i, months.length)}
              cy={toY(v, maxVal)}
              r="3"
              fill="var(--dz-expense)"
            />
          ))}

          {months.map((m, i) => (
            <text
              key={m}
              x={toX(i, months.length)}
              y={H - 4}
              textAnchor="middle"
              fontSize="10"
              fill="var(--dz-text-faint)"
              fontFamily="var(--dz-font-mono)"
            >
              {m}
            </text>
          ))}
        </svg>
      )}
    </div>
  )
}
