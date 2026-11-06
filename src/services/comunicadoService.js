import { requisitar, ErroApi } from './apiClient.js'

const TAG_METADADOS_INICIO = '<!--epis_validade:'
const TAG_METADADOS_FIM = '-->'

/**
 * Codifica metadados de vigência no corpo (mantido para compatibilidade).
 * Com a persistência em colunas no banco de dados, o backend gerencia diretamente
 * as datas de vigência, tornando a embutição opcional/legada.
 *
 * @param {string} corpo
 * @param {Object} metadados
 * @param {string | null} metadados.inicio_em
 * @param {string | null} metadados.expira_em
 * @returns {string}
 */
export function codificarMetadadosNoCorpo(corpo, { inicio_em, expira_em }) {
  const corpoBase = (corpo || '').replace(/<!--epis_validade:[\s\S]*?-->/g, '').trimEnd()
  if (!inicio_em && !expira_em) {
    return corpoBase
  }
  const payload = JSON.stringify({
    inicio_em: inicio_em || null,
    expira_em: expira_em || null,
  })
  return `${corpoBase}\n\n${TAG_METADADOS_INICIO}${payload}${TAG_METADADOS_FIM}`
}

/**
 * Decodifica metadados de vigência legados caso ainda existam em registros antigos
 * e retorna o corpo limpo para renderização segura.
 *
 * @param {string} corpo
 * @returns {{ corpoLimpo: string, inicio_em: string | null, expira_em: string | null }}
 */
export function decodificarMetadadosDoCorpo(corpo) {
  if (!corpo || typeof corpo !== 'string') {
    return { corpoLimpo: corpo || '', inicio_em: null, expira_em: null }
  }
  const match = corpo.match(/<!--epis_validade:([\s\S]*?)-->/)
  if (!match) {
    return { corpoLimpo: corpo, inicio_em: null, expira_em: null }
  }
  try {
    const meta = JSON.parse(match[1])
    const corpoLimpo = corpo.replace(/<!--epis_validade:[\s\S]*?-->/g, '').trimEnd()
    return {
      corpoLimpo,
      inicio_em: meta.inicio_em || null,
      expira_em: meta.expira_em || null,
    }
  } catch {
    return { corpoLimpo: corpo, inicio_em: null, expira_em: null }
  }
}

/**
 * Converte data de qualquer formato aceitável (Date, epoch, ISO, local)
 * para timestamp em milissegundos, garantindo comparação cronológica exata.
 *
 * @param {string | Date | number | null} valor
 * @returns {number | null}
 */
export function parseParaTimestamp(valor) {
  if (!valor) return null
  if (valor instanceof Date) {
    const t = valor.getTime()
    return Number.isNaN(t) ? null : t
  }
  if (typeof valor === 'number') {
    return Number.isNaN(valor) ? null : valor
  }
  if (typeof valor === 'string') {
    let s = valor.trim()
    if (!s) return null

    // 1. Se já termina com Z ou possui offset explícito (+HH:MM ou -HH:MM ou +HHMM ou -HHMM)
    if (s.endsWith('Z') || s.endsWith('z') || /[+-]\d{2}:?\d{2}$/.test(s)) {
      const t = new Date(s).getTime()
      if (!Number.isNaN(t)) return t
    }

    // 2. Converte delimitador de espaço SQL para T (ex.: 2026-11-06 15:00:00 -> 2026-11-06T15:00:00)
    if (s.includes(' ') && !s.includes('T')) {
      s = s.replace(' ', 'T')
    }

    // 3. Formato de data-hora ISO/SQL sem fuso (ex.: 2026-11-06T15:00 ou 2026-11-06T15:00:00)
    // No backend EPIS todos os timestamps ingênuos são UTC.
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?$/.test(s)) {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) {
        s = `${s}:00`
      }
      const dUtc = new Date(`${s}Z`)
      if (!Number.isNaN(dUtc.getTime())) return dUtc.getTime()
    }

    // 4. Formato de data pura (ex.: 2026-11-06)
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const dUtc = new Date(`${s}T00:00:00Z`)
      if (!Number.isNaN(dUtc.getTime())) return dUtc.getTime()
    }

    const t = new Date(s).getTime()
    if (!Number.isNaN(t)) return t
    const fallback = new Date(valor).getTime()
    if (!Number.isNaN(fallback)) return fallback
  }
  return null
}

