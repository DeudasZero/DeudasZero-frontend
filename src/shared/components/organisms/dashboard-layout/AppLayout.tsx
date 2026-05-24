import type { FC, ReactNode } from 'react'
import { AppSidebar } from '../sidebar/AppSidebar.tsx'
import { AppHeader } from '../top-bar/AppHeader.tsx'

interface AppLayoutProps {
  children: ReactNode
  userName?: string
  userEmail?: string
  onRegister?: () => void
}

export const AppLayout: FC<AppLayoutProps> = ({ children, userName, userEmail, onRegister }) => {
  const displayName = userName ?? 'Usuario'
  const displayEmail = userEmail ?? 'usuario@deudazero.com'

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'rgb(9, 16, 23)',
      }}
    >
      <div style={{ flexShrink: 0, height: '100vh', overflowY: 'auto' }}>
        <AppSidebar userName={displayName} userEmail={displayEmail} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <AppHeader onRegister={onRegister} userName={displayName.split(' ')[0]} />

        <main
          id="main-content"
          tabIndex={-1}
          style={{
            flex: 1,
            padding: '32px',
            overflowY: 'auto',
            overflowX: 'hidden',
            outline: 'none',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
