import { useState, useMemo, type ReactNode } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hookStore.ts'
import { addTransaction } from '@/features/transactions/store/transactions.slice.ts'
import { addDebt } from '@/features/debts/store/debts.slice.ts'
import type { DebtFormValues } from '@/features/debts/types/debts.types.ts'
import { LoginPage } from '@/features/auth/components/LoginPage.tsx'
import { RegisterPage } from '@/features/auth/components/RegisterPage.tsx'
import { DashboardPage } from '@/features/dashboard/index.ts'
import { TransactionsPage, NewMovementModal } from '@/features/transactions/index.ts'
import { DebtsPage, RegisterDebtModal } from '@/features/debts/index.ts'
import { PlanIAPage } from '@/features/plan-ia/index.ts'
import { ProfilePage } from '@/features/profile/index.ts'
import { DashboardLayout } from '@/shared/components/organisms/dashboard-layout/index.js'
import { Sidebar } from '@/shared/components/organisms/sidebar/index.js'
import { TopBar } from '@/shared/components/organisms/top-bar/index.js'
import type { NewTransactionForm } from '@/features/transactions/types/transactions.types.ts'
import type { SidebarAdvisorMessage } from '@/shared/components/organisms/sidebar/Sidebar.types.ts'
import logo from '@/assets/logo.png'

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
  <div className="flex items-center gap-2">
    <img src={logo} alt="DeudaZero Logo" className="h-7 w-7 object-contain" />
    <span className="font-sans text-[15px] font-bold text-[rgb(232,238,245)] tracking-[-0.2px]">
      Deuda<span className="text-[#5EE1E6]">Zero</span>
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

const ROUTE_META: Record<string, { eyebrow: string; title: (n: string) => string; cta: string }> = {
  '/dashboard': { eyebrow: 'PANEL', title: (n) => `Hola, ${n}`, cta: 'Registrar movimiento' },
  '/transactions': {
    eyebrow: 'MIS TRANSACCIONES',
    title: () => 'Ingresos & Gastos',
    cta: 'Nuevo movimiento',
  },
  '/debts': { eyebrow: 'MIS DEUDAS', title: () => 'Mis deudas', cta: 'Registrar deuda' },
  '/ai': { eyebrow: 'PLAN IA', title: () => 'Plan de liquidación · Consejero IA', cta: '' },
  '/profile': { eyebrow: 'CUENTA', title: () => 'Mi perfil', cta: '' },
}

