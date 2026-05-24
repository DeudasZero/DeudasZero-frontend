import type { FC } from 'react'

interface AppHeaderProps {
  onRegister: (() => void) | undefined
  userName: string | undefined
}

export const AppHeader: FC<AppHeaderProps> = ({ onRegister, userName }) => {
  const displayName = userName ?? 'Usuario'

  return (
    <header
      style={{
        height: '72px',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(220, 235, 255, 0.05)',
        background: 'rgb(9, 16, 23)',
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 700,
            color: 'rgb(232, 238, 245)',
          }}
        >
          Hola, {displayName}
        </h1>

        <p
          style={{
            margin: '4px 0 0',
            fontSize: '13px',
            color: 'rgb(110, 121, 134)',
          }}
        >
          Bienvenido a DeudaZero
        </p>
      </div>

      {onRegister && (
        <button
          type="button"
          onClick={onRegister}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            background: '#5EE1E6',
            color: 'rgb(13, 20, 25)',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          Registrar
        </button>
      )}
    </header>
  )
}
