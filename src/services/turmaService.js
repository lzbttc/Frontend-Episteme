import { turmaVirtualMock } from '../mocks/turmaVirtualMock'
import { disciplinas as disciplinasMock } from '../mocks/disciplinas'
import { ErroApi, requisitar } from './apiClient'
import { obterDisciplina } from './disciplinaService'

const METRICAS_PADRAO = { average: 0, attendance: 0 }
const PADRAO_LINK = /^(https?:\/\/|www\.)/i

function formatarData(data) {
  return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
}

function mapearAviso(aviso) {
  return {
    id: aviso.id,
    author: aviso.autor,
    date: formatarData(aviso.data),
    title: aviso.titulo,
    message: aviso.mensagem,
  }
}

function mapearDocumento(documento, indice) {
  const link = PADRAO_LINK.test(documento)
  return {
    id: `documento-${indice}`,
    title: documento,
    description: link ? 'Link da turma' : 'Documento da turma',
    type: link ? 'link' : 'document',
  }
}

/**
 * Serviço responsável por carregar os dados específicos da turma virtual.
 * Avisos e documentos vêm da API. Módulos, atividades e métricas continuam no mock.
 */

/**
 * Obtém os dados completos da turma virtual de uma disciplina.
 * Retorna null quando o id informado não corresponder a nenhuma turma cadastrada.
 *
 * @param {string} id - Identificador da disciplina/turma (ex.: "bd002")
 * @returns {Promise<Object | null>} Objeto consolidado da turma virtual ou null
 */
export async function obterTurma(id) {
  let turmaApi
  try {
    turmaApi = await requisitar('turma', `/turmas/${id}`)
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return null
    }
    throw err
  }

  const discipline = await obterDisciplina(id)
  if (!discipline) {
    return null
  }

  const disciplinaMock = disciplinasMock.find(
    (disciplina) => disciplina.name === turmaApi.materia
  )
  const dadosMock = turmaVirtualMock[disciplinaMock?.id] || {
    metrics: METRICAS_PADRAO,
    modules: [],
    activities: [],
  }

  return {
    id,
    discipline,
    metrics: dadosMock.metrics,
    modules: dadosMock.modules,
    activities: dadosMock.activities,
    notices: turmaApi.avisos.map(mapearAviso),
    resources: turmaApi.documentos.map(mapearDocumento),
  }
}
