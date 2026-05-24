import { useState, type ReactNode } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hookStore.ts'
import { LoginPage } from '@/features/auth/components/LoginPage.tsx'
import { RegisterPage } from '@/features/auth/components/RegisterPage.tsx'
import { DashboardPage } from '@/features/dashboard/index.ts'
import { TransactionsPage, NewMovementModal } from '@/features/transactions/index.ts'
import { DashboardLayout } from '@/shared/components/organisms/dashboard-layout/index.js'
import { Sidebar } from '@/shared/components/organisms/sidebar/index.js'
import { TopBar } from '@/shared/components/organisms/top-bar/index.js'

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
const TxIcon = () => (
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
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const DZLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="13" stroke="rgb(232,238,245)" strokeWidth="2" />
      <path d="M6.8 25.2L25.2 6.8" stroke="#5EE1E6" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
    <span
      style={{
        fontFamily: 'var(--dz-font-sans)',
        fontSize: '15px',
        fontWeight: 700,
        color: 'rgb(232,238,245)',
        letterSpacing: '-0.2px',
      }}
    >
      Deuda<span style={{ color: '#5EE1E6' }}>Zero</span>
    </span>
  </div>
)

const NAV_GROUPS = [
  {
    id: 'main',
    label: 'Menú',
    items: [
      { id: 'dashboard', label: 'Inicio', icon: <HomeIcon />, href: '/dashboard' },
      { id: 'transactions', label: 'Ingresos & Gastos', icon: <TxIcon />, href: '/transactions' },
      { id: 'debts', label: 'Mis deudas', icon: <DebtIcon />, href: '/debts' },
      { id: 'ai', label: 'Plan IA', icon: <AIIcon />, href: '/ai' },
    ],
  },
]

const ROUTE_META: Record<string, { eyebrow: string; title: (n: string) => string }> = {
  '/dashboard': { eyebrow: 'PANEL', title: (n) => `Hola, ${n}` },
  '/transactions': { eyebrow: 'MIS TRANSACCIONES', title: () => 'Ingresos & Gastos' },
  '/debts': { eyebrow: 'MIS DEUDAS', title: () => 'Deudas activas' },
  '/ai': { eyebrow: 'PLAN IA', title: () => 'Consejero IA' },
}

function month() {
  return new Date().toLocaleString('es-CO', { month: 'long', year: 'numeric' }).toUpperCase()
}

const Placeholder = ({ title }: { title: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      fontFamily: 'var(--dz-font-sans)',
      fontSize: '15px',
      color: 'rgb(110,121,134)',
    }}
  >
    {title} — próximamente
  </div>
)

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const hasToken =
    Boolean(localStorage.getItem('token')) || Boolean(sessionStorage.getItem('token'))
  return isAuthenticated || hasToken ? <>{children}</> : <Navigate to="/login" replace />
}

function AppShell() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = useAppSelector((s) => s.auth.user)
  const firstName = user?.name?.split(' ')[0] ?? 'Mariana'

  const [modalOpen, setModalOpen] = useState(false)

  const activeId =
    NAV_GROUPS[0]!.items.find((i) => pathname.startsWith(i.href ?? ''))?.id ?? 'dashboard'
  const meta = ROUTE_META[pathname] ?? ROUTE_META['/dashboard']!

  return (
    <>
      <DashboardLayout
        sidebar={
          <Sidebar
            groups={NAV_GROUPS}
            activeItemId={activeId}
            onItemClick={(item) => item.href && navigate(item.href)}
            logo={<DZLogo />}
            user={{
              name: user?.name ?? 'Mariana López',
              email: user?.email ?? 'usuario@deudazero.com',
            }}
          />
        }
        topBar={
          <TopBar eyebrow={`${meta.eyebrow} · ${month()}`} title={meta.title(firstName)}>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                background: '#5EE1E6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '-0.07px',
                color: 'rgb(13,20,25)',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.88'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
              }}
            >
              <PlusIcon /> Registrar movimiento
            </button>
          </TopBar>
        }
      >
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/debts" element={<Placeholder title="Mis deudas" />} />
          <Route path="/ai" element={<Placeholder title="Plan IA" />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>

      <NewMovementModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(form) => {
          console.log('new movement', form)
          setModalOpen(false)
        }}
      />
    </>
  )
}

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/*"
      element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }
    />
  </Routes>
)

export default AppRouter
