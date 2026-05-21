import type { FC } from 'react'
import type { ProgressBarProps, ProgressBarSize } from './ProgressBar.types.ts'
import type { DZAccent } from '../tokens/types.ts'

const HEIGHT: Record<ProgressBarSize, string> = {
  xs: '3px',
  sm: '4px',
  md: '6px',
}

const ACCENT_COLOR: Record<DZAccent, string> = {
  signature: 'var(--dz-signature)',
  income: 'var(--dz-income)',
  expense: 'var(--dz-expense)',
  saving: 'var(--dz-saving)',
  debt: 'var(--dz-debt)',
  neutral: 'var(--dz-text-muted)',
}

export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  accent = 'signature',
  size = 'sm',
  animate = true,
  label,
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={className}
      style={{
        width: '100%',
        height: HEIGHT[size],
        background: 'var(--dz-border-base)',
        borderRadius: 'var(--dz-r-pill)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${clamped}%`,
          borderRadius: 'inherit',
          background: ACCENT_COLOR[accent],
          transition: animate ? 'width var(--dz-transition-slow) ease' : 'none',
        }}
      />
    </div>
  )
}
