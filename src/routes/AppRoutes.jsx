import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
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
import NotificacoesEstudante from '../pages/NotificacoesEstudante/NotificacoesEstudante'
import CentralAjuda from '../pages/CentralAjuda/CentralAjuda'
import EmBreve from '../pages/EmBreve/EmBreve'
import NotFound from '../pages/NotFound/NotFound'
import MeuPerfil from '../pages/MeuPerfil/MeuPerfil'
import { MatriculaProvider } from '../pages/Matricula/context/MatriculaContext'
import SelecaoTurmas from '../pages/Matricula/SelecaoTurmas'
import RevisaoSolicitacao from '../pages/Matricula/RevisaoSolicitacao'
import ComprovanteSolicitacao from '../pages/Matricula/ComprovanteSolicitacao'
import MinhasSolicitacoes from '../pages/Matricula/MinhasSolicitacoes'

import { PATHS } from './paths'

function MatriculaLayout() {
  return (
    <MatriculaProvider>
      <Outlet />
    </MatriculaProvider>
  )
}

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

          {/* Menu de Notificações */}
          <Route
            path={PATHS.notificacoes}
            element={<NotificacoesEstudante />}
          />

          {/* Meu Perfil */}
          <Route
            path={PATHS.meuPerfil}
            element={<MeuPerfil />}
          />

          {/* Módulo de Solicitação de Matrícula */}
          <Route element={<MatriculaLayout />}>
            <Route path={PATHS.matricula} element={<SelecaoTurmas />} />
            <Route path={PATHS.matriculaRevisao} element={<RevisaoSolicitacao />} />
            <Route path="/matricula/comprovante" element={<ComprovanteSolicitacao />} />
            <Route path={PATHS.matriculaComprovante} element={<ComprovanteSolicitacao />} />
            <Route path={PATHS.matriculaSolicitacoes} element={<MinhasSolicitacoes />} />
          </Route>

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