function month() {
  return new Date().toLocaleString('es-CO', { month: 'long', year: 'numeric' }).toUpperCase()
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${new Intl.NumberFormat('es-CO').format(Math.round(n))}`
  return `$${n}`
}

function buildAdvisorMessage(
  dashboardSummary:
    | { totalIncome: number; totalDebts: number; debtRatio: number }
    | null
    | undefined,
  debtsSummary:
    | {
        loadScore: number
        scoreLabel: string
        totalMonthlyInterest: number
        minPaymentTotal: number
        activeCount: number
      }
    | null
    | undefined,
  worstDebt: { name: string; monthlyRate: number } | null | undefined,
): string {
  if (!dashboardSummary && !debtsSummary) {
    return 'Cargando tu resumen financiero…'
  }

  const activeCount = debtsSummary?.activeCount ?? 0
  const loadScore = debtsSummary?.loadScore ?? dashboardSummary?.debtRatio ?? 0
  const monthlyInterest = debtsSummary?.totalMonthlyInterest ?? 0
  const minPayment = debtsSummary?.minPaymentTotal ?? 0

  if (activeCount === 0) {
    return '¡Sin deudas activas! Tu situación financiera está en zona saludable. Sigue así.'
  }

  if (loadScore >= 50) {
    const worstMsg = worstDebt
      ? ` Prioriza "${worstDebt.name}" (${worstDebt.monthlyRate}%/mes).`
      : ''
    return `Tu carga de deuda es del ${loadScore}% — zona de riesgo. Pagas ${fmt(monthlyInterest)}/mes en intereses.${worstMsg}`
  }

  if (loadScore >= 30) {
    const worstMsg = worstDebt
      ? ` Enfoca pagos extra en "${worstDebt.name}" (${worstDebt.monthlyRate}%/mes).`
      : ''
    return `Carga al ${loadScore}% — zona de alerta. Tu pago mínimo mensual es ${fmt(minPayment)}.${worstMsg}`
  }

  if (monthlyInterest > 0) {
    return `Carga al ${loadScore}% — zona saludable. Pagas ${fmt(monthlyInterest)}/mes en intereses. ¡Buen ritmo!`
  }

  return `Tu carga de deuda es del ${loadScore}%. Sigue manteniendo este control financiero.`
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const hasToken =
    Boolean(localStorage.getItem('token')) || Boolean(sessionStorage.getItem('token'))
  return isAuthenticated || hasToken ? <>{children}</> : <Navigate to="/login" replace />
}

function AppShell() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()

  const user = useAppSelector((s) => s.auth.user)
  const dashboardSummary = useAppSelector((s) => s.dashboard.data?.summary)
  const debtsSummary = useAppSelector((s) => s.debts.data?.summary)
  const worstDebt = useAppSelector((s) => s.dashboard.data?.summary?.worstDebt)

  const firstName = user?.name?.split(' ')[0] ?? 'Usuario'

  const [txModalOpen, setTxModalOpen] = useState(false)
  const [debtModalOpen, setDebtModalOpen] = useState(false)

  const activeId =
    NAV_GROUPS[0]!.items.find((i) => pathname.startsWith(i.href ?? ''))?.id ?? 'dashboard'
  const meta = ROUTE_META[pathname] ?? ROUTE_META['/dashboard']!

  const advisorMessage = useMemo(
    (): SidebarAdvisorMessage => ({
      text: buildAdvisorMessage(dashboardSummary, debtsSummary, worstDebt),
      onDetailClick: () => navigate('/ai'),
    }),
    [dashboardSummary, debtsSummary, worstDebt, navigate],
  )

  function handleCtaClick() {
    if (pathname.startsWith('/debts')) return setDebtModalOpen(true)
    setTxModalOpen(true)
  }

  async function handleGlobalTxSave(form: NewTransactionForm) {
    await dispatch(addTransaction(form))
    setTxModalOpen(false)
  }

  return (
    <>
      <DashboardLayout
        sidebar={
          <Sidebar
            groups={NAV_GROUPS}
            activeItemId={activeId}
            onItemClick={(item) => item.href && navigate(item.href)}
            onUserClick={() => navigate('/profile')}
            logo={<DZLogo />}
            advisorMessage={advisorMessage}
            user={{
              name: user?.name ?? 'Usuario',
              email: user?.email ?? 'usuario@deudazero.com',
            }}
          />
        }
        topBar={
          <TopBar eyebrow={`${meta.eyebrow} · ${month()}`} title={meta.title(firstName)}>
            {meta.cta && (
              <button
                type="button"
                onClick={handleCtaClick}
                className="flex items-center gap-2 font-sans font-semibold rounded-[8px] cursor-pointer transition-opacity hover:opacity-[0.88] shrink-0 whitespace-nowrap"
                style={{
                  padding: '9px 16px',
                  background: 'var(--dz-signature)',
                  border: 'none',
                  fontSize: '14px',
                  letterSpacing: '-0.07px',
                  color: 'rgb(13,20,25)',
                }}
              >
                <PlusIcon /> {meta.cta}
              </button>
            )}
          </TopBar>
        }
      >
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/debts" element={<DebtsPage />} />
          <Route path="/ai" element={<PlanIAPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>

      <NewMovementModal
        open={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        onSave={handleGlobalTxSave}
      />
      <RegisterDebtModal
        open={debtModalOpen}
        onClose={() => setDebtModalOpen(false)}
        onSave={async (values: DebtFormValues) => {
          await dispatch(addDebt(values))
          setDebtModalOpen(false)
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
