import type { FC, ReactNode } from 'react'

interface DebtKPIProps {
  label: string
  sublabel?: string
  children: ReactNode
}

export const DebtKPI: FC<DebtKPIProps> = ({ label, sublabel, children }) => (
  <div className="flex flex-col gap-1">
    <span
      className="font-mono uppercase"
      style={{ fontSize: '9.5px', letterSpacing: '1.33px', color: 'var(--dz-text-faint)' }}
    >
      {label}
    </span>
    <div className="leading-none">{children}</div>
    {sublabel && (
      <span className="font-sans" style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}>
        {sublabel}
      </span>
    )}
  </div>
)
