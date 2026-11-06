/**
 * Utilitários de validação rigorosa de datas e horários para o EPIS.
 * Garante coerência cronológica, impede datas no passado e bloqueia
 * datas inexistentes (ex.: 30 de fevereiro, 31 de abril, horários inválidos).
 */

/**
 * Verifica se um ano é bissexto.
 * @param {number} ano
 * @returns {boolean}
 */
export function isAnoBissexto(ano) {
  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0
}

/**
 * Retorna a quantidade exata de dias em um determinado mês/ano.
 * @param {number} ano
 * @param {number} mes - 1 (Janeiro) a 12 (Dezembro)
 * @returns {number}
 */
export function obterDiasNoMes(ano, mes) {
  if (mes === 2) {
    return isAnoBissexto(ano) ? 29 : 28
  }
  if ([4, 6, 9, 11].includes(mes)) {
    return 30
  }
  return 31
}

/**
 * Analisa e valida uma string de data/hora (formato ISO ou YYYY-MM-DDTHH:mm).
 * Verifica se a data é matematicamente possível e existe no calendário.
 *
 * @param {string} valor
 * @returns {{ valido: boolean, dataObj: Date | null, erro: string | null }}
 */
export function analisarDataHora(valor) {
  if (!valor || typeof valor !== 'string' || !valor.trim()) {
    return { valido: false, dataObj: null, erro: 'Data e horário não informados.' }
  }

  const trimmed = valor.trim()

  // Se for uma data ISO completa com fuso (ex.: 2026-11-06T03:33:00.000Z),
  // faz o parse com precisão de timezone e converte para Date
  if (trimmed.endsWith('Z') || /[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed)
    if (!Number.isNaN(d.getTime())) {
      return { valido: true, dataObj: d, erro: null }
    }
  }

  const regex = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/
  const match = trimmed.match(regex)

  if (!match) {
    return {
      valido: false,
      dataObj: null,
      erro: 'Formato de data inválido. Utilize o formato DD/MM/AAAA HH:mm.',
    }
  }

  const ano = parseInt(match[1], 10)
  const mes = parseInt(match[2], 10)
  const dia = parseInt(match[3], 10)
  const hora = match[4] !== undefined ? parseInt(match[4], 10) : 0
  const minuto = match[5] !== undefined ? parseInt(match[5], 10) : 0

  if (ano < 2024 || ano > 2099) {
    return {
      valido: false,
      dataObj: null,
      erro: `Ano inválido (${ano}). O ano deve estar entre 2024 e 2099.`,
    }
  }

  if (mes < 1 || mes > 12) {
    return {
      valido: false,
      dataObj: null,
      erro: `Mês inválido (${mes}). O mês deve ser de 1 a 12.`,
    }
  }

  const diasMax = obterDiasNoMes(ano, mes)
  if (dia < 1 || dia > diasMax) {
    const nomesMeses = [
      '',
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ]
    return {
      valido: false,
      dataObj: null,
      erro: `Data inexistente: o mês de ${nomesMeses[mes]} possui no máximo ${diasMax} dias.`,
    }
  }

  if (hora < 0 || hora > 23) {
    return {
      valido: false,
      dataObj: null,
      erro: `Hora inválida (${hora}). As horas devem estar entre 00 e 23.`,
    }
  }

  if (minuto < 0 || minuto > 59) {
    return {
      valido: false,
      dataObj: null,
      erro: `Minuto inválido (${minuto}). Os minutos devem estar entre 00 e 59.`,
    }
  }

  const dataObj = new Date(ano, mes - 1, dia, hora, minuto, 0, 0)
  if (Number.isNaN(dataObj.getTime())) {
    return {
      valido: false,
      dataObj: null,
      erro: 'Data e horário inválidos.',
    }
  }

  return { valido: true, dataObj, erro: null }
}

/**
 * Validação semântica e cronológica completa de uma data informada.
 *
 * @param {string} valor - String de data/hora
 * @param {Object} [opcoes]
 * @param {boolean} [opcoes.permitirPassado=false] - Se permite datas anteriores a agora
 * @param {string | Date | null} [opcoes.minData=null] - Data mínima (ex: data de início)
 * @param {string} [opcoes.nomeCampo='Data'] - Nome amigável para a mensagem de erro
 * @returns {{ valido: boolean, erro: string | null }}
 */
export function validarDataCoerente(
  valor,
  { permitirPassado = false, minData = null, nomeCampo = 'Data e horário' } = {}
) {
  const analise = analisarDataHora(valor)
  if (!analise.valido) {
    return { valido: false, erro: analise.erro }
  }

  const dataAlvo = analise.dataObj
  const agora = new Date()

  // Tolerância de 1 minuto para evitar que a data expire enquanto o usuário finaliza o preenchimento
  const agoraComTolerancia = new Date(agora.getTime() - 60000)

  if (!permitirPassado && dataAlvo < agoraComTolerancia) {
    return {
      valido: false,
      erro: `${nomeCampo} não pode ser no passado. Informe um momento futuro.`,
    }
  }

  if (minData) {
    const analiseMin =
      minData instanceof Date ? { valido: true, dataObj: minData } : analisarDataHora(minData)

    if (analiseMin.valido && analiseMin.dataObj) {
      if (dataAlvo <= analiseMin.dataObj) {
        return {
          valido: false,
          erro: `${nomeCampo} deve ser estritamente posterior à data de início.`,
        }
      }
    }
  }

  return { valido: true, erro: null }
}

/**
 * Retorna a data e hora atual no formato exato aceito por inputs locais (YYYY-MM-DDTHH:mm).
 * @param {Date} [data=new Date()]
 * @returns {string}
 */
export function formatarParaInputLocal(data = new Date()) {
  const d = data instanceof Date ? data : new Date(data)
  if (Number.isNaN(d.getTime())) return ''
  const ano = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  const hora = String(d.getHours()).padStart(2, '0')
  const minuto = String(d.getMinutes()).padStart(2, '0')
  return `${ano}-${mes}-${dia}T${hora}:${minuto}`
}
