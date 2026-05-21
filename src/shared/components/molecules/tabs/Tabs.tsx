import type { CSSProperties, FC } from 'react'
import type { TabsProps, TabItem } from './Tabs.types.ts'

export const Tabs: FC<TabsProps> = ({ tabs, activeTab, onChange, children, className }) => (
  <div className={className} style={{ display: 'flex', flexDirection: 'column' }}>
    <div
      role="tablist"
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--dz-border-base)',
        gap: '2px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {tabs.map((tab: TabItem) => {
        const isActive = tab.value === activeTab
        const btnStyle: CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 14px',
          background: 'none',
          border: 'none',
          borderBottom: isActive ? '2px solid var(--dz-signature)' : '2px solid transparent',
          marginBottom: '-1px',
          cursor: tab.disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--dz-font-sans)',
          fontSize: 'var(--dz-fs-body)',
          fontWeight: isActive ? 600 : 400,
          color: isActive
            ? 'var(--dz-text-primary)'
            : tab.disabled
              ? 'var(--dz-text-faint)'
              : 'var(--dz-text-muted)',
          letterSpacing: 'var(--dz-ls-normal)',
          whiteSpace: 'nowrap',
          transition: 'color var(--dz-transition-fast), border-color var(--dz-transition-fast)',
          opacity: tab.disabled ? 0.45 : 1,
          flexShrink: 0,
        }

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`tab-${tab.value}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.value}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.value)}
            style={btnStyle}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 5px',
                  background: isActive ? 'var(--dz-tint-signature)' : 'var(--dz-bg-raised)',
                  borderRadius: 'var(--dz-r-pill)',
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: isActive ? 'var(--dz-signature)' : 'var(--dz-text-muted)',
                  lineHeight: 1,
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>

    {children && (
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        {children}
      </div>
    )}
  </div>
)
