import type { FC } from 'react'
import { Icon } from '@atoms/icon/Icon.tsx'
import { MenuIcon } from '@/assets/icons/index.ts'
import { SearchInput } from '@molecules/search-input/SearchInput.tsx'
import type { TopBarProps, TopBarAction } from './TopBar.types.ts'

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
  return (
    <header
      className={`
        flex items-center gap-2.5 lg:gap-4
        h-(--dz-header-h)
        px-4 lg:px-5 xl:px-(--dz-content-pad)
        sticky top-0 z-100 shrink-0
        ${className ?? ''}
      `}
      style={{ background: 'var(--dz-bg-page)', borderBottom: '1px solid var(--dz-border-soft)' }}
    >
      {showMenuButton && onMenuToggle && (
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={onMenuToggle}
          className="xl:hidden flex items-center justify-center w-9 h-9 shrink-0 rounded-(--dz-r-sm) border-none cursor-pointer"
          style={{ background: 'transparent', color: 'var(--dz-text-muted)' }}
        >
          <Icon as={MenuIcon} size={18} />
        </button>
      )}

      {(title || eyebrow) && (
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <span
              className="hidden lg:block"
              style={{
                fontFamily: 'var(--dz-font-mono)',
                fontSize: 'var(--dz-fs-eyebrow)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 'var(--dz-ls-eyebrow)',
                color: 'var(--dz-text-faint)',
                lineHeight: 1,
                marginBottom: '2px',
                display: 'block',
              }}
            >
              {eyebrow}
            </span>
          )}
          {title && (
            <h1
              className="m-0 font-semibold text-(--dz-fs-body) lg:text-(--dz-fs-h3) overflow-hidden text-ellipsis whitespace-nowrap leading-tight"
              style={{
                fontFamily: 'var(--dz-font-sans)',
                color: 'var(--dz-text-primary)',
                letterSpacing: 'var(--dz-ls-snug)',
              }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p
              className="hidden lg:block m-0 mt-0.5"
              style={{
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

      {onSearchChange !== undefined && (
        <div className="hidden lg:block flex-none min-w-0 max-w-55 xl:max-w-[320px]">
          <SearchInput
            value={searchValue ?? ''}
            onChange={onSearchChange}
            placeholder={searchPlaceholder ?? 'Buscar…'}
            fullWidth
          />
        </div>
      )}

      {actions.length > 0 && (
        <div className="flex items-center gap-0.5 shrink-0">
          {actions.map((action: TopBarAction, index: number) => (
            <button
              key={action.id}
              type="button"
              aria-label={action.label}
              onClick={action.onClick}
              className={`
                relative flex items-center justify-center w-9 h-9
                rounded-(--dz-r-sm) border border-transparent cursor-pointer
                ${index >= 2 ? 'hidden lg:flex' : ''}
              `}
              style={{
                background: 'transparent',
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
