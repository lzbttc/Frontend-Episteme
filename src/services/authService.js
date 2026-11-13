import { requisitar } from './apiClient.js'
import { decodificarPayloadJwt } from '../utils/jwt.js'

/**
 * Realiza autenticação do usuário.
 *
 * A senha não é guardada no cliente.
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
  const payload = decodificarPayloadJwt(token)
  return payload?.id ?? payload?.sub ?? payload?.usuario_id ?? null
}
