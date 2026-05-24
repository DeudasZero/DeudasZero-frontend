import type { FC } from 'react'
import { Badge } from '@atoms/badge/Badge.tsx'

interface LoadScoreGaugeProps {
  score: number
  label: 'SALUDABLE' | 'ALERTA' | 'RIESGO'
  isLoading?: boolean
}

const ACCENT = {
  SALUDABLE: 'income',
  ALERTA: 'debt',
  RIESGO: 'expense',
} as const

const COLOR = {
  SALUDABLE: 'var(--dz-income)',
  ALERTA: 'var(--dz-debt)',
  RIESGO: 'var(--dz-expense)',
} as const

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180
  const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) }
  const end = { x: cx + r * Math.cos(toRad(endDeg)), y: cy + r * Math.sin(toRad(endDeg)) }
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
}

export const LoadScoreGauge: FC<LoadScoreGaugeProps> = ({ score, label, isLoading = false }) => {
  const cx = 80,
    cy = 80,
    r = 60
  const startDeg = 180
  const sweepDeg = 180
  const fillDeg = startDeg + (score / 100) * sweepDeg
  const color = COLOR[label]
  const accent = ACCENT[label]

  const trackPath = describeArc(cx, cy, r, startDeg, startDeg + sweepDeg)
  const fillPath = describeArc(cx, cy, r, startDeg, Math.min(fillDeg, startDeg + sweepDeg - 0.01))

  const zones = [
    { from: 180, to: 234, color: 'var(--dz-income)', label: '0-30 SANO' },
    { from: 234, to: 288, color: 'var(--dz-debt)', label: '30-60 ALERTA' },
    { from: 288, to: 360, color: 'var(--dz-expense)', label: '60+ RIESGO' },
  ]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 self-start">
        <span
          className="font-mono uppercase tracking-widest"
          style={{ fontSize: '9.5px', letterSpacing: '1.33px', color: 'var(--dz-text-faint)' }}
        >
          SCORE DE CARGA ·
        </span>
        <Badge accent={accent} size="xs" dot>
          {label}
        </Badge>
      </div>

      <div style={{ position: 'relative', width: '160px', height: '90px', overflow: 'hidden' }}>
        {isLoading ? (
          <div
            className="w-full h-full rounded-full animate-pulse"
            style={{ background: 'var(--dz-bg-raised)' }}
          />
        ) : (
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {zones.map((z) => (
              <path
                key={z.label}
                d={describeArc(cx, cy, r, z.from, z.to)}
                fill="none"
                stroke={z.color}
                strokeWidth="12"
                strokeLinecap="butt"
                opacity={0.18}
              />
            ))}
            <path
              d={trackPath}
              fill="none"
              stroke="var(--dz-border-base)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path d={fillPath} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
            <circle
              cx={cx + r * Math.cos((fillDeg * Math.PI) / 180)}
              cy={cy + r * Math.sin((fillDeg * Math.PI) / 180)}
              r="6"
              fill={color}
              stroke="var(--dz-bg-page)"
              strokeWidth="2"
            />
          </svg>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span
            className="font-sans tabular-nums leading-none"
            style={{ fontSize: '34px', fontWeight: 500, letterSpacing: '-1.5px', color }}
          >
            {score}%
          </span>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '1px',
              color: 'var(--dz-text-faint)',
              marginTop: '2px',
            }}
          >
            DE TU INGRESO
          </span>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        {zones.map((z) => (
          <span key={z.label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: z.color }}
            />
            <span
              className="font-mono"
              style={{ fontSize: '9px', letterSpacing: '0.8px', color: 'var(--dz-text-faint)' }}
            >
              {z.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
