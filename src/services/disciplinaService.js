import { disciplinas } from '../mocks/disciplinas'
import { minhasDisciplinasMock } from '../mocks/minhasDisciplinasMock'

/**
 * Serviço responsável pela listagem e consulta detalhada de disciplinas.
 * Na fase atual lê do mock; quando houver API, apenas este arquivo será alterado.
 */

/**
 * Lista todas as disciplinas, opcionalmente filtradas por status.
 *
 * @param {'em-andamento' | 'concluida' | 'todas'} [status='todas'] - Filtro de status
 * @returns {Promise<Array>} Lista de disciplinas
 */
export async function listarDisciplinas(status = 'todas') {
  if (status === 'todas') {
    return Promise.resolve(disciplinas)
  }
  return Promise.resolve(disciplinas.filter((d) => d.status === status))
}

/**
 * Obtém os detalhes de uma disciplina pelo seu ID.
 *
 * @param {string} id - Identificador da disciplina (ex.: "bd002")
 * @returns {Promise<Object | null>} Dados da disciplina ou null se não encontrada
 */
export async function obterDisciplina(id) {
  const disc = disciplinas.find((d) => d.id === id) || null
  return Promise.resolve(disc)
}

/**
 * Lista os avisos recentes das disciplinas do aluno.
 *
 * @returns {Promise<Array>} Lista de avisos
 */
export async function listarAvisosRecentes() {
  return Promise.resolve(minhasDisciplinasMock.recentNotices || [])
}

/**
 * Lista os atalhos de ações rápidas de Minhas Disciplinas.
 *
 * @returns {Promise<Array>}
 */
export async function listarAcoesRapidas() {
  return Promise.resolve(minhasDisciplinasMock.quickActions || [])
}
