import { studentMock } from '../mocks/studentMock'
import { ErroApi, requisitar, obterToken } from './apiClient'
import { lerUsuarioId } from './authService'

/**
 * Serviço responsável por obter os dados do estudante e informações gerais da home.
 * Nome, matrícula e curso vêm da API. Métricas, compromissos e notícias continuam no mock.
 */

/**
 * Obtém os dados cadastrais e métricas acadêmicas do aluno logado.
 *
 * @returns {Promise<{ student: Object, metrics: Array }>}
 */
export async function obterAluno() {
  const usuarioId = lerUsuarioId(obterToken())
  const usuario = await requisitar('identidade', `/usuarios/${usuarioId}`)
  const aluno = await buscarCadastroAluno(usuarioId)

  if (!aluno) {
    return {
      student: { name: usuario.nome, matricula: '', course: '' },
      metrics: studentMock.metrics,
    }
  }

  const curso = await requisitar('academico', `/cursos/${aluno.curso_id}`)

  return {
    student: {
      name: usuario.nome,
      matricula: aluno.matricula_id,
      course: curso.nome,
    },
    metrics: studentMock.metrics,
  }
}

async function buscarCadastroAluno(usuarioId) {
  try {
    return await requisitar('turma', `/alunos/usuario_id/${usuarioId}`)
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return null
    }
    throw err
  }
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