/**
 * Funções de compatibilidade para metadados locais (descontinuadas em favor do banco de dados).
 */
export function salvarMetadadosComunicado() {
  // Operação no-op: metadados agora são persistidos no banco de dados
}

export function obterTodosMetadadosComunicados() {
  return {}
}

export function removerMetadadosComunicado() {
  // Operação no-op
}

/**
 * Funções de rascunhos locais mantidas como no-op para segurança e compatibilidade com logout.
 */
export function obterRascunhosLocais() {
  return []
}

export function salvarRascunhoLocal() {
  // No-op: rascunhos agora possuem persistência real no backend
}

export function atualizarRascunhoLocal() {
  // No-op
}

export function removerRascunhoLocal() {
  // No-op
}

export function limparRascunhosLocais() {
  try {
    sessionStorage.removeItem('episteme_comunicados_rascunhos')
    localStorage.removeItem('episteme_comunicados_metadados_v1')
  } catch {
    // Silencioso
  }
}

/**
 * Verifica se um comunicado está ativo e visível para os estudantes.
 * Regras estritas:
 * - Deve estar publicado.
 * - Se possui data de início futura (inicio_em > agora), NÃO está ativo para estudantes.
 * - Se possui data de término que já passou (expira_em <= agora), NÃO está ativo (expirado).
 *
 * @param {Object} comunicado
 * @param {number} [agoraTimestamp=Date.now()]
 * @returns {boolean}
 */
export function estaAtivoParaEstudante(comunicado, agoraTimestamp = Date.now()) {
  if (!comunicado) return false
  if (!comunicado.publicado) return false

  const agora = typeof agoraTimestamp === 'number' ? agoraTimestamp : Date.now()

  // Se tem data de início no futuro, ainda não começou a vigência
  if (comunicado.inicio_em) {
    const inicioTimestamp = parseParaTimestamp(comunicado.inicio_em)
    if (inicioTimestamp && inicioTimestamp > agora) {
      return false
    }
  }

  // Se tem data de encerramento e ela já passou, está expirado
  if (comunicado.expira_em) {
    const expiraTimestamp = parseParaTimestamp(comunicado.expira_em)
    if (expiraTimestamp && expiraTimestamp <= agora) {
      return false
    }
  }

  return true
}

/**
 * Normaliza strings para busca insensível a maiúsculas/minúsculas e acentuação gráfica
 * (ex.: 'matrícula' equivale a 'matricula', 'atenção' equivale a 'atencao').
 *
 * @param {string} str
 * @returns {string}
 */
export function normalizarTextoParaBusca(str) {
  if (!str || typeof str !== 'string') return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export const MAPA_SITUACAO_PLURAL = {
  publicado: 'publicados',
  programado: 'programados',
  rascunho: 'rascunhos',
  expirado: 'expirados',
}

/**
 * Determina o status/situação operacional de um comunicado:
 * - 'rascunho': comunicado não publicado (publicado === false)
 * - 'programado': comunicado publicado com data de início futura (inicio_em > agora)
 * - 'expirado': comunicado publicado cuja data de término expirou (expira_em <= agora)
 * - 'publicado': comunicado publicado e ativo atualmente
 *
 * @param {Object} comunicado
 * @param {number} [agoraTimestamp=Date.now()]
 * @returns {'rascunho' | 'programado' | 'expirado' | 'publicado'}
 */
export function determinarSituacao(comunicado, agoraTimestamp = Date.now()) {
  if (!comunicado) return 'rascunho'
  if (!comunicado.publicado) return 'rascunho'

  const agora = typeof agoraTimestamp === 'number' ? agoraTimestamp : Date.now()

  if (comunicado.inicio_em) {
    const inicioTimestamp = parseParaTimestamp(comunicado.inicio_em)
    if (inicioTimestamp && inicioTimestamp > agora) {
      return 'programado'
    }
  }

  if (comunicado.expira_em) {
    const expiraTimestamp = parseParaTimestamp(comunicado.expira_em)
    if (expiraTimestamp && expiraTimestamp <= agora) {
      return 'expirado'
    }
  }

  return 'publicado'
}

/**
 * Formata data e hora no padrão institucional brasileiro: DD/MM/AAAA HH:mm.
 *
 * @param {string | Date} valor
 * @returns {string} Data e horário formatados ou fallback
 */
export function formatarDataHora(valor) {
  if (!valor) return 'Não informada'
  try {
    const t = parseParaTimestamp(valor)
    if (!t) return valor
    const data = new Date(t)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data)
  } catch {
    return valor
  }
}

