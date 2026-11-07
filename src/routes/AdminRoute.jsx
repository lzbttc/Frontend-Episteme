import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { PATHS } from './paths'
import Button from '../components/Button/Button'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import { LockIcon } from '../components/icons'
import './AdminRoute.css'

/**
 * Rota protegida exclusiva para administradores (Coordenação).
 *
 * Se o usuário não estiver autenticado, redireciona para a tela de login.
 * Se o usuário estiver autenticado porém não for administrador, exibe
 * uma tela de Acesso Negado (403) institucional e acessível,
 * impedindo o acesso à interface administrativa.
 */
export function AdminRoute({ children }) {
  const { token, eAdmin } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to={PATHS.login} state={{ from: location }} replace />
  }

  if (!eAdmin) {
    return (
      <div className="admin-route-denied" role="alert" aria-live="assertive">
        <Breadcrumb
          items={[
            { label: 'Portal Acadêmico', to: PATHS.inicio },
            { label: 'Acesso Restrito' },
          ]}
        />

        <div className="admin-route-denied__card">
          <div className="admin-route-denied__icon-wrapper" aria-hidden="true">
            <LockIcon size={32} />
          </div>

          <span className="admin-route-denied__badge">
            Erro 403 &bull; Proibido
          </span>

          <h1 className="admin-route-denied__title">
            Acesso Restrito à Coordenação
          </h1>

          <p className="admin-route-denied__description">
            Esta área é reservada para a Coordenação Acadêmica e administradores
            do EPIS. O seu perfil autenticado não possui privilégios para
            visualizar ou gerenciar comunicados.
          </p>

          <div className="admin-route-denied__actions">
            <Button variant="primary" size="md" to={PATHS.inicio}>
              Voltar para o Início
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return children ? children : <Outlet />
}

export default AdminRoute
