import { useState, cloneElement, isValidElement } from 'react'
import type { CSSProperties, FC, ReactElement } from 'react'
import { useBreakpoint } from '@shared/hooks/useBreakpoint.ts'
import type { DashboardLayoutProps } from './DashboardLayout.types.ts'

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  sidebar,
  topBar,
  mobileNav,
  children,
  sidebarCollapsed: sidebarCollapsedProp = false,
  className,
}) => {
  const { isNarrow, isCompact, isDesktop } = useBreakpoint()

  const [tabletCollapsed, setTabletCollapsed] = useState(true)
  const effectiveCollapsed = isDesktop ? sidebarCollapsedProp : tabletCollapsed

  const contentPadding = isNarrow ? '16px' : isCompact ? '20px 24px' : 'var(--dz-content-pad)'

  const rootStyle: CSSProperties = {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--dz-bg-page)',
  }

  const sidebarColStyle: CSSProperties = {
    flexShrink: 0,
    height: '100%',
    overflowY: 'auto',
    scrollbarWidth: 'none',
  }

  const rightColStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingBottom: mobileNav && isNarrow ? 'var(--dz-mobile-nav-h)' : undefined,
  }

  return (
    <div className={className ?? ''} style={rootStyle}>
      {sidebar && (
        <div className="hidden lg:block" style={sidebarColStyle}>
          {isValidElement(sidebar)
            ? cloneElement(sidebar as ReactElement<{ collapsed?: boolean }>, {
                collapsed: effectiveCollapsed,
              })
            : sidebar}
        </div>
      )}

      {sidebar && isCompact && !isNarrow && !tabletCollapsed && (
        <div
          aria-hidden
          onClick={() => setTabletCollapsed(true)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 150,
            background: 'rgba(8,13,18,0.5)',
            backdropFilter: 'blur(1px)',
          }}
        />
      )}

      <div style={rightColStyle}>
        {topBar}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-x-hidden"
          style={{ padding: contentPadding }}
        >
          {children}
        </main>
      </div>

      {mobileNav && (
        <nav
          aria-label="Navegación"
          className="lg:hidden"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            height: 'var(--dz-mobile-nav-h)',
            background: 'var(--dz-bg-sidebar)',
            borderTop: '1px solid var(--dz-border-soft)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {mobileNav}
        </nav>
      )}
    </div>
  )
}
