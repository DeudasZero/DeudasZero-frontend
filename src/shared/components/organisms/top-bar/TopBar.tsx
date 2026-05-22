import type { CSSProperties, FC } from 'react'
import { SearchInput } from '@molecules/search-input/SearchInput.tsx'
import { useBreakpoint } from '@shared/hooks/useBreakpoint.ts'
import type { TopBarProps, TopBarAction } from './TopBar.types.ts'

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path
      d="M2.5 4.5h13M2.5 9h13M2.5 13.5h13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export const TopBar: FC<TopBarProps> = ({
  title,
  subtitle,
  eyebrow,
  actions = [],
  onMenuToggle,
  showMenuButton = false,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  children,
  className,
}) => {
  const { isNarrow, isCompact } = useBreakpoint()

  const rootStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isNarrow ? '10px' : '16px',
    height: 'var(--dz-header-h)',
    padding: isNarrow ? '0 16px' : isCompact ? '0 20px' : '0 var(--dz-content-pad)',
    background: 'var(--dz-bg-page)',
    borderBottom: '1px solid var(--dz-border-soft)',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  }

  return (
    <header style={rootStyle} className={className}>
      {(showMenuButton || isCompact) && onMenuToggle && (
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={onMenuToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            background: 'transparent',
            border: 'none',
            borderRadius: 'var(--dz-r-sm)',
            cursor: 'pointer',
            color: 'var(--dz-text-muted)',
            flexShrink: 0,
          }}
        >
          <MenuIcon />
        </button>
      )}

      {(title || eyebrow) && (
        <div style={{ flex: 1, minWidth: 0 }}>
          {eyebrow && !isNarrow && (
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--dz-font-mono)',
                fontSize: 'var(--dz-fs-eyebrow)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 'var(--dz-ls-eyebrow)',
                color: 'var(--dz-text-faint)',
                lineHeight: 1,
                marginBottom: '2px',
              }}
            >
              {eyebrow}
            </span>
          )}
          {title && (
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--dz-font-sans)',
                fontSize: isNarrow ? 'var(--dz-fs-body)' : 'var(--dz-fs-h3)',
                fontWeight: 600,
                color: 'var(--dz-text-primary)',
                letterSpacing: 'var(--dz-ls-snug)',
                lineHeight: 1.1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </h1>
          )}
          {subtitle && !isNarrow && (
            <p
              style={{
                margin: '2px 0 0',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: 'var(--dz-fs-caption)',
                color: 'var(--dz-text-muted)',
                letterSpacing: '-0.005em',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children && <div style={{ flex: title ? undefined : 1 }}>{children}</div>}

      {onSearchChange !== undefined && !isNarrow && (
        <div
          style={{
            flex: title ? undefined : 1,
            minWidth: 0,
            maxWidth: isCompact ? '220px' : '320px',
          }}
        >
          <SearchInput
            value={searchValue ?? ''}
            onChange={onSearchChange}
            placeholder={searchPlaceholder ?? 'Buscar…'}
            fullWidth
          />
        </div>
      )}

      {actions.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          {(isNarrow ? actions.slice(0, 2) : actions).map((action: TopBarAction) => (
            <button
              key={action.id}
              type="button"
              aria-label={action.label}
              onClick={action.onClick}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: 'var(--dz-r-sm)',
                cursor: 'pointer',
                color: 'var(--dz-text-muted)',
                transition: 'background var(--dz-transition-fast), color var(--dz-transition-fast)',
              }}
            >
              {action.icon}
              {action.badge !== undefined && action.badge > 0 && (
                <span
                  aria-label={`${action.badge} notificaciones`}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px',
                    background: 'var(--dz-signature)',
                    borderRadius: 'var(--dz-r-pill)',
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: 'var(--dz-bg-page)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {action.badge > 99 ? '99+' : action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
