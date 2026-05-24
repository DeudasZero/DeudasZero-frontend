import type { FC } from 'react'
import { CARD } from './DashboardPage.tsx'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
const INCOME = [4_200_000, 3_800_000, 4_600_000, 3_900_000, 4_100_000, 5_200_000]
const EXPENSE = [2_800_000, 3_100_000, 2_600_000, 2_900_000, 2_700_000, 2_454_900]

const W = 560,
  H = 200,
  PAD_L = 36,
  PAD_R = 12,
  PAD_T = 16,
  PAD_B = 32

function toY(v: number, max: number): number {
  return PAD_T + (1 - v / max) * (H - PAD_T - PAD_B)
}
function toX(i: number): number {
  return PAD_L + (i / (MONTHS.length - 1)) * (W - PAD_L - PAD_R)
}

function polyline(vals: number[], max: number): string {
  return vals.map((v, i) => `${toX(i)},${toY(v, max)}`).join(' ')
}

interface ChartCardProps {
  isLoading?: boolean
}

export const ChartCard: FC<ChartCardProps> = ({ isLoading = false }) => {
  const maxVal = Math.max(...INCOME, ...EXPENSE) * 1.05
  const gridLines = [0, 1_000_000, 3_000_000, 4_000_000, 5_000_000]

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
            HISTÓRICO · ÚLTIMOS 6 MESES
          </span>
          <div
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.17px',
              color: 'var(--dz-text-primary)',
              marginTop: '4px',
            }}
          >
            Ingresos vs Gastos
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            ['INGRESOS', 'var(--dz-signature)'],
            ['GASTOS', 'var(--dz-expense)'],
          ].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '10px',
                  letterSpacing: '1px',
                  color: 'rgb(110, 121, 134)',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG chart */}
      {isLoading ? (
        <div
          style={{ height: `${H}px`, background: 'rgba(220,235,255,0.04)', borderRadius: '6px' }}
        />
      ) : (
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          {/* Grid lines */}
          {gridLines.map((v) => (
            <g key={v}>
              <line
                x1={PAD_L}
                y1={toY(v, maxVal)}
                x2={W - PAD_R}
                y2={toY(v, maxVal)}
                stroke="rgba(220,235,255,0.05)"
                strokeWidth="1"
              />
              <text
                x={PAD_L - 8}
                y={toY(v, maxVal) + 3}
                fontSize="9.5"
                textAnchor="end"
                fill="rgb(110,121,134)"
                fontFamily="Geist Mono, monospace"
                letterSpacing="0.04em"
              >
                {v === 0 ? '0' : `$${v / 1_000_000}M`}
              </text>
            </g>
          ))}

          {/* Month labels */}
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={toX(i)}
              y={H - 4}
              fontSize="10"
              textAnchor="middle"
              fill="rgb(110,121,134)"
              fontFamily="Geist Mono, monospace"
            >
              {m}
            </text>
          ))}

          {/* Income line */}
          <polyline
            points={polyline(INCOME, maxVal)}
            fill="none"
            stroke="var(--dz-signature)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {INCOME.map((v, i) => (
            <circle key={i} cx={toX(i)} cy={toY(v, maxVal)} r="3.5" fill="var(--dz-signature)" />
          ))}

          {/* Expense line */}
          <polyline
            points={polyline(EXPENSE, maxVal)}
            fill="none"
            stroke="var(--dz-expense)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {EXPENSE.map((v, i) => (
            <circle key={i} cx={toX(i)} cy={toY(v, maxVal)} r="3.5" fill="var(--dz-expense)" />
          ))}
        </svg>
      )}
    </div>
  )
}
