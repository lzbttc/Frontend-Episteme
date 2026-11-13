/**
 * Valida CPF pelos dígitos verificadores.
 *
 * @param {string} cpf - CPF (pode conter pontuação)
 * @returns {boolean}
 */
export function validarCpf(cpf) {
  const soDigitos = String(cpf).replace(/\D/g, '')
  if (soDigitos.length !== 11) return false
  if (/^(\d)\1{10}$/.test(soDigitos)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(soDigitos[i]) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(soDigitos[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(soDigitos[i]) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  return resto === parseInt(soDigitos[10])
}

/**
 * Formata CPF para o padrão xxx.xxx.xxx-xx.
 *
 * @param {string} cpf - CPF (pode conter pontuação)
 * @returns {string}
 */
export function formatarCpf(cpf) {
  const soDigitos = String(cpf).replace(/\D/g, '').slice(0, 11)
  return soDigitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/**
 * Aplica máscara de CPF enquanto o usuário digita.
 *
 * @param {string} valor - Valor digitado
 * @returns {string} Valor mascarado
 */
export function mascaraCpf(valor) {
  return formatarCpf(valor)
}

/**
 * Aplica máscara de telefone brasileiro enquanto o usuário digita.
 * Aceita formato (DD) NNNNN-NNNN ou (DD) NNNN-NNNN.
 *
 * @param {string} valor - Valor digitado
 * @returns {string} Valor mascarado
 */
export function mascaraTelefone(valor) {
  const soDigitos = String(valor).replace(/\D/g, '').slice(0, 11)

  if (soDigitos.length <= 2) {
    return soDigitos.length ? `(${soDigitos}` : ''
  }
  if (soDigitos.length <= 6) {
    return `(${soDigitos.slice(0, 2)}) ${soDigitos.slice(2)}`
  }
  if (soDigitos.length <= 10) {
    return `(${soDigitos.slice(0, 2)}) ${soDigitos.slice(2, 6)}-${soDigitos.slice(6)}`
  }
  return `(${soDigitos.slice(0, 2)}) ${soDigitos.slice(2, 7)}-${soDigitos.slice(7)}`
}

/**
 * Normaliza telefone para o formato +55DDNNNNNNNNN.
 *
 * @param {string} telefone - Telefone (pode conter formatação)
 * @returns {string}
 */
export function normalizarTelefone(telefone) {
  const soDigitos = String(telefone).replace(/\D/g, '')
  if (!soDigitos) return ''
  if (soDigitos.startsWith('55') && soDigitos.length >= 12) {
    return `+${soDigitos}`
  }
  return `+55${soDigitos}`
}

/**
 * Valida se o telefone tem entre 10 e 11 dígitos (sem o código de país).
 *
 * @param {string} telefone - Telefone (pode conter formatação)
 * @returns {boolean}
 */
export function validarTelefone(telefone) {
  const soDigitos = String(telefone).replace(/\D/g, '')
  return soDigitos.length >= 10 && soDigitos.length <= 11
}
