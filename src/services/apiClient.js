import { expiracaoDoToken } from '../utils/jwt'

const BASES_DOS_SERVICOS = {
  identidade:
    import.meta.env.VITE_IDENTIDADE_API_URL || 'http://localhost:8000',
  turma: import.meta.env.VITE_TURMA_API_URL || 'http://localhost:8001',
  academico: import.meta.env.VITE_ACADEMICO_API_URL || 'http://localhost:8002',
  comunicacao:
    import.meta.env.VITE_COMUNICACAO_API_URL || 'http://localhost:8003',
}

const CHAVE_TOKEN = 'episteme_token'
const CHAVE_SESSAO_EXPIRADA = 'episteme_sessao_expirada'

const MSG_FALHA_CONEXAO = 'Não foi possível conectar ao servidor.'
const MSG_FALHA_GENERICA = 'Não foi possível concluir a operação.'

let aoExpirarSessao = null

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

export function definirAoExpirarSessao(callback) {
  aoExpirarSessao = callback
}

export function obterToken() {
  let token
  try {
    token = sessionStorage.getItem(CHAVE_TOKEN)
  } catch {
    return null
  }

  if (!token) {
    return null
  }

  const expiracao = expiracaoDoToken(token)
  if (expiracao !== null && expiracao <= Date.now()) {
    removerToken()
    marcarSessaoExpirada()
    return null
  }

  return token
}

export function salvarToken(token) {
  sessionStorage.setItem(CHAVE_TOKEN, token)
}

export function removerToken() {
  sessionStorage.removeItem(CHAVE_TOKEN)
}

export function expirarSessao() {
  removerToken()
  marcarSessaoExpirada()
  aoExpirarSessao?.()
}

export function sessaoFoiExpirada() {
  try {
    return sessionStorage.getItem(CHAVE_SESSAO_EXPIRADA) === '1'
  } catch {
    return false
  }
}

export function limparAvisoSessaoExpirada() {
  sessionStorage.removeItem(CHAVE_SESSAO_EXPIRADA)
}

function marcarSessaoExpirada() {
  sessionStorage.setItem(CHAVE_SESSAO_EXPIRADA, '1')
}

async function extrairMensagemDeErro(resposta) {
  try {
    const corpo = await resposta.json()
    return typeof corpo.detail === 'string' ? corpo.detail : MSG_FALHA_GENERICA
  } catch {
    return MSG_FALHA_GENERICA
  }
}

export async function requisitar(
  servico,
  caminho,
  { metodo = 'GET', corpo, formulario, semToken = false } = {}
) {
  const cabecalhos = {}
  let body

  if (formulario) {
    cabecalhos['Content-Type'] = 'application/x-www-form-urlencoded'
    body = formulario
  } else if (corpo !== undefined) {
    cabecalhos['Content-Type'] = 'application/json'
    body = JSON.stringify(corpo)
  }

  const token = semToken ? null : obterToken()
  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`
  }

  let resposta
  try {
    resposta = await fetch(`${BASES_DOS_SERVICOS[servico]}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body,
    })
  } catch {
    throw new ErroApi(MSG_FALHA_CONEXAO, 0)
  }

  if (!resposta.ok) {
    if (resposta.status === 401 && token) {
      expirarSessao()
    }
    throw new ErroApi(await extrairMensagemDeErro(resposta), resposta.status)
  }

  return resposta.json()
}
