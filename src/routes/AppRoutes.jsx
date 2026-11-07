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
import CentralAjuda from '../pages/CentralAjuda/CentralAjuda'
import EmBreve from '../pages/EmBreve/EmBreve'
import NotFound from '../pages/NotFound/NotFound'

import { PATHS } from './paths'

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={<Navigate to={PATHS.login} replace />}
        />

        {/* Página sem layout: o Login possui header e footer próprios */}
        <Route path={PATHS.login} element={<Login />} />

        {/* Páginas internas protegidas por autenticação */}
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

          {/* Turma Virtual */}
          <Route
            path="/turma-virtual"
            element={<TurmaVirtual />}
          />

          <Route
            path="/turma-virtual/:disciplinaId"
            element={<TurmaVirtual />}
          />

          {/* Gerenciamento de Notícias exclusivo da Coordenação */}
          <Route
            path={PATHS.gerenciamentoNoticias}
            element={
              <AdminRoute>
                <GerenciamentoNoticias />
              </AdminRoute>
            }
          />

          {/* Central de Ajuda */}
          <Route
            path={PATHS.ajuda}
            element={<CentralAjuda />}
          />

          {/* Redirecionamento da rota alternativa */}
          <Route
            path="/central-de-ajuda"
            element={
              <Navigate to={PATHS.ajuda} replace />
            }
          />
        </Route>

        {/* Página fora do layout principal */}
        <Route
          path={PATHS.emBreve}
          element={<EmBreve />}
        />

        {/* Rota para páginas inexistentes */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  )
}

export default AppRoutes
