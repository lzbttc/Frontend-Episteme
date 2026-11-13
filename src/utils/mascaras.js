/**
 * Utilitários de máscara e validação para CPF e telefone.
 */

// ─── CPF ───────────────────────────────────────────────────────────────────

/**
 * Aplica máscara de CPF: xxx.xxx.xxx-xx
 * @param {string} valor - Apenas dígitos ou texto com máscara
 * @returns {string}
 */
export function mascaraCpf(valor = '') {
  const digits = String(valor || '').replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

/**
 * Valida CPF pelos dígitos verificadores.
 * @param {string} cpf - Com ou sem máscara
 * @returns {boolean}
 */
export function validarCpf(cpf = '') {
  const digits = String(cpf || '').replace(/\D/g, '')
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) soma += Number(digits[i]) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== Number(digits[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += Number(digits[i]) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  return resto === Number(digits[10])
}

// ─── Telefone ──────────────────────────────────────────────────────────────

/**
 * Extrai apenas os dígitos nacionais (DDD + número), removendo DDI +55 se presente.
 * @param {string} valor
 * @returns {string} até 11 dígitos
 */
export function extrairDigitosTelefone(valor = '') {
  const str = String(valor || '').trim()

  // Remove o DDI explícito +55 ou +
  let limpo = str
  if (limpo.startsWith('+55')) {
    limpo = limpo.slice(3)
  } else if (limpo.startsWith('+')) {
    limpo = limpo.slice(1)
  }

  // Pega apenas os dígitos restantes
  let digits = limpo.replace(/\D/g, '')

  // Se ainda tiver mais de 11 dígitos e começar com 55 (ex.: usuário colou 5511987654321 sem o +)
  if (digits.length > 11 && digits.startsWith('55')) {
    digits = digits.slice(2)
  }

  return digits.slice(0, 11)
}

/**
 * Aplica máscara de telefone no padrão brasileiro com código do país:
 * +55 (DD) NNNNN-NNNN  (celular - 11 dígitos)
 * +55 (DD) NNNN-NNNN   (fixo - 10 dígitos)
 *
 * @param {string} valor
 * @returns {string}
 */
export function mascaraTelefone(valor = '') {
  const digits = extrairDigitosTelefone(valor)

  if (!digits) return ''

  if (digits.length <= 2) {
    return `+55 (${digits}`
  }

  if (digits.length <= 6) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 10) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Normaliza telefone para o formato de envio à API: +55DDNNNNNNNNN
 * @param {string} valor - Com máscara ou dígitos
 * @returns {string}
 */
export function normalizarTelefone(valor = '') {
  const digits = extrairDigitosTelefone(valor)
  return digits ? `+55${digits}` : ''
}

/**
 * Valida se o telefone possui 10 (fixo) ou 11 (celular) dígitos nacionais.
 * @param {string} valor - Com ou sem máscara
 * @returns {boolean}
 */
export function validarTelefone(valor = '') {
  if (!valor) return true
  const digits = extrairDigitosTelefone(valor)
  return digits.length === 10 || digits.length === 11
}
