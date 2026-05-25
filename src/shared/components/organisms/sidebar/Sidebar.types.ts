import type { ReactNode } from 'react'

export interface SidebarNavItem {
  id: string
  label: string
  icon?: ReactNode
  href?: string
  badge?: number
  disabled?: boolean
}

export interface SidebarNavGroup {
  id: string
  label?: string
  items: SidebarNavItem[]
}

export interface SidebarUser {
  name: string
  email?: string
  avatarSrc?: string
}

export interface SidebarAdvisorMessage {
  text: string
  onDetailClick?: () => void
}

export interface SidebarProps {
  groups: SidebarNavGroup[]
  activeItemId?: string
  onItemClick?: (item: SidebarNavItem) => void
  user?: SidebarUser
  onUserClick?: () => void
  onLogout?: () => void
  logo?: ReactNode
  collapsed?: boolean
  onToggleCollapse?: () => void
  advisorMessage?: SidebarAdvisorMessage | undefined
  className?: string
}
