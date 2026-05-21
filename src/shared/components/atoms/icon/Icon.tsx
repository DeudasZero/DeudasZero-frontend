import type { FC } from 'react'
import type { IconProps } from './Icon.types.ts'
import type { TextColor } from '../text/Text.types.ts'

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

export const Icon: FC<IconProps> = ({
  children,
  size = 20,
  color = 'inherit',
  label,
  className,
}) => {
  const resolvedColor =
    color === 'inherit' ? 'currentColor' : (COLOR_MAP[color as TextColor] ?? 'currentColor')

  const px = typeof size === 'number' ? `${size}px` : size

  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={!label || undefined}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        color: resolvedColor,
        flexShrink: 0,
        lineHeight: 0,
        width: px,
        height: px,
      }}
    >
      {children}
    </span>
  )
}
