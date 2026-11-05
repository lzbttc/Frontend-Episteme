import { ErroApi, requisitar, obterToken } from './apiClient'
import { lerUsuarioId } from './authService'
import { ACESSO_RAPIDO_INICIO } from '../constants/acessoRapido'

const MESES_ABREVIADOS = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
]

function partesDaData(valor) {
  const data = new Date(valor.includes('T') ? valor : `${valor}T00:00:00`)
  return {
    dia: String(data.getDate()).padStart(2, '0'),
    mes: MESES_ABREVIADOS[data.getMonth()],
    hora: `${String(data.getHours()).padStart(2, '0')}:${String(
      data.getMinutes()
    ).padStart(2, '0')}`,
    temHorario: valor.includes('T'),
    instante: data,
  }
}

function mapearMetricas(resumo) {
  const media = Number(resumo.media_geral ?? 0)
  const frequencia = Number(resumo.frequencia_geral ?? 0)
  const horas = Number(resumo.horas_complementares ?? 0)

  return [
    {
      id: 'media',
      value: media.toLocaleString('pt-BR', { minimumFractionDigits: 1 }),
      percentage: Math.round(media * 10),
      label: 'MÉDIA GERAL',
    },
    {
      id: 'frequencia',
      value: `${Math.round(frequencia)}%`,
      percentage: Math.round(frequencia),
      label: 'FREQUÊNCIA',
    },
    {
      id: 'atividades',
      value: `${Math.round(horas)}h`,
      percentage: Math.min(100, Math.round((horas / 120) * 100)),
      label: 'ATIVIDADES C.',
    },
  ]
}

async function obterResumo() {
  try {
    return await requisitar('academico', '/alunos/me/resumo')
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return null
    }
    throw err
  }
}

export async function obterAluno() {
  const usuarioId = lerUsuarioId(obterToken())
  const usuario = await requisitar('identidade', `/usuarios/${usuarioId}`)
  const aluno = await buscarCadastroAluno(usuarioId)
  const resumo = await obterResumo()
  const metrics = resumo ? mapearMetricas(resumo) : []

  if (!aluno) {
    return {
      student: {
        name: usuario.nome,
        matricula: usuario.matricula || '',
        course: usuario.e_admin ? 'Coordenação Acadêmica' : '',
      },
      metrics,
    }
  }

  const curso = await requisitar('academico', `/cursos/${aluno.curso_id}`)

  return {
    student: {
      name: usuario.nome,
      matricula: aluno.matricula_id,
      course: curso.nome,
    },
    metrics,
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

function mapearCompromisso(compromisso) {
  const { dia, mes, hora, temHorario } = partesDaData(compromisso.data)
  return {
    id: compromisso.id,
    dateDay: dia,
    dateMonth: mes,
    title: compromisso.titulo,
    topic: compromisso.disciplina,
    time: temHorario ? hora : '',
    location: compromisso.disciplina,
    type: compromisso.tipo,
  }
}

export async function obterProximoCompromisso() {
  let resposta
  try {
    resposta = await requisitar('academico', '/alunos/me/compromissos?limite=1')
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return null
    }
    throw err
  }

  const proximo = resposta.compromissos?.[0]
  return proximo ? mapearCompromisso(proximo) : null
}

export async function listarAcessoRapidoDestaque() {
  return ACESSO_RAPIDO_INICIO
}

function mapearNoticia(comunicado) {
  const { dia, mes } = partesDaData(comunicado.publicado_em)
  return {
    id: comunicado.id,
    dateDay: dia,
    dateMonth: mes,
    title: comunicado.titulo,
    summary: comunicado.resumo,
  }
}

export async function listarNoticiasRecentes() {
  let resposta
  try {
    resposta = await requisitar('comunicacao', '/comunicados?limite=3')
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }

  return (resposta.comunicados || []).map(mapearNoticia)
}
