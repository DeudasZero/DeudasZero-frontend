import { Routes, Route } from 'react-router-dom'
import { Button } from '@atoms/button/Button.tsx'
import { Avatar } from '@atoms/avatar/Avatar.tsx'
import { PageHeader } from '@molecules/page-header/PageHeader.tsx'

const Home = () => (
  <section>
    <PageHeader
      eyebrow="Bienvenido"
      title="DeudaZero"
      subtitle="Tu consejero financiero inteligente."
      actions={
        <Button variant="secondary" size="sm">
          Comenzar
        </Button>
      }
    />
    <Avatar name="Juan Pérez" size="md" className="mt-6" />
  </section>
)

const NotFound = () => (
  <section className="py-16 text-center">
    <h1 className="text-4xl font-semibold">404</h1>
    <p className="mt-2 text-neutral-600 dark:text-neutral-400">Página no encontrada</p>
  </section>
)

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
