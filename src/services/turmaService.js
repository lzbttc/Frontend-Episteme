import { turmaVirtualMock } from '../mocks/turmaVirtualMock'
import { obterDisciplina } from './disciplinaService'

/**
 * Serviço responsável por carregar os dados específicos da turma virtual.
 * Na fase atual lê do mock; quando houver API, apenas este arquivo será alterado.
 */

/**
 * Obtém os dados completos da turma virtual de uma disciplina.
 * Retorna null quando o id informado não corresponder a nenhuma turma cadastrada.
 *
 * @param {string} id - Identificador da disciplina/turma (ex.: "bd002")
 * @returns {Promise<Object | null>} Objeto consolidado da turma virtual ou null
 */
export async function obterTurma(id) {
  const turmaData = turmaVirtualMock[id]
  if (!turmaData) {
    return Promise.resolve(null)
  }

  const discipline = await obterDisciplina(id)

  return Promise.resolve({
    id,
    discipline,
    metrics: turmaData.metrics,
    modules: turmaData.modules,
    activities: turmaData.activities,
    notices: turmaData.notices,
    resources: turmaData.resources,
  })
}
