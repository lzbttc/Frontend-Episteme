/**
 * Retorna a saudação correspondente ao horário da data informada.
 * - Antes das 12:00: "Bom dia"
 * - Das 12:00 até 17:59 (antes das 18:00): "Boa tarde"
 * - A partir das 18:00: "Boa noite"
 *
 * @param {Date} [date=new Date()]
 * @returns {string} Saudação
 */
export function getGreeting(date = new Date()) {
  const hours = date.getHours()

  if (hours < 12) {
    return 'Bom dia'
  }
  if (hours < 18) {
    return 'Boa tarde'
  }
  return 'Boa noite'
}

export default getGreeting
