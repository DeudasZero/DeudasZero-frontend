import type { CSSProperties, FC } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 11L12 4L20 11V20H14V14H10V20H4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)
const TransactionsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 8H16M12 4L16 8L12 12M20 16H8M12 20L8 16L12 12"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const DebtIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)
const AIIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3L14 9L20 9L15 13L17 19L12 15L7 19L9 13L4 9L10 9Z"
      stroke="currentColor"
      strokeWidth="1.6"
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
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const DZLogo = () => (
  <svg width="23" height="23" viewBox="0 0 32 32" fill="none" aria-label="DeudaZero">
    <circle cx="16" cy="16" r="13" stroke="rgb(232, 238, 245)" strokeWidth="2" />
    <path d="M6.8 25.2L25.2 6.8" stroke="#5EE1E6" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
)

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio', icon: HomeIcon, path: '/dashboard' },
  { id: 'transactions', label: 'Ingresos & Gastos', icon: TransactionsIcon, path: '/transactions' },
  { id: 'debts', label: 'Mis deudas', icon: DebtIcon, path: '/debts' },
  { id: 'ai', label: 'Plan IA', icon: AIIcon, path: '/ai' },
]

interface NavButtonProps {
  label: string
  Icon: FC
  active: boolean
  onClick: () => void
}

const NavButton: FC<NavButtonProps> = ({ label, Icon, active, onClick }) => {
  const btnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    height: '39px',
    padding: '10px 12px',
    background: active ? 'rgb(20, 28, 36)' : 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'var(--dz-font-sans)',
    fontSize: '13.5px',
    fontWeight: active ? 600 : 400,
    color: active ? 'rgb(232, 238, 245)' : 'rgb(172, 183, 196)',
    transition: 'background 0.15s ease, color 0.15s ease',
    textAlign: 'left',
    position: 'relative',
    outline: 'none',
  }

  return (
    <button
      type="button"
      style={btnStyle}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
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
          background: '#5EE1E6',
          borderRadius: '0 2px 2px 0',
          transition: 'height 0.2s ease',
        }}
      />

      <span
        style={{
          flexShrink: 0,
          lineHeight: 0,
          color: active ? '#5EE1E6' : 'rgb(172, 183, 196)',
          transition: 'color 0.15s ease',
        }}
      >
        <Icon />
      </span>

      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  )
}

interface AppSidebarProps {
  userName?: string
  userEmail?: string
}

export const AppSidebar: FC<AppSidebarProps> = ({
  userName = 'Mariana López',
  userEmail = 'mariana@email.com',
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const activeId = NAV_ITEMS.find((item) => pathname.startsWith(item.path))?.id ?? 'dashboard'

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '240px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'rgb(9, 16, 23)',
        borderRight: '1px solid rgba(220, 235, 255, 0.05)',
        padding: '24px 16px',
        flexShrink: 0,
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '28px',
          paddingLeft: '4px',
        }}
      >
        <DZLogo />
        <span
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'rgb(232, 238, 245)',
            letterSpacing: '-0.2px',
          }}
        >
          <span>Deuda</span>
          <span style={{ color: '#5EE1E6' }}>Zero</span>
        </span>
      </div>

      <span
        style={{
          fontFamily: 'var(--dz-font-mono)',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          color: 'var(--dz-text-faint)',
          paddingLeft: '12px',
          marginBottom: '8px',
        }}
      >
        Menú
      </span>

      <nav
        aria-label="Navegación principal"
        style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: 'auto' }}
      >
        {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
          <NavButton
            key={id}
            label={label}
            Icon={Icon}
            active={activeId === id}
            onClick={() => navigate(path)}
          />
        ))}
      </nav>

      <div
        style={{
          marginTop: '24px',
          background: 'rgb(20, 28, 36)',
          border: '1px solid rgba(220, 235, 255, 0.06)',
          borderRadius: '10px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '9.5px',
            fontWeight: 500,
            letterSpacing: '1.33px',
            textTransform: 'uppercase',
            color: '#5EE1E6',
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
            color: 'rgb(172, 183, 196)',
          }}
        >
          Tu carga de deuda bajó 4% este mes. Sigue así.
        </p>

        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            alignSelf: 'flex-start',
            padding: '5px 0',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#5EE1E6',
          }}
        >
          Ver detalle <ArrowIcon />
        </button>
      </div>

      <button
        type="button"
        aria-label={`Ir a perfil de ${userName}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '16px',
          padding: '10px 12px',
          background: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'rgb(20, 28, 36)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#5EE1E6',
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
              color: 'rgb(13, 20, 25)',
              lineHeight: 1,
            }}
          >
            {initials}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'rgb(232, 238, 245)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {userName}
          </span>
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10.5px',
              letterSpacing: '0.42px',
              textTransform: 'uppercase',
              color: 'var(--dz-text-faint)',
            }}
          >
            {userEmail}
          </span>
        </div>

        <span style={{ color: 'var(--dz-text-faint)', flexShrink: 0, lineHeight: 0 }}>
          <DotsIcon />
        </span>
      </button>
    </aside>
  )
}
