import { requisitar } from './apiClient.js'
import { lerUsuarioId } from './authService.js'
import { obterToken } from './apiClient.js'

/**
 * Busca os dados completos do usuário autenticado no serviço identidade.
 *
 * Campos retornados pela API (GET /usuarios/{id}):
 *   id, nome, email, cpf, telefone, matricula, e_admin, data_nascimento, endereco
 *
 * @returns {Promise<Object>} dados do usuário
 */
export async function obterUsuarioAtual() {
  const usuarioId = lerUsuarioId(obterToken())
  return requisitar('identidade', `/usuarios/${usuarioId}`)
}

/**
 * Atualiza os dados editáveis do usuário autenticado.
 * Apenas campos permitidos ao perfil são enviados.
 *
 * Para usuários comuns: nome, email, cpf, telefone, senha (opcional).
 * Campos administrativos (matricula, e_admin) são somente leitura para não-admins.
 *
 * @param {string} usuarioId
 * @param {Object} dados - campos a atualizar
 * @returns {Promise<Object>} usuário atualizado
 */
export async function atualizarUsuario(usuarioId, dados) {
  return requisitar('identidade', `/usuarios/${usuarioId}`, {
    metodo: 'PUT',
    corpo: dados,
  })
}

/**
 * Busca dados acadêmicos do aluno no serviço turma.
 * Retorna null se não encontrado (usuário pode ser admin sem vínculo de aluno).
 *
 * @param {string} usuarioId
 * @returns {Promise<Object|null>}
 */
export async function obterDadosAluno(usuarioId) {
  try {
    return await requisitar('turma', `/alunos/usuario_id/${usuarioId}`)
  } catch (err) {
    if (err?.status === 404) return null
    throw err
  }
}

/**
 * Busca o resumo acadêmico do aluno (IRA, semestre, situação, etc.).
 * Retorna null se não disponível.
 *
 * @returns {Promise<Object|null>}
 */
export async function obterResumoAcademico() {
  try {
    return await requisitar('academico', '/alunos/me/resumo')
  } catch (err) {
    if (err?.status === 404) return null
    throw err
  }
}

/**
 * Busca dados do curso pelo id.
 * Retorna null se não encontrado.
 *
 * @param {string} cursoId
 * @returns {Promise<Object|null>}
 */
export async function obterCurso(cursoId) {
  try {
    return await requisitar('academico', `/cursos/${cursoId}`)
  } catch (err) {
    if (err?.status === 404) return null
    throw err
  }
}
