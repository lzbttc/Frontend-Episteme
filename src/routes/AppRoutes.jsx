import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import Login from '../pages/Login/Login'
import PaginaInicial from '../pages/PaginaInicial/PaginaInicial'
import TurmaVirtual from '../pages/TurmaVirtual/TurmaVirtual'
import MinhasDisciplinas from '../pages/MinhasDisciplinas/MinhasDisciplinas'
import NoticiasEstudante from '../pages/NoticiasEstudante/NoticiasEstudante'
import GerenciamentoNoticias from '../pages/GerenciamentoNoticias/GerenciamentoNoticias'
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
          <Route path={PATHS.noticias} element={<NoticiasEstudante />} />
          <Route
            path={PATHS.minhasDisciplinas}
            element={<MinhasDisciplinas />}
          />
          <Route path="/turma-virtual" element={<TurmaVirtual />} />
          <Route
            path="/turma-virtual/:disciplinaId"
            element={<TurmaVirtual />}
          />

          {/* Rota administrativa exclusiva para Coordenação */}
          <Route
            path={PATHS.gerenciamentoNoticias}
            element={
              <AdminRoute>
                <GerenciamentoNoticias />
              </AdminRoute>
            }
          />
        </Route>

        <Route path={PATHS.emBreve} element={<EmBreve />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default AppRoutes
