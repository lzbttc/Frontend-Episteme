import { requisitar, obterToken } from './apiClient.js'
import { lerUsuarioId } from './authService.js'

/**
 * Busca os dados do usuário logado via GET /usuarios/{usuario_id}.
 *
 * @returns {Promise<Object>} Dados do usuário (id, nome, email, cpf, telefone, e_admin, matricula)
 */
export async function obterUsuarioLogado() {
  const usuarioId = lerUsuarioId(obterToken())
  if (!usuarioId) {
    throw new Error('Usuário não autenticado.')
  }
  return requisitar('identidade', `/usuarios/${usuarioId}`)
}

/**
 * Atualiza os dados do usuário logado via PUT /usuarios/{usuario_id}.
 *
 * @param {Object} dados - Campos a atualizar (nome, email, cpf, telefone, senha, e_admin)
 * @returns {Promise<Object>} Usuário atualizado
 */
export async function atualizarUsuarioLogado(dados) {
  const usuarioId = lerUsuarioId(obterToken())
  if (!usuarioId) {
    throw new Error('Usuário não autenticado.')
  }
  return requisitar('identidade', `/usuarios/${usuarioId}`, {
    metodo: 'PUT',
    corpo: dados,
  })
}
