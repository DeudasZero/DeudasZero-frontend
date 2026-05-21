import type { FC } from 'react'
import type { KbdProps } from './Kbd.types.ts'

export const Kbd: FC<KbdProps> = ({ children, className }) => (
  <kbd
    className={className}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '22px',
      padding: '0 6px',
      minWidth: '22px',
      background: 'var(--dz-bg-raised)',
      border: '1px solid var(--dz-border-strong)',
      borderBottom: '2px solid var(--dz-border-strong)',
      borderRadius: 'var(--dz-r-xs)',
      fontFamily: 'var(--dz-font-mono)',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.02em',
      color: 'var(--dz-text-secondary)',
      userSelect: 'none',
      lineHeight: 1,
    }}
  >
    {children}
  </kbd>
)
