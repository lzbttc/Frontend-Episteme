import { ErroApi, requisitar, obterToken } from './apiClient.js'
import { lerUsuarioId } from './authService.js'
import { ACESSO_RAPIDO_INICIO } from '../constants/acessoRapido.js'
import {
  listarComunicados,
  estaAtivoParaEstudante,
  parseParaTimestamp,
} from './comunicadoService.js'

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
  if (!valor) {
    const hoje = new Date()
    return {
      dia: String(hoje.getDate()).padStart(2, '0'),
      mes: MESES_ABREVIADOS[hoje.getMonth()],
      hora: '00:00',
      temHorario: false,
      instante: hoje,
    }
  }
  const str = String(valor)
  const t = parseParaTimestamp(valor)
  const data = t ? new Date(t) : new Date(valor)
  if (Number.isNaN(data.getTime())) {
    const hoje = new Date()
    return {
      dia: String(hoje.getDate()).padStart(2, '0'),
      mes: MESES_ABREVIADOS[hoje.getMonth()],
      hora: '00:00',
      temHorario: false,
      instante: hoje,
    }
  }
  return {
    dia: String(data.getDate()).padStart(2, '0'),
    mes: MESES_ABREVIADOS[data.getMonth()],
    hora: `${String(data.getHours()).padStart(2, '0')}:${String(
      data.getMinutes()
    ).padStart(2, '0')}`,
    temHorario: str.includes('T'),
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
  const dataReferencia =
    comunicado.publicado_em || comunicado.inicio_em || new Date().toISOString()
  const { dia, mes } = partesDaData(dataReferencia)
  return {
    id: comunicado.id,
    dateDay: dia,
    dateMonth: mes,
    title: comunicado.titulo,
    summary: comunicado.resumo,
    corpo: comunicado.corpo || '',
    publicado: Boolean(comunicado.publicado),
    publicado_em: comunicado.publicado_em,
    inicio_em: comunicado.inicio_em,
    expira_em: comunicado.expira_em,
  }
}

export async function listarNoticiasRecentes() {
  try {
    const lista = await listarComunicados({
      limite: 50,
      somenteVigentes: true,
      incluirRascunhos: false,
    })
    const agora = Date.now()
    const ativas = (lista || []).filter((item) => estaAtivoParaEstudante(item, agora))
    return ativas.slice(0, 3).map(mapearNoticia)
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }
}

export async function listarTodasNoticiasEstudante() {
  try {
    const lista = await listarComunicados({
      limite: 50,
      somenteVigentes: true,
      incluirRascunhos: false,
    })
    const agora = Date.now()
    const ativas = (lista || []).filter((item) => estaAtivoParaEstudante(item, agora))
    return ativas.map(mapearNoticia)
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      return []
    }
    throw err
  }
}
