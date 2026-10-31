import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Hook para acessar o contexto de autenticação.
 *
 * @returns {{ aluno: Object | null, login: Function, logout: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return context
}

export default useAuth
