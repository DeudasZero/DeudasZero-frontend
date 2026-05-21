import { Routes, Route } from 'react-router-dom'
import { Button } from '@atoms/button/Button.tsx'
import { Avatar } from '@atoms/avatar/Avatar.tsx'

const Home = () => (
  <section>
    <h1 className="text-3xl font-semibold">DeudaZero</h1>
    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
      Tu consejero financiero inteligente.
    </p>
    <Avatar name="Juan Pérez" size="md" />
    <Button variant="primary" size="sm" className="mt-6">
      Comenzar
    </Button>
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
