import { useState, cloneElement, isValidElement } from 'react'
import type { FC, ReactElement } from 'react'
import type { DashboardLayoutProps } from './DashboardLayout.types.ts'

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  sidebar,
  topBar,
  mobileNav,
  children,
  sidebarCollapsed: sidebarCollapsedProp = false,
  className,
}) => {
  const [tabletCollapsed, setTabletCollapsed] = useState(true)

  const effectiveCollapsed = sidebarCollapsedProp || tabletCollapsed

  return (
    <div className={`flex min-h-screen bg-(--dz-bg-page) ${className ?? ''}`}>
      {sidebar && (
        <div className="hidden lg:block shrink-0">
          {isValidElement(sidebar)
            ? cloneElement(sidebar as ReactElement<{ collapsed?: boolean }>, {
                collapsed: effectiveCollapsed,
              })
            : sidebar}
        </div>
      )}
      {sidebar && !tabletCollapsed && (
        <div
          aria-hidden
          onClick={() => setTabletCollapsed(true)}
          className="hidden lg:block xl:hidden fixed inset-0 z-150"
          style={{
            background: 'rgba(8,13,18,0.5)',
            backdropFilter: 'blur(1px)',
          }}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0">
        {topBar}
        <main
          id="main-content"
          tabIndex={-1}
          className={`
            flex-1 overflow-x-hidden
            p-4 lg:p-[20px_24px] xl:p-(--dz-content-pad)
            ${mobileNav ? 'pb-(--dz-mobile-nav-h) lg:pb-0' : ''}
          `}
        >
          {children}
        </main>
      </div>

      {mobileNav && (
        <nav
          aria-label="Navegación"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-200 flex items-center"
          style={{
            height: 'var(--dz-mobile-nav-h)',
            background: 'var(--dz-bg-sidebar)',
            borderTop: '1px solid var(--dz-border-soft)',
          }}
        >
          {mobileNav}
        </nav>
      )}
    </div>
  )
}
