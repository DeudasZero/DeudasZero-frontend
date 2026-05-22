import type { CSSProperties, FC } from 'react'
import { Avatar } from '@atoms/avatar/Avatar.tsx'
import { NavItem } from '@molecules/nav-item/NavItem.tsx'
import { Divider } from '@atoms/divider/Divider.tsx'
import type { SidebarProps, SidebarNavGroup, SidebarNavItem } from './Sidebar.types.ts'

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden
    style={{
      transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform var(--dz-transition-base)',
    }}
  >
    <path
      d="M10 12L6 8l4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Sidebar: FC<SidebarProps> = ({
  groups,
  activeItemId,
  onItemClick,
  user,
  onUserClick,
  logo,
  collapsed = false,
  onToggleCollapse,
  className,
}) => {
  const effectiveCollapsed = collapsed

  const sidebarStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--dz-bg-sidebar)',
    borderRight: '1px solid var(--dz-border-soft)',
    transition: 'width var(--dz-transition-base)',
    overflow: 'hidden',
    flexShrink: 0,
  }

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      style={sidebarStyle}
      className={`w-16 ${!effectiveCollapsed ? 'xl:w-50 2xl:w-(--dz-sidebar-w)' : ''} ${className ?? ''}`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: effectiveCollapsed ? 'center' : 'space-between',
          height: 'var(--dz-header-h)',
          padding: effectiveCollapsed ? '0' : '0 16px',
          borderBottom: '1px solid var(--dz-border-soft)',
          flexShrink: 0,
        }}
      >
        {!effectiveCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            {logo ?? (
              <span
                className="text-(--dz-fs-body) xl:text-(--dz-fs-h3) font-bold whitespace-nowrap"
                style={{
                  fontFamily: 'var(--dz-font-sans)',
                  color: 'var(--dz-signature)',
                  letterSpacing: 'var(--dz-ls-snug)',
                }}
              >
                DeudaZero
              </span>
            )}
          </div>
        )}

        {effectiveCollapsed && logo && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {logo}
          </div>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            aria-label={effectiveCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            onClick={onToggleCollapse}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--dz-r-sm)',
              cursor: 'pointer',
              color: 'var(--dz-text-faint)',
              transition: 'color var(--dz-transition-fast), background var(--dz-transition-fast)',
              flexShrink: 0,
            }}
          >
            <CollapseIcon collapsed={effectiveCollapsed} />
          </button>
        )}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          scrollbarWidth: 'none',
        }}
      >
        {groups.map((group: SidebarNavGroup, groupIndex: number) => (
          <div key={group.id}>
            {groupIndex > 0 && <Divider spacing="sm" />}
            {!effectiveCollapsed && group.label && (
              <span
                style={{
                  display: 'block',
                  padding: '8px 12px 4px',
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: 'var(--dz-fs-eyebrow)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--dz-ls-eyebrow)',
                  color: 'var(--dz-text-faint)',
                  whiteSpace: 'nowrap',
                }}
              >
                {group.label}
              </span>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {group.items.map((item: SidebarNavItem) => {
                if (effectiveCollapsed) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={item.disabled}
                      aria-label={item.label}
                      aria-current={activeItemId === item.id ? 'page' : undefined}
                      onClick={() => !item.disabled && onItemClick?.(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '40px',
                        background:
                          activeItemId === item.id ? 'var(--dz-tint-signature)' : 'transparent',
                        border: 'none',
                        borderRadius: 'var(--dz-r-sm)',
                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                        color:
                          activeItemId === item.id ? 'var(--dz-signature)' : 'var(--dz-text-muted)',
                        opacity: item.disabled ? 0.45 : 1,
                        transition:
                          'background var(--dz-transition-fast), color var(--dz-transition-fast)',
                        position: 'relative',
                      }}
                    >
                      {item.icon}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--dz-signature)',
                          }}
                        />
                      )}
                    </button>
                  )
                }
                return (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    active={activeItemId === item.id}
                    onClick={() => {
                      if (!item.disabled) onItemClick?.(item)
                    }}
                    {...(item.href !== undefined && { href: item.href })}
                    {...(item.badge !== undefined && { badge: item.badge })}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {user && (
        <div
          style={{
            borderTop: '1px solid var(--dz-border-soft)',
            padding: '12px 8px',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onUserClick}
            aria-label={`Perfil de ${user.name}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: effectiveCollapsed ? '8px 0' : '8px 12px',
              justifyContent: effectiveCollapsed ? 'center' : 'flex-start',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--dz-r-sm)',
              cursor: onUserClick ? 'pointer' : 'default',
              transition: 'background var(--dz-transition-fast)',
            }}
          >
            <Avatar
              name={user.name}
              size="sm"
              accent="signature"
              {...(user.avatarSrc !== undefined && { src: user.avatarSrc })}
            />
            {!effectiveCollapsed && (
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--dz-font-sans)',
                    fontSize: 'var(--dz-fs-caption)',
                    fontWeight: 600,
                    color: 'var(--dz-text-primary)',
                    letterSpacing: '-0.005em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name}
                </p>
                {user.email && (
                  <p
                    className="hidden xl:block m-0"
                    style={{
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: '11px',
                      color: 'var(--dz-text-faint)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginTop: '1px',
                    }}
                  >
                    {user.email}
                  </p>
                )}
              </div>
            )}
          </button>
        </div>
      )}
    </nav>
  )
}
