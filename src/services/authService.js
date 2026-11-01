import { requisitar } from './apiClient'

/**
 * Realiza autenticação do usuário.
 *
 * TODO(API): Quando a API real for integrada, este endpoint fará um POST HTTPS para /auth/login.
 * A sessão deverá utilizar cookies HttpOnly + SameSite do backend.
 * Nunca persistir a senha no cliente.
 *
 * @param {{ email: string, senha: string }} credenciais
 * @returns {Promise<{ token: string }>}
 */
export async function login({ email, senha }) {
  if (!email?.trim() || !senha?.trim()) {
    throw new Error('E-mail e senha são obrigatórios.')
  }

  const formulario = new URLSearchParams({
    username: email.trim(),
    password: senha,
  })

  const { access_token: token } = await requisitar(
    'identidade',
    '/auth/token',
    { metodo: 'POST', formulario, semToken: true }
  )

  return { token }
}

export function lerUsuarioId(token) {
  const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(payload)).id ?? null
}
