import { requisitar, ErroApi } from './apiClient.js'

/**
 * Consulta a lista de períodos de matrícula cadastrados no serviço acadêmico.
 *
 * @param {Object} [filtros={}]
 * @param {string} [filtros.periodo_letivo]
 * @param {'agendado' | 'aberto' | 'encerrado'} [filtros.status]
 * @returns {Promise<Array<Object>>} Lista de períodos de matrícula
 */
export async function obterPeriodosMatricula(filtros = {}) {
  const query = new URLSearchParams()
  if (filtros.periodo_letivo) query.append('periodo_letivo', filtros.periodo_letivo)
  if (filtros.status) query.append('status', filtros.status)

  const queryString = query.toString() ? `?${query.toString()}` : ''
  try {
    const resposta = await requisitar('academico', `/periodos-matricula/${queryString}`)
    return resposta?.periodos || []
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }
}

/**
 * Consulta um período de matrícula específico por ID.
 *
 * @param {string} periodoId
 * @returns {Promise<Object>}
 */
export async function obterPeriodoMatricula(periodoId) {
  return await requisitar('academico', `/periodos-matricula/${periodoId}`)
}

/**
 * Consulta as turmas disponíveis para um período letivo aberto.
 *
 * @param {string} periodoLetivo - No formato AAAA.1 ou AAAA.2 (ex: "2026.2")
 * @param {Object} [filtros={}] - Filtros opcionais (disciplina, codigo, dia_semana, horario_inicio, horario_fim, turma)
 * @returns {Promise<{ periodo_letivo: string, turmas: Array<Object> }>}
 */
export async function obterTurmasDisponiveis(periodoLetivo, filtros = {}) {
  const query = new URLSearchParams({ periodo_letivo: periodoLetivo })

  if (filtros.disciplina) query.append('disciplina', filtros.disciplina)
  if (filtros.codigo) query.append('codigo', filtros.codigo)
  if (filtros.dia_semana) query.append('dia_semana', filtros.dia_semana)
  if (filtros.horario_inicio) query.append('horario_inicio', filtros.horario_inicio)
  if (filtros.horario_fim) query.append('horario_fim', filtros.horario_fim)
  if (filtros.turma) query.append('turma', filtros.turma)

  return await requisitar('academico', `/matricula/turmas-disponiveis?${query.toString()}`)
}

/**
 * Envia uma solicitação de matrícula para análise.
 *
 * @param {string} periodoLetivo - Formato AAAA.1 ou AAAA.2
 * @param {Array<string>} turmasIds - Lista de UUIDs das turmas selecionadas
 * @returns {Promise<Object>} Dados da solicitação criada (protocolo, situacao, data, etc.)
 */
export async function solicitarMatricula(periodoLetivo, turmasIds) {
  return await requisitar('academico', '/matricula/solicitar', {
    metodo: 'POST',
    corpo: {
      periodo_letivo: periodoLetivo,
      turmas_ids: turmasIds,
    },
  })
}

/**
 * Consulta todas as solicitações de matrícula registradas para o aluno autenticado.
 *
 * @param {Object} [filtros={}]
 * @param {string} [filtros.periodo_letivo]
 * @param {string} [filtros.protocolo]
 * @returns {Promise<Array<Object>>} Lista de solicitações
 */
export async function obterMinhasSolicitacoes(filtros = {}) {
  const query = new URLSearchParams()
  if (filtros.periodo_letivo) query.append('periodo_letivo', filtros.periodo_letivo)
  if (filtros.protocolo) query.append('protocolo', filtros.protocolo)

  const queryString = query.toString() ? `?${query.toString()}` : ''
  try {
    const resposta = await requisitar('academico', `/matricula/solicitacoes${queryString}`)
    return resposta?.solicitacoes || []
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }
}

/**
 * Consulta uma solicitação de matrícula específica pelo número de protocolo (UUID).
 *
 * @param {string} protocolo
 * @returns {Promise<Object>}
 */
export async function obterSolicitacaoPorProtocolo(protocolo) {
  return await requisitar('academico', `/matricula/solicitacoes/${protocolo}`)
}
