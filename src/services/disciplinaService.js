import { disciplinas as disciplinasMock } from '../mocks/disciplinas'
import { minhasDisciplinasMock } from '../mocks/minhasDisciplinasMock'
import { requisitar } from './apiClient'

const DIAS_ABREVIADOS = {
  Segunda: 'Seg',
  Terça: 'Ter',
  Quarta: 'Qua',
  Quinta: 'Qui',
  Sexta: 'Sex',
}

function formatarHora(horario) {
  return horario.slice(0, 5)
}

function mapearDisciplina(item) {
  const [turma] = item.turmas
  const horarios = turma.horarios
  const primeiro = horarios[0]
  const referencia =
    disciplinasMock.find((disciplina) => disciplina.name === item.nome) || {}
  const dias = horarios.map((h) => DIAS_ABREVIADOS[h.dia_semana]).join(' & ')
  const horas = primeiro
    ? `${formatarHora(primeiro.horario_inicio)} - ${formatarHora(primeiro.horario_fim)}`
    : ''

  return {
    id: turma.id,
    code: item.codigo,
    name: item.nome,
    turma: `Turma ${turma.periodo_letivo}`,
    semester: turma.periodo_letivo,
    professor: turma.professor
      ? `Matrícula ${turma.professor.matricula_id}`
      : '',
    department: item.departamento,
    campus: '',
    location: primeiro?.local ?? '',
    scheduleDays: dias,
    scheduleHours: horas,
    schedule: `${dias.replace(' & ', '/')} ${horas}`.trim(),
    room: primeiro?.local ?? '',
    progress: referencia.progress ?? 0,
    frequencia: referencia.frequencia ?? '—',
    finalGrade: referencia.finalGrade,
    status: 'em-andamento',
    route: 'turma-virtual',
  }
}

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
  if (status === 'concluida') {
    return []
  }

  const { disciplinas } = await requisitar(
    'academico',
    '/matricula/minhas-disciplinas'
  )
  return disciplinas.map(mapearDisciplina)
}

/**
 * Obtém os detalhes de uma disciplina pelo seu ID.
 *
 * @param {string} id - Identificador da disciplina (ex.: "bd002")
 * @returns {Promise<Object | null>} Dados da disciplina ou null se não encontrada
 */
export async function obterDisciplina(id) {
  const lista = await listarDisciplinas()
  return lista.find((disciplina) => disciplina.id === id) || null
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
