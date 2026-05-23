import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hookStore.ts'
import { LoginPage } from '@/features/auth/components/LoginPage.tsx'
import { RegisterPage } from '@/features/auth/components/RegisterPage.tsx'

const DashboardPage = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--dz-bg-page)',
    }}
  >
    <p style={{ fontFamily: 'var(--dz-font-sans)', color: 'var(--dz-text-muted)' }}>
      Dashboard — próximamente
    </p>
  </div>
)

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const tokenInStorage =
    Boolean(localStorage.getItem('token')) || Boolean(sessionStorage.getItem('token'))

  return isAuthenticated || tokenInStorage ? <>{children}</> : <Navigate to="/login" replace />
}

const NotFound = () => (
  <section className="py-16 text-center">
    <h1 className="text-4xl font-semibold">404</h1>
    <p className="mt-2" style={{ color: 'var(--dz-text-muted)' }}>
      Página no encontrada
    </p>
  </section>
)

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRouter
