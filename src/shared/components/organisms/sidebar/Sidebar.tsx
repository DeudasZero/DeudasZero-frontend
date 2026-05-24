import type { CSSProperties, FC } from 'react'
import { Avatar } from '@atoms/avatar/Avatar.tsx'
import { Divider } from '@atoms/divider/Divider.tsx'
import type { SidebarProps, SidebarNavGroup, SidebarNavItem } from './Sidebar.types.ts'

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="19" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

const AIAdvisorCard: FC = () => (
  <div
    style={{
      background: 'rgb(20,28,36)',
      border: '1px solid rgba(220,235,255,0.06)',
      borderRadius: '10px',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginTop: '8px',
      flexShrink: 0,
    }}
  >
    <span
      style={{
        fontFamily: 'var(--dz-font-mono)',
        fontSize: '9.5px',
        fontWeight: 500,
        letterSpacing: '1.33px',
        textTransform: 'uppercase',
        color: 'var(--dz-signature)',
      }}
    >
      ★ Consejero IA
    </span>
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--dz-font-sans)',
        fontSize: '12.5px',
        lineHeight: 1.45,
        color: 'rgb(172,183,196)',
      }}
    >
      Tu carga de deuda bajó 4% este mes. Sigue así.
    </p>
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        alignSelf: 'flex-start',
        padding: '3px 0',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--dz-font-sans)',
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--dz-signature)',
      }}
    >
      Ver detalle <ArrowIcon />
    </button>
  </div>
)

const NavBtn: FC<{
  item: SidebarNavItem
  active: boolean
  collapsed: boolean
  onClick: () => void
}> = ({ item, active, collapsed, onClick }) => (
  <button
    type="button"
    disabled={item.disabled}
    aria-current={active ? 'page' : undefined}
    aria-label={collapsed ? item.label : undefined}
    onClick={onClick}
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      gap: '12px',
      width: '100%',
      height: '39px',
      padding: collapsed ? '0' : '10px 12px',
      background: active ? 'rgb(20,28,36)' : 'transparent',
      border: 'none',
      borderRadius: '6px',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--dz-font-sans)',
      fontSize: '13.5px',
      fontWeight: active ? 600 : 500,
      color: active ? 'rgb(232,238,245)' : 'rgb(172,183,196)',
      opacity: item.disabled ? 0.45 : 1,
      transition: 'background 0.15s ease, color 0.15s ease',
      outline: 'none',
      textAlign: 'left',
    }}
  >
    <span
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '2px',
        height: active ? '23px' : '0px',
        background: 'var(--dz-signature)',
        borderRadius: '0 2px 2px 0',
        transition: 'height 0.2s ease',
        flexShrink: 0,
      }}
    />

    {item.icon && (
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          lineHeight: 0,
          color: active ? 'var(--dz-signature)' : 'rgb(172,183,196)',
          transition: 'color 0.15s ease',
        }}
      >
        {item.icon}
      </span>
    )}

    {!collapsed && (
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.label}
      </span>
    )}

    {!collapsed && item.badge !== undefined && item.badge > 0 && (
      <span
        aria-label={`${item.badge} notificaciones`}
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
        }}
      >
        {item.badge > 99 ? '99+' : item.badge}
      </span>
    )}
    {collapsed && item.badge !== undefined && item.badge > 0 && (
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

export const Sidebar: FC<SidebarProps> = ({
  groups,
  activeItemId,
  onItemClick,
  user,
  onUserClick,
  logo,
  collapsed = false,
  className,
}) => {
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?'

  const sidebarStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: collapsed ? '64px' : '240px',
    background: 'rgb(9, 16, 23)',
    borderRight: '1px solid rgba(220, 235, 255, 0.05)',
    padding: collapsed ? '24px 8px' : '24px 16px',
    transition: 'width var(--dz-transition-base), padding var(--dz-transition-base)',
    overflow: 'hidden',
    flexShrink: 0,
  }

  return (
    <aside
      role="navigation"
      aria-label="Navegación principal"
      style={sidebarStyle}
      className={className}
    >
      {logo && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            marginBottom: '28px',
            paddingLeft: collapsed ? 0 : '4px',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {logo}
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflow: 'hidden',
        }}
      >
        {groups.map((group: SidebarNavGroup, gi: number) => (
          <div key={group.id}>
            {gi > 0 && <Divider spacing="sm" />}
            {!collapsed && group.label && (
              <span
                style={{
                  display: 'block',
                  padding: '0 12px 8px',
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '10px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '1.4px',
                  color: 'rgb(70, 80, 91)',
                  whiteSpace: 'nowrap',
                }}
              >
                {group.label}
              </span>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {group.items.map((item: SidebarNavItem) => (
                <NavBtn
                  key={item.id}
                  item={item}
                  active={activeItemId === item.id}
                  collapsed={collapsed}
                  onClick={() => !item.disabled && onItemClick?.(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {!collapsed && <AIAdvisorCard />}

      {user && (
        <button
          type="button"
          onClick={onUserClick}
          aria-label={`Perfil de ${user.name}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : '10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%',
            marginTop: '12px',
            padding: collapsed ? '8px 0' : '10px 12px',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: onUserClick ? 'pointer' : 'default',
            flexShrink: 0,
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgb(20,28,36)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          {collapsed ? (
            <Avatar
              name={user.name}
              size="sm"
              accent="signature"
              {...(user.avatarSrc ? { src: user.avatarSrc } : {})}
            />
          ) : (
            <>
              <div
                style={{
                  flexShrink: 0,
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--dz-signature)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--dz-font-sans)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'rgb(13,20,25)',
                    lineHeight: 1,
                  }}
                >
                  {initials}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--dz-font-sans)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'rgb(232,238,245)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name}
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: '10.5px',
                    letterSpacing: '0.42px',
                    textTransform: 'uppercase',
                    color: 'rgb(110,121,134)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Editar perfil
                </p>
              </div>
              <span style={{ color: 'rgb(110,121,134)', flexShrink: 0, lineHeight: 0 }}>
                <DotsIcon />
              </span>
            </>
          )}
        </button>
      )}
    </aside>
  )
}