/**
 * Converte data ISO ou objeto Date para o formato aceito por input type="datetime-local" (YYYY-MM-DDTHH:mm).
 *
 * @param {string | Date | null} valor
 * @returns {string}
 */
export function paraInputDatetimeLocal(valor) {
  if (!valor) return ''
  try {
    const t = parseParaTimestamp(valor)
    if (!t) return ''
    const d = new Date(t)
    if (Number.isNaN(d.getTime())) return ''

    const ano = d.getFullYear()
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')
    const hora = String(d.getHours()).padStart(2, '0')
    const minuto = String(d.getMinutes()).padStart(2, '0')
    return `${ano}-${mes}-${dia}T${hora}:${minuto}`
  } catch {
    return ''
  }
}

/**
 * Valida os campos textuais antes de envio ao servidor.
 *
 * @param {string} valor
 * @param {string} campo
 * @param {number} maxTam
 * @returns {string}
 */
function validarCampoTexto(valor, campo, maxTam) {
  if (typeof valor !== 'string') {
    throw new Error(`O campo ${campo} é obrigatório.`)
  }
  const limpo = valor.trim()
  if (!limpo) {
    throw new Error(`O campo ${campo} não pode ser vazio ou conter apenas espaços em branco.`)
  }
  if (limpo.length > maxTam) {
    throw new Error(`O campo ${campo} excede o limite máximo permitido de ${maxTam} caracteres.`)
  }
  return limpo
}

/**
 * Lista todos os comunicados institucionais diretamente do backend.
 * Suporta separação estrita entre consultas administrativas e públicas.
 *
 * @param {Object} [opcoes]
 * @param {number} [opcoes.limite=50] - Limite de registros (1 a 100)
 * @param {string} [opcoes.situacao] - Filtro administrativo: 'todos', 'publicados', 'programados', 'rascunhos', 'expirados'
 * @param {boolean} [opcoes.somenteVigentes=false] - Força a listagem apenas de comunicados em vigência ativa
 * @param {boolean} [opcoes.incluirRascunhos] - Se deve incluir comunicados em rascunho
 * @returns {Promise<Array<Object>>} Lista de comunicados
 */
export async function listarComunicados({
  limite = 50,
  situacao,
  somenteVigentes = false,
  incluirRascunhos,
} = {}) {
  let resposta
  try {
    const params = new URLSearchParams({
      limite: String(limite),
    })
    if (situacao) {
      params.append('situacao', situacao)
    }
    if (somenteVigentes) {
      params.append('somente_vigentes', 'true')
    }
    if (typeof incluirRascunhos === 'boolean') {
      params.append('incluir_rascunhos', String(incluirRascunhos))
    }
    resposta = await requisitar('comunicacao', `/comunicados?${params.toString()}`)
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      resposta = { comunicados: [] }
    } else {
      throw err
    }
  }

  const comunicados = (resposta.comunicados || []).map((item) => {
    // Caso algum registro legado ainda contenha metadados em comentário, limpa para exibição
    const decodificado = decodificarMetadadosDoCorpo(item.corpo)
    return {
      ...item,
      corpo: decodificado.corpoLimpo || item.corpo || '',
      publicado: Boolean(item.publicado),
      inicio_em: item.inicio_em ?? decodificado.inicio_em ?? null,
      expira_em: item.expira_em ?? decodificado.expira_em ?? null,
      versao: item.versao ?? 1,
    }
  })

  return comunicados
}

/**
 * Cria um novo comunicado institucional com persistência real no backend.
 *
 * @param {Object} dados
 * @param {string} dados.titulo - Título principal (obrigatório, máx 200)
 * @param {string} dados.resumo - Breve apresentação (obrigatório, máx 500)
 * @param {string} dados.corpo - Conteúdo completo (obrigatório, máx 20000)
 * @param {boolean} [dados.publicado=true] - Estado de publicação
 * @param {string | null} [dados.inicio_em=null] - Início de validade (ISO)
 * @param {string | null} [dados.expira_em=null] - Encerramento de validade (ISO)
 * @returns {Promise<Object>} Comunicado criado
 */
