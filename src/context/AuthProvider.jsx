import { useState, useCallback } from 'react'
import { AuthContext } from './AuthContext'
import { login as apiLogin } from '../services/authService'
import { obterAluno } from '../services/alunoService'
import { obterToken, removerToken, salvarToken } from '../services/apiClient'

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
  const [token, setToken] = useState(() => obterToken())
  const [aluno, setAluno] = useState(() => {
    try {
      const sessaoSalva = sessionStorage.getItem(SESSION_STORAGE_KEY)
      return sessaoSalva ? JSON.parse(sessaoSalva) : null
    } catch {
      return null
    }
  })

  const login = useCallback(async ({ email, senha }) => {
    const { token: novoToken } = await apiLogin({ email, senha })
    salvarToken(novoToken)

    try {
      const { student } = await obterAluno()
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(student))
      setToken(novoToken)
      setAluno(student)
      return student
    } catch (err) {
      removerToken()
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    removerToken()
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    setToken(null)
    setAluno(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, aluno, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
