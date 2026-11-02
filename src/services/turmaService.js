import { ErroApi, requisitar } from './apiClient'
import { obterDisciplina } from './disciplinaService'

const METRICAS_PADRAO = { average: 0, attendance: 0 }
const PADRAO_LINK = /^(https?:\/\/|www\.)/i

const TIPO_MATERIAL = {
  video: 'video',
  link: 'link',
  arquivo: 'file',
}

const SITUACAO_ATIVIDADE = {
  concluida: 'completed',
  pendente: 'pending',
  vencida: 'pending',
}

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

function nomeDoProfessor(professor) {
  if (!professor) {
    return ''
  }
  return professor.nome || `Matrícula ${professor.matricula_id}`
}

function disciplinaDaTurma(id, turmaApi) {
  const professor = turmaApi.professor
  return {
    id,
    code: turmaApi.codigo ?? '',
    name: turmaApi.materia,
    turma: turmaApi.periodo_letivo ? `Turma ${turmaApi.periodo_letivo}` : '',
    semester: turmaApi.periodo_letivo ?? '',
    professor: nomeDoProfessor(professor),
    department: turmaApi.departamento ?? '',
    campus: '',
    location: '',
    scheduleDays: '',
    scheduleHours: '',
    schedule: '',
    room: '',
    status: 'em-andamento',
    route: 'turma-virtual',
  }
}

function mapearMaterial(material) {
  return {
    id: material.id,
    title: material.titulo,
    description: material.descricao,
    type: TIPO_MATERIAL[material.tipo] || 'file',
  }
}

function mapearModulo(modulo) {
  const materiais = [...(modulo.materiais || [])].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
  )
  return {
    id: modulo.id,
    title: modulo.titulo,
    status: modulo.status ?? 'pending',
    items: materiais.map(mapearMaterial),
  }
}

function mapearAtividade(atividade) {
  return {
    id: atividade.id,
    type: atividade.tipo,
    category: atividade.categoria,
    points: atividade.pontos ?? null,
    title: atividade.titulo,
    dueAt: atividade.prazo,
    details: atividade.descricao || null,
    status: SITUACAO_ATIVIDADE[atividade.situacao] || 'pending',
    action: 'Abrir',
  }
}

function mapearMetricas(desempenho) {
  if (!desempenho) {
    return METRICAS_PADRAO
  }
  return {
    average: Number(desempenho.media ?? 0),
    attendance: Math.round(Number(desempenho.frequencia ?? 0)),
  }
}

async function obterModulos(id) {
  try {
    const resposta = await requisitar('turma', `/turmas/${id}/modulos`)
    const modulos = [...(resposta.modulos || [])].sort(
      (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
    )
    return modulos.map(mapearModulo)
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }
}

async function obterAtividades(id) {
  try {
    const resposta = await requisitar('turma', `/turmas/${id}/atividades`)
    return (resposta.atividades || []).map(mapearAtividade)
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }
}

async function obterDesempenho(id) {
  try {
    return await requisitar('turma', `/alunos/me/turmas/${id}/desempenho`)
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return null
    }
    throw err
  }
}

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

  const [discipline, modules, activities, desempenho] = await Promise.all([
    obterDisciplina(id),
    obterModulos(id),
    obterAtividades(id),
    obterDesempenho(id),
  ])

  return {
    id,
    discipline: discipline || disciplinaDaTurma(id, turmaApi),
    metrics: mapearMetricas(desempenho),
    modules,
    activities,
    notices: (turmaApi.avisos || []).map(mapearAviso),
    resources: (turmaApi.documentos || []).map(mapearDocumento),
  }
}

export async function registrarAcessoMaterial(id) {
  return requisitar('turma', `/materiais/${id}/acesso`, { metodo: 'POST' })
}

export async function enviarEntregaAtividade(id) {
  return requisitar('turma', `/atividades/${id}/entrega`, { metodo: 'POST' })
}
