import type { FC } from 'react'
import type { SpinnerProps, SpinnerSize } from './Spinner.types.ts'
import type { TextColor } from '../text/Text.types.ts'

const SIZE_PX: Record<SpinnerSize, number> = {
  sm: 14,
  md: 20,
  lg: 28,
}

const COLOR_MAP: Record<TextColor, string> = {
  primary: 'var(--dz-text-primary)',
  secondary: 'var(--dz-text-secondary)',
  muted: 'var(--dz-text-muted)',
  faint: 'var(--dz-text-faint)',
  signature: 'var(--dz-signature)',
  income: 'var(--dz-income)',
  expense: 'var(--dz-expense)',
  saving: 'var(--dz-saving)',
  debt: 'var(--dz-debt)',
}

export const Spinner: FC<SpinnerProps> = ({
  size = 'md',
  color = 'signature',
  label = 'Cargando…',
  className,
}) => {
  const px = SIZE_PX[size]
  const strokeColor =
    color === 'signature'
      ? 'var(--dz-signature)'
      : (COLOR_MAP[color as TextColor] ?? 'currentColor')

  return (
    <span
      role="status"
      aria-label={label}
      className={className}
      style={{ display: 'inline-flex', lineHeight: 0, flexShrink: 0 }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 20 20"
        fill="none"
        style={{ animation: 'dz-spin .7s linear infinite' }}
      >
        <style>{`@keyframes dz-spin { to { transform: rotate(360deg) } }`}</style>
        <circle cx="10" cy="10" r="8" stroke={strokeColor} strokeWidth="2" strokeOpacity=".2" />
        <path d="M10 2a8 8 0 0 1 8 8" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  )
}
