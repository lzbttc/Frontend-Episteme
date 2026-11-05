import { requisitar, ErroApi } from './apiClient.js'

const CHAVE_RASCUNHOS_LOCAIS = 'episteme_comunicados_rascunhos'

/**
 * Lê os rascunhos criados na sessão local.
 * Como o endpoint GET /comunicados do backend retorna exclusivamente comunicados
 * onde publicado = True, os rascunhos criados pelo administrador são mantidos
 * em cache de sessão para acompanhamento e visualização no gerenciamento.
 *
 * @returns {Array<Object>} Lista de comunicados em rascunho
 */
export function obterRascunhosLocais() {
  try {
    const dados = sessionStorage.getItem(CHAVE_RASCUNHOS_LOCAIS)
    return dados ? JSON.parse(dados) : []
  } catch {
    return []
  }
}

/**
 * Salva um comunicado como rascunho na sessão local.
 *
 * @param {Object} rascunho
 */
export function salvarRascunhoLocal(rascunho) {
  try {
    const rascunhos = obterRascunhosLocais()
    const atualizados = [
      { ...rascunho, publicado: false },
      ...rascunhos.filter((item) => item.id !== rascunho.id),
    ]
    sessionStorage.setItem(CHAVE_RASCUNHOS_LOCAIS, JSON.stringify(atualizados))
  } catch {
    // Falha silenciosa em caso de indisponibilidade de storage
  }
}

/**
 * Lista todos os comunicados institucionais.
 * Reaproveita o endpoint GET /comunicados do backend (ordenados por data mais recente).
 *
 * @param {Object} [opcoes]
 * @param {number} [opcoes.limite=50] - Limite de registros (máx. 50 suportado pela API)
 * @param {boolean} [opcoes.incluirRascunhos=true] - Se deve incluir os rascunhos locais
 * @returns {Promise<Array<Object>>} Lista de comunicados ordenados
 */
export async function listarComunicados({
  limite = 50,
  incluirRascunhos = true,
} = {}) {
  let resposta
  try {
    resposta = await requisitar('comunicacao', `/comunicados?limite=${limite}`)
  } catch (err) {
    if (err instanceof ErroApi && err.status === 404) {
      resposta = { comunicados: [] }
    } else {
      throw err
    }
  }

  const comunicadosPublicados = (resposta.comunicados || []).map((item) => ({
    ...item,
    publicado: true,
  }))

  if (!incluirRascunhos) {
    return comunicadosPublicados
  }

  const rascunhos = obterRascunhosLocais()

  // Combina rascunhos e publicados
  // Rascunhos criados pelo admin aparecem no topo para fácil localização
  return [...rascunhos, ...comunicadosPublicados]
}

/**
 * Cria e publica (ou salva como rascunho) um novo comunicado institucional.
 * Utiliza o endpoint POST /comunicados do backend.
 *
 * @param {Object} dados
 * @param {string} dados.titulo - Título principal (obrigatório)
 * @param {string} dados.resumo - Breve apresentação (obrigatório)
 * @param {string} dados.corpo - Conteúdo completo (obrigatório)
 * @param {boolean} [dados.publicado=true] - Estado de publicação
 * @returns {Promise<Object>} Comunicado criado
 */
export async function criarComunicado({
  titulo,
  resumo,
  corpo,
  publicado = true,
}) {
  const tituloLimpo = titulo?.trim() || ''
  const resumoLimpo = resumo?.trim() || ''
  const corpoLimpo = corpo?.trim() || ''

  if (!tituloLimpo) {
    throw new Error('O título do comunicado é obrigatório.')
  }
  if (!resumoLimpo) {
    throw new Error('O resumo do comunicado é obrigatório.')
  }
  if (!corpoLimpo) {
    throw new Error('O corpo do comunicado é obrigatório.')
  }

  const payload = {
    titulo: tituloLimpo,
    resumo: resumoLimpo,
    corpo: corpoLimpo,
    publicado: Boolean(publicado),
  }

  const resposta = await requisitar('comunicacao', '/comunicados', {
    metodo: 'POST',
    corpo: payload,
  })

  const comunicadoCriado = {
    ...resposta,
    publicado: Boolean(publicado),
  }

  if (!publicado) {
    salvarRascunhoLocal(comunicadoCriado)
  }

  return comunicadoCriado
}
