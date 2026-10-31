import './DateTile.css'

/**
 * Tile quadrado indicador de data (dia e mês), com variante visual "strong"
 * (#1D4ED8 / azul escuro) ou "soft" (#3B82F6 / azul primário).
 * Usado em EventCard e NewsCard.
 *
 * @param {Object} props
 * @param {string | number} props.day - Número do dia (ex.: "24", 15)
 * @param {string} props.month - Sigla ou nome do mês (ex.: "OUT", "NOV")
 * @param {'strong' | 'soft'} [props.variant='strong'] - Variante de cor de fundo
 * @param {'md' | 'lg'} [props.size='md'] - Tamanho do tile ('md' para 48px, 'lg' para 56px)
 * @param {string} [props.className=''] - Classes CSS adicionais
 */
function DateTile({
  day,
  month,
  variant = 'strong',
  size = 'md',
  className = '',
  ...rest
}) {
  return (
    <div
      className={`date-tile date-tile--${variant} date-tile--${size} ${className}`.trim()}
      aria-hidden="true"
      {...rest}
    >
      <span className="date-tile__day">{day}</span>
      <span className="date-tile__month">{month}</span>
    </div>
  )
}

export default DateTile
