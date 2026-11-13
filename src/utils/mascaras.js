/**
 * Utilitários de máscara e validação para CPF e telefone.
 */

// ─── CPF ───────────────────────────────────────────────────────────────────

/**
 * Aplica máscara de CPF: xxx.xxx.xxx-xx
 * @param {string} valor - Apenas dígitos ou texto com máscara
 * @returns {string}
 */
export function mascaraCpf(valor) {
  const digits = valor.replace(/\D/g, '').slice(0, 11)
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
export function validarCpf(cpf) {
  const digits = cpf.replace(/\D/g, '')
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
 * Aplica máscara de telefone no padrão brasileiro:
 * +55 (DD) NNNNN-NNNN  (celular)
 * +55 (DD) NNNN-NNNN   (fixo)
 *
 * Aceita entrada já com ou sem código de país.
 * @param {string} valor
 * @returns {string}
 */
export function mascaraTelefone(valor) {
  // Remove tudo exceto dígitos
  let digits = valor.replace(/\D/g, '')

  // Remove o "55" do início se já veio normalizado com código do país
  if (digits.startsWith('55') && digits.length > 11) {
    digits = digits.slice(2)
  }

  digits = digits.slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `+55 (${digits}`
  if (digits.length <= 6)
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10)
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Normaliza telefone para o formato de envio à API: +55DDNNNNNNNNN
 * @param {string} valor - Com máscara ou dígitos
 * @returns {string}
 */
export function normalizarTelefone(valor) {
  const digits = valor.replace(/\D/g, '')
  if (digits.startsWith('55')) return `+${digits}`
  return `+55${digits}`
}

/**
 * Valida se o telefone tem entre 10 e 11 dígitos (DDD + número).
 * @param {string} valor - Com ou sem máscara
 * @returns {boolean}
 */
export function validarTelefone(valor) {
  const digits = valor.replace(/\D/g, '').replace(/^55/, '')
  return digits.length >= 10 && digits.length <= 11
}
