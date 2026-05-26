import type { FC } from 'react'
import type { IconButtonProps } from './IconButton.types.ts'

export const IconButton: FC<IconButtonProps> = ({
  onClick,
  disabled = false,
  label,
  title,
  hoverBorder,
  hoverColor,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={title}
    style={{
      background: 'transparent',
      border: '1px solid rgba(220,235,255,0.5)',
      borderRadius: '6px',
      padding: '4px 6px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: 'rgba(220,235,255,0.5)',
      display: 'inline-flex',
      alignItems: 'center',
      lineHeight: 0,
      transition: 'all 0.15s',
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = hoverBorder
        ;(e.currentTarget as HTMLButtonElement).style.color = hoverColor
      }
    }}
    onMouseLeave={(e) => {
      ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,235,255,0.08)'
      ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--dz-text-faint)'
    }}
  >
    {children}
  </button>
)