export async function criarComunicado({
  titulo,
  resumo,
  corpo,
  publicado = true,
  inicio_em = null,
  expira_em = null,
}) {
  const tituloLimpo = validarCampoTexto(titulo, 'Título', 200)
  const resumoLimpo = validarCampoTexto(resumo, 'Resumo', 500)
  const corpoLimpo = validarCampoTexto(corpo, 'Corpo', 20000)

  const payload = {
    titulo: tituloLimpo,
    resumo: resumoLimpo,
    corpo: corpoLimpo,
    publicado: Boolean(publicado),
    inicio_em: inicio_em || null,
    expira_em: expira_em || null,
  }

  const resposta = await requisitar('comunicacao', '/comunicados', {
    metodo: 'POST',
    corpo: payload,
  })

  return {
    ...resposta,
    corpo: resposta.corpo || corpoLimpo,
    publicado: Boolean(resposta.publicado ?? publicado),
    inicio_em: resposta.inicio_em ?? inicio_em ?? null,
    expira_em: resposta.expira_em ?? expira_em ?? null,
    versao: resposta.versao ?? 1,
  }
}

/**
 * Atualiza um comunicado existente com persistência real no backend e concorrência otimista.
 *
 * @param {string} id - Identificador do comunicado
 * @param {Object} dados - Campos atualizados
 * @returns {Promise<Object>} Comunicado atualizado
 */
export async function atualizarComunicado(id, dados) {
  const { titulo, resumo, corpo, publicado, inicio_em, expira_em, versao } = dados

  const payload = {}
  if (titulo !== undefined) {
    payload.titulo = validarCampoTexto(titulo, 'Título', 200)
  }
  if (resumo !== undefined) {
    payload.resumo = validarCampoTexto(resumo, 'Resumo', 500)
  }
  if (corpo !== undefined) {
    payload.corpo = validarCampoTexto(corpo, 'Corpo', 20000)
  }
  if (publicado !== undefined) {
    payload.publicado = Boolean(publicado)
  }
  if (inicio_em !== undefined) {
    payload.inicio_em = inicio_em || null
  }
  if (expira_em !== undefined) {
    payload.expira_em = expira_em || null
  }
  if (typeof versao === 'number') {
    payload.versao = versao
  }

  const resposta = await requisitar('comunicacao', `/comunicados/${id}`, {
    metodo: 'PUT',
    corpo: payload,
  })

  return {
    ...resposta,
    corpo: resposta.corpo || (payload.corpo ?? ''),
    publicado: Boolean(resposta.publicado ?? payload.publicado),
    inicio_em: resposta.inicio_em ?? payload.inicio_em ?? null,
    expira_em: resposta.expira_em ?? payload.expira_em ?? null,
    versao: resposta.versao ?? (versao ? versao + 1 : 2),
  }
}

/**
 * Exclui um comunicado institucional com remoção definitiva no banco de dados.
 *
 * @param {string} id - Identificador do comunicado
 * @returns {Promise<{ sucesso: boolean, id: string }>}
 */
export async function excluirComunicado(id) {
  await requisitar('comunicacao', `/comunicados/${id}`, {
    metodo: 'DELETE',
  })

  return { sucesso: true, id }
}

/**
 * Consulta um comunicado individual por identificador no microsserviço de comunicação.
 *
 * @param {string} id - UUID do comunicado
 * @returns {Promise<Object>} Comunicado retornado
 */
export async function obterComunicadoPorId(id) {
  const item = await requisitar('comunicacao', `/comunicados/${id}`)
  const decodificado = decodificarMetadadosDoCorpo(item.corpo)
  return {
    ...item,
    corpo: decodificado.corpoLimpo || item.corpo || '',
    publicado: Boolean(item.publicado),
    inicio_em: item.inicio_em ?? decodificado.inicio_em ?? null,
    expira_em: item.expira_em ?? decodificado.expira_em ?? null,
    versao: item.versao ?? 1,
  }
}
