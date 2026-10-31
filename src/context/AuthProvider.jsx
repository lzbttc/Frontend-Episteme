import { useState, useCallback } from 'react'
import { AuthContext } from './AuthContext'
import { login as apiLogin } from '../services/authService'

const SESSION_STORAGE_KEY = 'episteme_aluno_sessao'

/**
 * Provedor de contexto de autenticação do aluno.
 *
 * NOTA DE SEGURANÇA:
 * Na fase atual de mock, armazenamos apenas o objeto não sensível do aluno no sessionStorage.
 * A senha NUNCA é armazenada no cliente.
 * Quando a API real for conectada, a sessão utilizará cookie HttpOnly do backend
 * e este armazenamento em sessionStorage será removido.
 */
export function AuthProvider({ children }) {
  const [aluno, setAluno] = useState(() => {
    try {
      const sessaoSalva = sessionStorage.getItem(SESSION_STORAGE_KEY)
      return sessaoSalva ? JSON.parse(sessaoSalva) : null
    } catch {
      return null
    }
  })

  const login = useCallback(async ({ matricula, senha }) => {
    const { student } = await apiLogin({ matricula, senha })
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(student))
    setAluno(student)
    return student
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    setAluno(null)
  }, [])

  return (
    <AuthContext.Provider value={{ aluno, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
