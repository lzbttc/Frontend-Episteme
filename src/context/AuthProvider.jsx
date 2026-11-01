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
 * O token JWT fica em sessionStorage. Ele some ao fechar a aba, mas qualquer script
 * que rode na página consegue lê-lo, então uma falha de XSS expõe a sessão.
 * A senha nunca é guardada no cliente. O backend valida o token em cada requisição.
 * O cliente só confere a data de expiração (exp) para encerrar a sessão sem esperar a API.
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
