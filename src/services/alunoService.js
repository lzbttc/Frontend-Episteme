import { studentMock } from '../mocks/studentMock'

/**
 * Serviço responsável por obter os dados do estudante e informações gerais da home.
 * Na fase atual lê do mock; quando houver API, apenas este arquivo será alterado.
 */

/**
 * Obtém os dados cadastrais e métricas acadêmicas do aluno logado.
 *
 * @returns {Promise<{ student: Object, metrics: Array }>}
 */
export async function obterAluno() {
  return Promise.resolve({
    student: studentMock.student,
    metrics: studentMock.metrics,
  })
}

/**
 * Obtém o próximo compromisso/evento acadêmico destacado para o início.
 *
 * @returns {Promise<Object | null>}
 */
export async function obterProximoCompromisso() {
  const proximo = studentMock.upcomingEvents?.[0] || null
  return Promise.resolve(proximo)
}

/**
 * Lista as ações rápidas destacadas para a página inicial.
 *
 * @returns {Promise<Array>}
 */
export async function listarAcessoRapidoDestaque() {
  const destacadas = studentMock.quickActions.filter(
    (action) =>
      action.title === 'Solicitar matrícula' || action.title === 'Coordenação'
  )
  return Promise.resolve(destacadas)
}

/**
 * Lista as últimas notícias institucionais.
 *
 * @returns {Promise<Array>}
 */
export async function listarNoticiasRecentes() {
  return Promise.resolve(studentMock.latestNews || [])
}
