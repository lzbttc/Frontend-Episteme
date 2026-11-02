import { ErroApi, requisitar } from './apiClient'
import { ACESSO_RAPIDO_DISCIPLINAS } from '../constants/acessoRapido'

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

function formatarNota(valor) {
  if (valor === null || valor === undefined) {
    return undefined
  }
  return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 1 })
}

function formatarFrequencia(valor) {
  if (valor === null || valor === undefined) {
    return '—'
  }
  return `${Math.round(Number(valor))}%`
}

function nomeDoProfessor(professor) {
  if (!professor) {
    return ''
  }
  return professor.nome || `Matrícula ${professor.matricula_id}`
}

function mapearDisciplina(item) {
  const [turma] = item.turmas
  const horarios = turma.horarios || []
  const primeiro = horarios[0]
  const dias = horarios.map((h) => DIAS_ABREVIADOS[h.dia_semana]).join(' & ')
  const horas = primeiro
    ? `${formatarHora(primeiro.horario_inicio)} - ${formatarHora(
        primeiro.horario_fim
      )}`
    : ''

  return {
    id: turma.id,
    code: item.codigo,
    name: item.nome,
    turma: `Turma ${turma.periodo_letivo}`,
    semester: turma.periodo_letivo,
    professor: nomeDoProfessor(turma.professor),
    department: item.departamento,
    campus: '',
    location: primeiro?.local ?? '',
    scheduleDays: dias,
    scheduleHours: horas,
    schedule: `${dias.replace(' & ', '/')} ${horas}`.trim(),
    room: primeiro?.local ?? '',
    progress: turma.progresso ?? 0,
    frequencia: formatarFrequencia(turma.frequencia),
    finalGrade: formatarNota(turma.nota_final),
    status: 'em-andamento',
    route: 'turma-virtual',
  }
}

function mapearHistorico(item) {
  return {
    id: item.turma_id,
    code: '',
    name: item.disciplina,
    turma: `Turma ${item.periodo_letivo}`,
    semester: item.periodo_letivo,
    professor: '',
    department: '',
    campus: '',
    location: '',
    scheduleDays: '',
    scheduleHours: '',
    schedule: '',
    room: '',
    progress: 100,
    frequencia: formatarFrequencia(item.frequencia_final),
    finalGrade: formatarNota(item.nota_final),
    status: 'concluida',
    route: 'turma-virtual',
  }
}

async function listarEmAndamento() {
  let resposta
  try {
    resposta = await requisitar('academico', '/matricula/minhas-disciplinas')
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }
  return resposta.disciplinas.map(mapearDisciplina)
}

async function listarConcluidas() {
  let resposta
  try {
    resposta = await requisitar('academico', '/alunos/me/historico')
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }
  return resposta.disciplinas.map(mapearHistorico)
}

export async function listarDisciplinas(status = 'todas') {
  if (status === 'em-andamento') {
    return listarEmAndamento()
  }
  if (status === 'concluida') {
    return listarConcluidas()
  }

  const [emAndamento, concluidas] = await Promise.all([
    listarEmAndamento(),
    listarConcluidas(),
  ])
  return [...emAndamento, ...concluidas]
}

export async function obterDisciplina(id) {
  const lista = await listarEmAndamento()
  return lista.find((disciplina) => disciplina.id === id) || null
}

function mapearAviso(aviso) {
  return {
    id: aviso.id,
    discipline: aviso.disciplina,
    disciplineCode: '',
    timestamp: aviso.data,
    title: aviso.titulo,
    description: aviso.mensagem,
  }
}

export async function listarAvisosRecentes() {
  let resposta
  try {
    resposta = await requisitar('turma', '/alunos/me/avisos?limite=2')
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }
  return (resposta.avisos || []).map(mapearAviso)
}

export async function listarAcoesRapidas() {
  return ACESSO_RAPIDO_DISCIPLINAS
}
