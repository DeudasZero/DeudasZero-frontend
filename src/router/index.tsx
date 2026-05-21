import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// ── Átomos ──────────────────────────────────────────────────────────────────
import { Button } from '@atoms/button/Button.tsx'
import { Avatar } from '@atoms/avatar/Avatar.tsx'
import { Badge } from '@atoms/badge/Badge.tsx'
import { Money } from '@atoms/money/Money.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
import { Spinner } from '@atoms/spinner/Spinner.tsx'
import { Switch } from '@atoms/switch/Switch.tsx'
import { Divider } from '@atoms/divider/Divider.tsx'

// ── Moléculas ────────────────────────────────────────────────────────────────
import { StatCard } from '@molecules/stat-card/StatCard.tsx'
import { DebtRow } from '@molecules/debt-row/DebtRow.tsx'
import { PageHeader } from '@molecules/page-header/PageHeader.tsx'
import { Alert } from '@molecules/alert/Alert.tsx'
import { SectionHeader } from '@molecules/section-header/SectionHeader.tsx'

// ── Organismos ───────────────────────────────────────────────────────────────
import { DashboardLayout } from '@organisms/dashboard-layout/DashboardLayout.tsx'
import { Sidebar } from '@organisms/sidebar/Sidebar.tsx'
import { TopBar } from '@organisms/top-bar/TopBar.tsx'
import { SummaryPanel } from '@organisms/summary-panel/SummaryPanel.tsx'
import { DebtList } from '@organisms/debt-list/DebtList.tsx'
import { BudgetOverview } from '@organisms/budget-overview/BudgetOverview.tsx'
import { TransactionFeed } from '@organisms/transaction-feed/TransactionFeed.tsx'
import { PaymentPlanCard } from '@organisms/payment-plan-card/PaymentPlanCard.tsx'
import type { DebtListFilterStatus } from '@organisms/debt-list/DebtList.types.ts'
import type { PaymentStrategy } from '@organisms/payment-plan-card/PaymentPlanCard.types.ts'
import type { TransactionFeedFilter } from '@organisms/transaction-feed/TransactionFeed.types.ts'

// ─────────────────────── Iconos inline ─────────────────────────────────────

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M2 6.5L8 2l6 4.5V14H10v-3.5H6V14H2V6.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
)
const DebtIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)
const PlanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M3 4h10M3 12h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
const BudgetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M8 5v1.5M8 9.5V11M6.5 9a1.5 1.5 0 003 0c0-.83-.67-1.5-1.5-1.5S6.5 6.67 6.5 5.83"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
)
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M8 2a4 4 0 014 4c0 3 1 4 1 4H3s1-1 1-4a4 4 0 014-4zM6.5 13a1.5 1.5 0 003 0"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)

// ─────────────────────── Datos de demo ──────────────────────────────────────

const DEMO_DEBTS = [
  {
    id: '1',
    name: 'Tarjeta Visa Bancolombia',
    creditor: 'Bancolombia',
    balance: 4_200_000,
    totalDebt: 6_000_000,
    nextPayment: 350_000,
    nextPaymentDate: '15 jun 2026',
    interestRate: 28.5,
    status: 'active' as const,
    currency: 'COP',
    locale: 'es-CO',
  },
  {
    id: '2',
    name: 'Crédito libre inversión',
    creditor: 'Davivienda',
    balance: 12_800_000,
    totalDebt: 20_000_000,
    nextPayment: 780_000,
    nextPaymentDate: '20 jun 2026',
    interestRate: 18.2,
    status: 'active' as const,
    currency: 'COP',
    locale: 'es-CO',
  },
  {
    id: '3',
    name: 'Moto Honda CB 190',
    creditor: 'Honda Financial',
    balance: 0,
    totalDebt: 5_500_000,
    status: 'paid' as const,
    currency: 'COP',
    locale: 'es-CO',
  },
]

const DEMO_TRANSACTIONS = [
  {
    id: 't1',
    title: 'Nómina junio',
    amount: 5_200_000,
    date: 'Hoy',
    type: 'income' as const,
    currency: 'COP',
    locale: 'es-CO',
    icon: '💰',
    category: 'Salario',
  },
  {
    id: 't2',
    title: 'Pago Tarjeta Visa',
    amount: -350_000,
    date: 'Hoy',
    type: 'debt' as const,
    currency: 'COP',
    locale: 'es-CO',
    icon: '💳',
    category: 'Deudas',
  },
  {
    id: 't3',
    title: 'Mercado Éxito',
    amount: -280_000,
    date: 'Ayer',
    type: 'expense' as const,
    currency: 'COP',
    locale: 'es-CO',
    icon: '🛒',
    category: 'Alimentación',
  },
  {
    id: 't4',
    title: 'Ahorro emergencias',
    amount: -500_000,
    date: 'Ayer',
    type: 'saving' as const,
    currency: 'COP',
    locale: 'es-CO',
    icon: '🏦',
    category: 'Ahorros',
  },
  {
    id: 't5',
    title: 'Netflix',
    amount: -49_900,
    date: '18 may',
    type: 'expense' as const,
    currency: 'COP',
    locale: 'es-CO',
    icon: '🎬',
    category: 'Entretenimiento',
  },
]

