import type { CSSProperties, FC } from 'react'
import type { ListItemProps } from './ListItem.types.ts'

export const ListItem: FC<ListItemProps> = ({
  title,
  subtitle,
  leading,
  trailing,
  onClick,
  disabled = false,
  className,
}) => {
  const isInteractive = Boolean(onClick)

  const rootStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: 'var(--dz-r-sm)',
    width: '100%',
    textAlign: 'left',
    cursor: isInteractive && !disabled ? 'pointer' : 'default',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dz-transition-fast)',
  }

  const content = (
    <>
      {leading && (
        <span style={{ flexShrink: 0, lineHeight: 0, color: 'var(--dz-text-muted)' }}>
          {leading}
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-body)',
            fontWeight: 500,
            color: 'var(--dz-text-primary)',
            letterSpacing: 'var(--dz-ls-normal)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            style={{
              margin: '2px 0 0',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              color: 'var(--dz-text-muted)',
              letterSpacing: '-0.005em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {trailing && <span style={{ flexShrink: 0 }}>{trailing}</span>}
    </>
  )

  if (isInteractive) {
    return (
      <button
        type="button"
        style={rootStyle}
        className={className}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {content}
      </button>
    )
  }

  return (
    <div style={rootStyle} className={className}>
      {content}
    </div>
  )
}
