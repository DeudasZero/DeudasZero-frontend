import type { FC } from 'react'
import { TransactionItem } from '@molecules/transaction-item/index.ts'
import { Skeleton } from '@atoms/skeleton/index.ts'
import type { Transaction } from '../types/dashboard.types.ts'

interface ActivityTableProps {
  transactions: Transaction[]
  isLoading?: boolean
}

function TransactionSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5">
          <Skeleton circle width={32} height={32} />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton width="40%" height="13px" />
            <Skeleton width="25%" height="11px" />
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <Skeleton width="64px" height="13px" />
            <Skeleton width="44px" height="20px" rounded />
          </div>
        </div>
      ))}
    </div>
  )
}

export const ActivityTable: FC<ActivityTableProps> = ({ transactions, isLoading = false }) => (
  <div className="bg-[rgb(20,28,36)] rounded-[10px] overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
      <span className="font-mono text-[11px] tracking-[1.4px] uppercase text-[rgb(110,121,134)]">
        ACTIVIDAD RECIENTE
      </span>
      <span className="font-sans text-[13.5px] font-semibold text-(--dz-text-primary)">
        {isLoading ? '…' : `Últimos ${transactions.length} movimientos`}
      </span>
    </div>

    {/* Content */}
    {isLoading ? (
      <TransactionSkeleton />
    ) : transactions.length === 0 ? (
      <p className="text-center py-12 text-[13.5px] text-(--dz-text-muted) m-0">
        No hay actividad reciente
      </p>
    ) : (
      <div className="flex flex-col">
        {transactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            title={tx.name}
            category={tx.category}
            amount={tx.amount}
            date={tx.date}
            type={tx.type}
            currency="COP"
            locale="es-CO"
            className="border-b border-white/5 last:border-0"
          />
        ))}
      </div>
    )}
  </div>
)
