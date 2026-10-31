import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import Login from '../pages/Login/Login'
import PaginaInicial from '../pages/PaginaInicial/PaginaInicial'
import TurmaVirtual from '../pages/TurmaVirtual/TurmaVirtual'
import MinhasDisciplinas from '../pages/MinhasDisciplinas/MinhasDisciplinas'
import EmBreve from '../pages/EmBreve/EmBreve'
import NotFound from '../pages/NotFound/NotFound'
import { PATHS } from './paths'

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to={PATHS.login} replace />} />

        {/* Páginas sem layout: o Login possui header e footer próprios */}
        <Route path={PATHS.login} element={<Login />} />

        {/* Páginas internas: protegidas por autenticação e usam o MainLayout via Outlet */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path={PATHS.inicio} element={<PaginaInicial />} />
          <Route
            path={PATHS.minhasDisciplinas}
            element={<MinhasDisciplinas />}
          />
          <Route path="/turma-virtual" element={<TurmaVirtual />} />
          <Route
            path="/turma-virtual/:disciplinaId"
            element={<TurmaVirtual />}
          />
        </Route>

        <Route path={PATHS.emBreve} element={<EmBreve />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default AppRoutes