const DEMO_PLAN_DEBTS = [
  { id: '1', name: 'Tarjeta Visa', balance: 4_200_000, interestRate: 28.5, minPayment: 350_000 },
  { id: '2', name: 'Crédito libre', balance: 12_800_000, interestRate: 18.2, minPayment: 780_000 },
]

// ─────────────────────── Página principal ───────────────────────────────────

function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [debtFilter, setDebtFilter] = useState<DebtListFilterStatus>('all')
  const [txFilter, setTxFilter] = useState<TransactionFeedFilter>('all')
  const [strategy, setStrategy] = useState<PaymentStrategy>('avalanche')
  const [budget, setBudget] = useState(1_800_000)
  const [notificationsOn, setNotificationsOn] = useState(true)

  const sidebar = (
    <Sidebar
      collapsed={sidebarCollapsed}
      onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      activeItemId={activeNav}
      onItemClick={(item) => setActiveNav(item.id)}
      user={{ name: 'Juan Pérez', email: 'juan@ejemplo.co' }}
      groups={[
        {
          id: 'main',
          items: [
            { id: 'dashboard', label: 'Inicio', icon: <HomeIcon /> },
            { id: 'debts', label: 'Mis deudas', icon: <DebtIcon />, badge: 2 },
            { id: 'plan', label: 'Plan de pago', icon: <PlanIcon /> },
            { id: 'budget', label: 'Presupuesto', icon: <BudgetIcon /> },
          ],
        },
      ]}
    />
  )

  const topBar = (
    <TopBar
      eyebrow="DeudaZero"
      title="Dashboard"
      subtitle="Resumen financiero · junio 2026"
      actions={[
        { id: 'bell', label: 'Notificaciones', icon: <BellIcon />, badge: 3, onClick: () => {} },
      ]}
    />
  )

  return (
    <DashboardLayout sidebar={sidebar} topBar={topBar} sidebarCollapsed={sidebarCollapsed}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1200px' }}>
        {/* ── SECCIÓN ÁTOMOS ──────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Capa 1 — Átomos"
            subtitle="Bloques básicos: Button, Badge, Avatar, Money, ProgressBar, Switch, Spinner"
          />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              marginTop: '16px',
            }}
          >
            <Button variant="primary" size="sm">
              Primario
            </Button>
            <Button variant="secondary" size="sm">
              Secundario
            </Button>
            <Button variant="ghost" size="sm">
              Ghost
            </Button>
            <Button variant="danger" size="sm">
              Peligro
            </Button>
            <Divider vertical />
            <Badge accent="income" size="sm">
              Ingreso
            </Badge>
            <Badge accent="expense" size="sm">
              Gasto
            </Badge>
            <Badge accent="debt" size="sm" dot>
              Deuda
            </Badge>
            <Badge accent="saving" size="sm">
              Ahorro
            </Badge>
            <Divider vertical />
            <Avatar name="Juan Pérez" size="sm" />
            <Avatar name="Ana García" size="sm" accent="income" />
            <Avatar name="Luis Mora" size="md" accent="debt" />
            <Divider vertical />
            <Money amount={4_200_000} currency="COP" locale="es-CO" variant="h3" accent="debt" />
            <Money amount={5_200_000} currency="COP" locale="es-CO" variant="h3" accent="income" />
            <Divider vertical />
            <Switch
              checked={notificationsOn}
              onChange={setNotificationsOn}
              label="Notificaciones"
              size="sm"
            />
            <Spinner size="sm" />
          </div>
          <div style={{ marginTop: '12px', maxWidth: '320px' }}>
            <ProgressBar value={65} accent="debt" size="sm" label="Progreso de pago · 65%" />
          </div>
        </section>

        <Divider />

        {/* ── SECCIÓN MOLÉCULAS ────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Capa 2 — Moléculas"
            subtitle="Combinaciones de átomos: StatCard, DebtRow, PageHeader, Alert"
          />

          {/* StatCards grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            <StatCard
              label="Ingresos"
              value={
                <Money
                  amount={5_200_000}
                  currency="COP"
                  locale="es-CO"
                  variant="h2"
                  accent="income"
                />
              }
              accent="income"
              trend="up"
              trendLabel="+12% vs mayo"
            />
            <StatCard
              label="Gastos"
              value={
                <Money
                  amount={2_980_000}
                  currency="COP"
                  locale="es-CO"
                  variant="h2"
                  accent="expense"
                />
              }
              accent="expense"
              trend="down"
              trendLabel="-5% vs mayo"
            />
            <StatCard
              label="Ahorros"
              value={
                <Money
                  amount={500_000}
                  currency="COP"
                  locale="es-CO"
                  variant="h2"
                  accent="saving"
                />
              }
              accent="saving"
            />
            <StatCard
              label="Deuda total"
              value={
                <Money
                  amount={17_000_000}
                  currency="COP"
                  locale="es-CO"
                  variant="h2"
                  accent="debt"
                />
              }
              accent="debt"
              trend="down"
              trendLabel="-8% desde enero"
            />
          </div>

          {/* Alerta */}
          <div style={{ marginTop: '16px' }}>
            <Alert variant="warning">
              Tu próximo pago de <strong>$350.000</strong> vence en 5 días — Tarjeta Visa
              Bancolombia.
            </Alert>
          </div>

          {/* PageHeader de ejemplo */}
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              background: 'var(--dz-bg-surface)',
              borderRadius: 'var(--dz-r-md)',
              border: '1px solid var(--dz-border-base)',
            }}
          >
            <PageHeader
              eyebrow="Detalle"
              title="Tarjeta Visa Bancolombia"
              subtitle="Acreedor: Bancolombia · 28.5% EA"
              actions={
                <>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                  <Button variant="primary" size="sm">
                    Registrar pago
                  </Button>
                </>
              }
              backAction={{ label: 'Volver', onClick: () => {} }}
            />
          </div>

          {/* DebtRow aislada */}
          <div style={{ marginTop: '16px' }}>
            <DebtRow
              name="Tarjeta Visa Bancolombia"
              creditor="Bancolombia"
              balance={4_200_000}
              totalDebt={6_000_000}
              nextPayment={350_000}
              nextPaymentDate="15 jun 2026"
              interestRate={28.5}
              status="active"
              currency="COP"
              locale="es-CO"
              onClick={() => {}}
            />
          </div>
        </section>

        <Divider />

        {/* ── SECCIÓN ORGANISMOS ──────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Capa 3 — Organismos"
            subtitle="Bloques funcionales completos: SummaryPanel, DebtList, BudgetOverview, TransactionFeed, PaymentPlanCard"
          />

          {/* SummaryPanel */}
          <div style={{ marginTop: '20px' }}>
            <SummaryPanel
              title="Resumen del mes"
              subtitle="Junio 2026"
              metrics={[
                {
                  id: 'income',
                  label: 'Ingresos',
                  value: '$5.200.000',
                  trend: 'up',
                  trendLabel: '+12%',
                  accent: 'income',
                },
                {
                  id: 'expenses',
                  label: 'Gastos',
                  value: '$2.980.000',
                  trend: 'down',
                  trendLabel: '-5%',
                  accent: 'expense',
                },
                { id: 'savings', label: 'Ahorros', value: '$500.000', accent: 'saving' },
                {
                  id: 'debt',
                  label: 'Deuda pendiente',
                  value: '$17.000.000',
                  trend: 'down',
                  trendLabel: '-8%',
                  accent: 'debt',
                },
              ]}
              actions={[{ label: 'Ver historial', variant: 'ghost', onClick: () => {} }]}
            />
          </div>

          {/* BudgetOverview */}
          <div style={{ marginTop: '20px' }}>
            <BudgetOverview
              income={5_200_000}
              expenses={2_980_000}
              savings={500_000}
              debts={1_130_000}
              currency="COP"
              locale="es-CO"
              period="Junio 2026"
              categories={[
                {
                  id: 'c1',
                  name: 'Alimentación',
                  spent: 680_000,
                  budget: 800_000,
                  accent: 'expense',
                },
                {
                  id: 'c2',
                  name: 'Transporte',
                  spent: 320_000,
                  budget: 300_000,
                  accent: 'expense',
                },
                {
                  id: 'c3',
                  name: 'Entretenimiento',
                  spent: 149_900,
                  budget: 200_000,
                  accent: 'expense',
                },
                { id: 'c4', name: 'Salud', spent: 0, budget: 200_000, accent: 'saving' },
              ]}
            />
          </div>

          {/* DebtList */}
          <div style={{ marginTop: '20px' }}>
            <DebtList
              debts={DEMO_DEBTS}
              filterStatus={debtFilter}
              onFilterChange={setDebtFilter}
              onAddDebt={() => {}}
              onDebtClick={() => {}}
            />
          </div>

          {/* TransactionFeed + PaymentPlanCard lado a lado en desktop */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            <TransactionFeed
              transactions={DEMO_TRANSACTIONS}
              filter={txFilter}
              onFilterChange={setTxFilter}
              maxItems={5}
              showViewAll
              onViewAll={() => {}}
            />
            <PaymentPlanCard
              debts={DEMO_PLAN_DEBTS}
              monthlyBudget={budget}
              strategy={strategy}
              onStrategyChange={setStrategy}
              onMonthlyBudgetChange={setBudget}
              currency="COP"
              locale="es-CO"
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

// ─────────────────────── Router ─────────────────────────────────────────────

const NotFound = () => (
  <section className="py-16 text-center">
    <h1 className="text-4xl font-semibold">404</h1>
    <p className="mt-2 text-neutral-600 dark:text-neutral-400">Página no encontrada</p>
  </section>
)

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRouter
