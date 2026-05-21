import type { ReactNode } from 'react'

export interface DashboardLayoutProps {
  sidebar?: ReactNode
  topBar?: ReactNode
  mobileNav?: ReactNode
  children: ReactNode
  sidebarCollapsed?: boolean
  className?: string
}
