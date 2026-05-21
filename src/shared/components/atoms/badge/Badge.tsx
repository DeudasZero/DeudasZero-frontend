import type { FC } from 'react'
import type { BadgeProps, BadgeSize } from './Badge.types.ts'
import type { DZAccent } from '../tokens/types.ts'

const ACCENT_COLOR: Record<DZAccent, string> = {
  signature: 'var(--dz-signature)',
  income: 'var(--dz-income)',
  expense: 'var(--dz-expense)',
  saving: 'var(--dz-saving)',
  debt: 'var(--dz-debt)',
  neutral: 'var(--dz-text-secondary)',
}

const ACCENT_TINT: Record<DZAccent, string> = {
  signature: 'var(--dz-tint-signature)',
  income: 'var(--dz-tint-income)',
  expense: 'var(--dz-tint-expense)',
  saving: 'var(--dz-tint-saving)',
  debt: 'var(--dz-tint-debt)',
  neutral: 'rgba(255,255,255,0.06)',
}

const SIZE_STYLES: Record<BadgeSize, { height: string; padding: string; fontSize: string }> = {
  xs: { height: '20px', padding: '0 7px', fontSize: '10.5px' },
  sm: { height: '24px', padding: '0 10px', fontSize: '11.5px' },
}

export const Badge: FC<BadgeProps> = ({
  accent = 'neutral',
  size = 'sm',
  dot = false,
  children,
  className,
}) => {
  const { height, padding, fontSize } = SIZE_STYLES[size]

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        height,
        padding,
        borderRadius: 'var(--dz-r-pill)',
        fontFamily: 'var(--dz-font-mono)',
        fontSize,
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: ACCENT_TINT[accent],
        color: ACCENT_COLOR[accent],
        lineHeight: 1,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {dot && (
        <span
          aria-hidden
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  )
}
