import type { FC } from 'react'
import type { AvatarProps, AvatarSize } from './Avatar.types.ts'
import type { DZAccent } from '../tokens/types.ts'

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
}

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

const ACCENT_CYCLE: DZAccent[] = ['signature', 'saving', 'expense', 'debt', 'income']

function nameToAccent(name: string): DZAccent {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const accent = ACCENT_CYCLE[sum % ACCENT_CYCLE.length]
  return accent as DZAccent
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.length >= 2
    ? `${parts[0]?.[0] ?? ''}${parts[parts.length - 1]?.[0] ?? ''}`.toUpperCase()
    : (parts[0]?.slice(0, 2) ?? '').toUpperCase()
}

export const Avatar: FC<AvatarProps> = ({ src, name, size = 'md', accent, className }) => {
  const px = SIZE_PX[size]
  const resolvedAccent = accent ?? nameToAccent(name)

  return (
    <span
      title={name}
      className={className}
      style={{
        width: `${px}px`,
        height: `${px}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: ACCENT_TINT[resolvedAccent],
        border: `1.5px solid ${ACCENT_COLOR[resolvedAccent]}33`,
        color: ACCENT_COLOR[resolvedAccent],
        fontSize: `${Math.round(px * 0.36)}px`,
        fontWeight: 600,
        fontFamily: 'var(--dz-font-sans)',
        letterSpacing: '-0.01em',
        userSelect: 'none',
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        getInitials(name)
      )}
    </span>
  )
}
