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

  /**
   * On tablet (lg) the sidebar is collapsed by default.
   * On desktop it respects the prop.
   * On narrow it's hidden entirely (mobileNav takes over).
   */
  const [tabletCollapsed, setTabletCollapsed] = useState(true)
  const effectiveCollapsed = isDesktop ? sidebarCollapsedProp : tabletCollapsed

  const rootStyle: CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--dz-bg-page)',
  }

  const mainStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    paddingBottom: mobileNav && isNarrow ? 'var(--dz-mobile-nav-h)' : undefined,
  }

  const contentStyle: CSSProperties = {
    flex: 1,
    /* Scale content padding by viewport */
    padding: isNarrow ? '16px' : isCompact ? '20px 24px' : 'var(--dz-content-pad)',
    overflowX: 'hidden',
  }

  return (
    <div style={rootStyle} className={className}>
      {/* Sidebar — hidden on narrow */}
      {sidebar && !isNarrow && (
        <div style={{ flexShrink: 0 }}>
          {/* Clone sidebar injecting collapsed state */}
          {isValidElement(sidebar)
            ? cloneElement(sidebar as ReactElement<{ collapsed?: boolean }>, {
                collapsed: effectiveCollapsed,
              })
            : sidebar}
        </div>
      )}

      {/* Overlay for tablet when sidebar is open */}
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

      <div style={mainStyle}>
        {topBar}
        <main id="main-content" tabIndex={-1} style={contentStyle}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      {mobileNav && isNarrow && (
        <nav
          aria-label="Navegación"
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
