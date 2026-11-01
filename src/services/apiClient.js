const BASES_DOS_SERVICOS = {
  identidade:
    import.meta.env.VITE_IDENTIDADE_API_URL || 'http://localhost:8000',
  turma: import.meta.env.VITE_TURMA_API_URL || 'http://localhost:8001',
  academico: import.meta.env.VITE_ACADEMICO_API_URL || 'http://localhost:8002',
}

const CHAVE_TOKEN = 'episteme_token'

const MSG_FALHA_CONEXAO = 'Não foi possível conectar ao servidor.'
const MSG_FALHA_GENERICA = 'Não foi possível concluir a operação.'

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

export function obterToken() {
  try {
    return sessionStorage.getItem(CHAVE_TOKEN)
  } catch {
    return null
  }
}

export function salvarToken(token) {
  sessionStorage.setItem(CHAVE_TOKEN, token)
}

export function removerToken() {
  sessionStorage.removeItem(CHAVE_TOKEN)
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
    throw new ErroApi(await extrairMensagemDeErro(resposta), resposta.status)
  }

  return resposta.json()
}
