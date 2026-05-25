import type { FC } from 'react'
import { Skeleton } from '@atoms/skeleton/index.ts'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
const INCOME = [4_200_000, 3_800_000, 4_600_000, 3_900_000, 4_100_000, 5_200_000]
const EXPENSE = [2_800_000, 3_100_000, 2_600_000, 2_900_000, 2_700_000, 2_454_900]

const W = 560,
  H = 200,
  PAD_L = 36,
  PAD_R = 12,
  PAD_T = 16,
  PAD_B = 32

function toY(v: number, max: number) {
  return PAD_T + (1 - v / max) * (H - PAD_T - PAD_B)
}
function toX(i: number) {
  return PAD_L + (i / (MONTHS.length - 1)) * (W - PAD_L - PAD_R)
}
function polyline(vals: number[], max: number) {
  return vals.map((v, i) => `${toX(i)},${toY(v, max)}`).join(' ')
}

const LEGEND = [
  { label: 'INGRESOS', color: 'var(--dz-signature)' },
  { label: 'GASTOS', color: 'var(--dz-expense)' },
] as const

export const ChartCard: FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
  const maxVal = Math.max(...INCOME, ...EXPENSE) * 1.05

  return (
    <div className="bg-[rgb(20,28,36)] rounded-[10px] overflow-hidden p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[1.4px] uppercase text-[rgb(110,121,134)]">
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
              <span className="font-mono text-[10px] tracking-[1px] text-[rgb(110,121,134)]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton width="100%" height={`${H}px`} />
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          style={{ overflow: 'visible' }}
          aria-label="Gráfico de ingresos vs gastos últimos 6 meses"
          role="img"
        >
          {[0, 1_000_000, 3_000_000, 4_000_000, 5_000_000].map((v) => (
            <line
              key={v}
              x1={PAD_L}
              x2={W - PAD_R}
              y1={toY(v, maxVal)}
              y2={toY(v, maxVal)}
              stroke="rgba(220,235,255,0.05)"
              strokeWidth="1"
            />
          ))}
          <polyline
            points={polyline(INCOME, maxVal)}
            fill="none"
            stroke="var(--dz-signature)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <polyline
            points={polyline(EXPENSE, maxVal)}
            fill="none"
            stroke="var(--dz-expense)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {INCOME.map((v, i) => (
            <circle key={i} cx={toX(i)} cy={toY(v, maxVal)} r="3" fill="var(--dz-signature)" />
          ))}
          {EXPENSE.map((v, i) => (
            <circle key={i} cx={toX(i)} cy={toY(v, maxVal)} r="3" fill="var(--dz-expense)" />
          ))}
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={toX(i)}
              y={H - 4}
              textAnchor="middle"
              fontSize="10"
              fill="rgb(110,121,134)"
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
