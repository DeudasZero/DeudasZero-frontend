import type { FC } from 'react'
import { useDashboard } from '../hooks/useDashboard.ts'
import { StatCard } from '@molecules/stat-card/index.ts'
import { Money } from '@atoms/money/index.js'
import { FlowCard } from './FlowCard.tsx'
import { DistributionCard } from './DistributionCard.tsx'
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

export const DashboardPage: FC = () => {
  const { data, isLoading } = useDashboard()
  const s = data?.summary

  return (
    <div className="flex flex-col gap-4">
      {/* Fila 1: Flujo + Distribución */}
      <div className="grid grid-cols-2 gap-4">
        <FlowCard
          label={`FLUJO DISPONIBLE · ${data?.currentMonth ?? ''}`}
          value={s ? cop(s.netBalance) : '—'}
          worstDebt={s?.worstDebt ?? null}
          isLoading={isLoading}
        />
        <DistributionCard
          expenses={s?.totalExpenses ?? 0}
          available={s?.netBalance ?? 0}
          isLoading={isLoading}
        />
      </div>

      {/* Fila 2: Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Ingresos del mes"
          value={
            <Money
              amount={s?.totalIncome ?? 0}
              currency="COP"
              locale="es-CO"
              variant="h2"
              accent="income"
            />
          }
          {...(s ? { trend: 'up' as const, trendLabel: `↑ ${s.incomeTrend}% vs mes ant.` } : {})}
          accent="income"
          loading={isLoading}
        />
        <StatCard
          label="Gastos del mes"
          value={
            <Money
              amount={s?.totalExpenses ?? 0}
              currency="COP"
              locale="es-CO"
              variant="h2"
              accent="expense"
            />
          }
          {...(s
            ? { trend: 'up' as const, trendLabel: `↓ ${Math.abs(s.expenseTrend)}% ahorraste` }
            : {})}
          accent="expense"
          loading={isLoading}
        />
        <StatCard
          label="Carga de deuda"
          value={
            <Money
              amount={s?.totalDebts ?? 0}
              currency="COP"
              locale="es-CO"
              variant="h2"
              accent="debt"
            />
          }
          {...(s ? { trend: 'down' as const, trendLabel: `${s.debtRatio}% del ingreso` } : {})}
          accent="debt"
          loading={isLoading}
        />
      </div>

      {/* Fila 3: Chart + Categorías */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <ChartCard history={data?.monthlyHistory ?? []} isLoading={isLoading} />
        <CategoryCard
          categories={data?.categorySpend ?? []}
          {...(data?.currentMonth ? { currentMonth: data.currentMonth } : {})}
          isLoading={isLoading}
        />
      </div>

      {/* Fila 4: Actividad reciente */}
      <ActivityTable transactions={data?.recentTransactions ?? []} isLoading={isLoading} />
    </div>
  )
}
