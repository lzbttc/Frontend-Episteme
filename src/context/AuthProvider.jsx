import { useState, useCallback, useEffect, useMemo } from 'react'
import { AuthContext } from './AuthContext'
import { login as apiLogin } from '../services/authService'
import { obterAluno } from '../services/alunoService'
import {
  definirAoExpirarSessao,
  expirarSessao,
  limparAvisoSessaoExpirada,
  obterToken,
  removerToken,
  salvarToken,
} from '../services/apiClient'
import { expiracaoDoToken, usuarioEhAdmin } from '../utils/jwt'
import { limparRascunhosLocais } from '../services/comunicadoService'

const SESSION_STORAGE_KEY = 'episteme_aluno_sessao'
const MAXIMO_TIMEOUT_MS = 2147483647

function lerAlunoSalvo() {
  try {
    const sessaoSalva = sessionStorage.getItem(SESSION_STORAGE_KEY)
    return sessaoSalva ? JSON.parse(sessaoSalva) : null
  } catch {
    return null
  }
}

function removerAlunoSalvo() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
}

/**
 * Provedor de contexto de autenticação do aluno/coordenação.
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
    if (!token) {
      removerAlunoSalvo()
      return null
    }
    return lerAlunoSalvo()
  })

  const eAdmin = useMemo(() => usuarioEhAdmin(token), [token])

  const encerrarSessaoLocal = useCallback(() => {
    limparRascunhosLocais()
    removerAlunoSalvo()
    setToken(null)
    setAluno(null)
  }, [])

  useEffect(() => {
    definirAoExpirarSessao(encerrarSessaoLocal)
    return () => definirAoExpirarSessao(null)
  }, [encerrarSessaoLocal])

  useEffect(() => {
    if (!token) {
      return undefined
    }

    const expiracao = expiracaoDoToken(token)
    if (expiracao === null) {
      return undefined
    }

    const restante = expiracao - Date.now()
    if (restante > MAXIMO_TIMEOUT_MS) {
      return undefined
    }

    const timer = setTimeout(expirarSessao, Math.max(restante, 0))
    return () => clearTimeout(timer)
  }, [token])

  const login = useCallback(async ({ email, senha }) => {
    const { token: novoToken } = await apiLogin({ email, senha })
    salvarToken(novoToken)

    try {
      const { student } = await obterAluno()
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(student))
      limparAvisoSessaoExpirada()
      setToken(novoToken)
      setAluno(student)
      return student
    } catch (err) {
      removerToken()
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    // Limpeza de segurança: remove rascunhos do administrador antes de invalidar a sessão
    limparRascunhosLocais()
    removerToken()
    removerAlunoSalvo()
    limparAvisoSessaoExpirada()
    setToken(null)
    setAluno(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, aluno, eAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
