import type { FC } from 'react'
import { useDashboard } from '../hooks/useDashboard.ts'
import { FlowCard } from './FlowCard.tsx'
import { DistributionCard } from './DistributionCard.tsx'
import { StatCard } from './StatCard.tsx'
import { ChartCard } from './ChartCard.tsx'
import { CategoryCard } from './CategoryCard.tsx'
import { ActivityTable } from './ActivityTable.tsx'

function cop(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace('COP', '$')
    .trim()
}

export const CARD: React.CSSProperties = {
  background: 'rgb(20, 28, 36)',
  borderRadius: '10px',
  overflow: 'hidden',
}

export const DashboardPage: FC = () => {
  const { data, isLoading } = useDashboard()
  const s = data?.summary

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FlowCard
          label={`FLUJO DISPONIBLE · ${data?.currentMonth ?? 'JUNIO'}`}
          value={s ? cop(s.netBalance) : '—'}
          isLoading={isLoading}
        />
        <DistributionCard
          expenses={s?.totalExpenses ?? 0}
          available={s?.netBalance ?? 0}
          isLoading={isLoading}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <StatCard
          label="Ingresos del mes"
          value={s ? cop(s.totalIncome) : '—'}
          trend={s ? `↑ ${s.incomeTrend}%` : undefined}
          trendLabel="vs mes ant."
          trendUp
          isLoading={isLoading}
        />
        <StatCard
          label="Gastos del mes"
          value={s ? cop(s.totalExpenses) : '—'}
          trend={s ? `↓ ${Math.abs(s.expenseTrend)}%` : undefined}
          trendLabel="ahorraste"
          trendUp
          isLoading={isLoading}
        />
        <StatCard
          label="Carga de deuda"
          value={s ? cop(s.totalDebts) : '—'}
          badge={s ? `${s.debtRatio}%` : undefined}
          trend={s ? '↓ 4%' : undefined}
          trendLabel="bajó"
          trendUp
          isLoading={isLoading}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px' }}>
        <ChartCard isLoading={isLoading} />
        <CategoryCard categories={data?.categorySpend ?? []} isLoading={isLoading} />
      </div>

      <ActivityTable transactions={data?.recentTransactions ?? []} isLoading={isLoading} />
    </div>
  )
}
