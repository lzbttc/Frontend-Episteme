import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { PATHS } from './paths'

/**
 * Componente que protege rotas internas da aplicação.
 *
 * NOTA DE SEGURANÇA E ARQUITETURA:
 * Isto é apenas experiência de uso (UX), para evitar que usuários não autenticados
 * visualizem telas vazias ou com erros no navegador. A proteção e validação real
 * de autenticação e autorização é responsabilidade do backend.
 */
export function ProtectedRoute({ children }) {
  const { aluno } = useAuth()
  const location = useLocation()

  if (!aluno) {
    return <Navigate to={PATHS.login} state={{ from: location }} replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute
