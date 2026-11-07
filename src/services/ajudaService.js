/**
 * Serviço da Central de Ajuda — EPIS.
 *
 * Encapsula o acesso aos dados da Central de Ajuda. Atualmente utiliza
 * dados estruturados em mocks, mas está preparado para substituir a fonte
 * de dados por chamadas assíncronas a uma API backend sem impacto nos componentes visuais.
 */

import {
  CATEGORIAS_AJUDA,
  ORIENTACOES_AJUDA,
  FAQS_AJUDA,
  PERFIS,
} from '../mocks/centralAjudaData.js'
import { decodificarPayloadJwt } from '../utils/jwt.js'

/**
 * Remove acentos e converte para minúsculas para busca resiliente.
 */
function normalizarTexto(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Identifica o perfil do usuário autenticado a partir dos dados da sessão e token.
 *
 * @param {Object|null} aluno - Dados do aluno/usuário no AuthContext
 * @param {string|null} token - JWT da sessão atual
 * @returns {'aluno'|'professor'|'coordenacao'}
 */
export function identificarPerfilAutenticado(aluno, token) {
  if (token) {
    const payload = decodificarPayloadJwt(token)
    if (payload?.e_admin === true) {
      return PERFIS.COORDENACAO
    }
  }

  const matricula = aluno?.matricula?.toUpperCase() || ''

  if (matricula.startsWith('ADM')) {
    return PERFIS.COORDENACAO
  }

  if (matricula.startsWith('P')) {
    return PERFIS.PROFESSOR
  }

  if (aluno?.perfil) {
    const perfilNorm = normalizarTexto(aluno.perfil)
    if (perfilNorm.includes('coord') || perfilNorm.includes('admin')) {
      return PERFIS.COORDENACAO
    }
    if (perfilNorm.includes('prof') || perfilNorm.includes('docent')) {
      return PERFIS.PROFESSOR
    }
  }

  return PERFIS.ALUNO
}

/**
 * Retorna as categorias disponíveis na Central de Ajuda.
 *
 * @returns {Promise<Array>}
 */
export async function listarCategoriasAjuda() {
  return Promise.resolve([...CATEGORIAS_AJUDA])
}

/**
 * Filtra e retorna orientações de uso por categoria, perfil e busca.
 *
 * @param {Object} [filtros]
 * @param {string} [filtros.categoriaId]
 * @param {string} [filtros.perfil]
 * @param {string} [filtros.busca]
 * @returns {Promise<Array>}
 */
export async function listarOrientacoesAjuda({
  categoriaId,
  perfil,
  busca,
} = {}) {
  let resultado = [...ORIENTACOES_AJUDA]

  if (categoriaId && categoriaId !== 'todas') {
    resultado = resultado.filter((item) => item.categoriaId === categoriaId)
  }

  if (perfil && perfil !== 'todos') {
    resultado = resultado.filter((item) => item.perfis.includes(perfil))
  }

  if (busca && busca.trim()) {
    const termo = normalizarTexto(busca)
    resultado = resultado.filter((item) => {
      const matchTitulo = normalizarTexto(item.titulo).includes(termo)
      const matchResumo = normalizarTexto(item.resumo).includes(termo)
      const matchPassos = item.passos?.some((p) =>
        normalizarTexto(p).includes(termo)
      )
      const matchTags = item.tags?.some((t) =>
        normalizarTexto(t).includes(termo)
      )
      return matchTitulo || matchResumo || matchPassos || matchTags
    })
  }

  return Promise.resolve(resultado)
}

/**
 * Filtra e retorna perguntas frequentes (FAQs) por categoria, perfil e busca.
 *
 * @param {Object} [filtros]
 * @param {string} [filtros.categoriaId]
 * @param {string} [filtros.perfil]
 * @param {string} [filtros.busca]
 * @returns {Promise<Array>}
 */
export async function listarFaqsAjuda({ categoriaId, perfil, busca } = {}) {
  let resultado = [...FAQS_AJUDA]

  if (categoriaId && categoriaId !== 'todas') {
    resultado = resultado.filter((item) => item.categoriaId === categoriaId)
  }

  if (perfil && perfil !== 'todos') {
    resultado = resultado.filter((item) => item.perfis.includes(perfil))
  }

  if (busca && busca.trim()) {
    const termo = normalizarTexto(busca)
    resultado = resultado.filter((item) => {
      const matchPergunta = normalizarTexto(item.pergunta).includes(termo)
      const matchResposta = normalizarTexto(item.resposta).includes(termo)
      const matchTags = item.tags?.some((t) =>
        normalizarTexto(t).includes(termo)
      )
      return matchPergunta || matchResposta || matchTags
    })
  }

  return Promise.resolve(resultado)
}

/**
 * Retorna dados completos agregados da Central de Ajuda.
 *
 * @param {Object} [filtros]
 * @returns {Promise<{ categorias: Array, orientacoes: Array, faqs: Array }>}
 */
export async function obterDadosCentralAjuda(filtros = {}) {
  const [categorias, orientacoes, faqs] = await Promise.all([
    listarCategoriasAjuda(),
    listarOrientacoesAjuda(filtros),
    listarFaqsAjuda(filtros),
  ])

  return {
    categorias,
    orientacoes,
    faqs,
  }
}
