import type { CSSProperties, FC } from 'react'
import type { NavItemProps } from './NavItem.types.ts'

export const NavItem: FC<NavItemProps> = ({
  label,
  icon,
  href,
  active = false,
  badge,
  onClick,
  className,
}) => {
  const rootStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: 'var(--dz-r-sm)',
    fontFamily: 'var(--dz-font-sans)',
    fontSize: 'var(--dz-fs-body)',
    fontWeight: active ? 600 : 400,
    letterSpacing: 'var(--dz-ls-normal)',
    color: active ? 'var(--dz-text-primary)' : 'var(--dz-text-muted)',
    background: active ? 'var(--dz-tint-signature)' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'background var(--dz-transition-fast), color var(--dz-transition-fast)',
  }

  const iconStyle: CSSProperties = {
    flexShrink: 0,
    lineHeight: 0,
    color: active ? 'var(--dz-signature)' : 'var(--dz-text-muted)',
    transition: 'color var(--dz-transition-fast)',
  }

  const inner = (
    <>
      {icon && (
        <span aria-hidden style={iconStyle}>
          {icon}
        </span>
      )}

      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>

      {badge !== undefined && badge > 0 && (
        <span
          aria-label={`${badge} notificaciones`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '18px',
            height: '18px',
            padding: '0 5px',
            background: 'var(--dz-signature)',
            borderRadius: 'var(--dz-r-pill)',
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--dz-bg-page)',
            lineHeight: 1,
            letterSpacing: '0',
          }}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      {active && (
        <span
          aria-hidden
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'var(--dz-signature)',
            flexShrink: 0,
          }}
        />
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        aria-current={active ? 'page' : undefined}
        style={rootStyle}
        className={className}
        onClick={onClick}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      style={rootStyle}
      className={className}
      onClick={onClick}
    >
      {inner}
    </button>
  )
}
