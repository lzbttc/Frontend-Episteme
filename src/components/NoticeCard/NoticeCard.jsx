import './NoticeCard.css'

/**
 * Card para exibição de avisos da disciplina ou institucionais.
 * Suporta estrutura unificada com autor ou disciplina, data/timestamp, título e mensagem/texto,
 * podendo ser renderizado estático ou como item interativo clicável.
 *
 * @param {Object} props
 * @param {Object} props.notice - Dados do aviso
 * @param {string} [props.notice.author] - Autor do aviso (ex.: "Prof. Dr. Rafael Oliveira")
 * @param {string} [props.notice.discipline] - Nome da disciplina (ex.: "Banco de Dados II")
 * @param {string} [props.notice.date] - Data de publicação do aviso
 * @param {string} [props.notice.timestamp] - Data/hora alternativa
 * @param {string} props.notice.title - Título do aviso
 * @param {string} [props.notice.message] - Conteúdo ou corpo do aviso
 * @param {string} [props.notice.description] - Descrição alternativa
 * @param {string} [props.notice.preview] - Prévia alternativa do aviso
 * @param {'soft' | 'surface'} [props.variant='soft'] - Variante visual do fundo
 * @param {Function} [props.onClick] - Callback para avisos clicáveis (abre modal)
 * @param {keyof HTMLElementTagNameMap} [props.as] - Tag semântica HTML
 * @param {string} [props.className=''] - Classes CSS adicionais
 */
function NoticeCard({
  notice,
  variant = 'soft',
  onClick,
  as,
  className = '',
  ...rest
}) {
  const {
    author,
    discipline,
    date,
    timestamp,
    title,
    message,
    description,
    preview,
  } = notice

  const sourceLabel = author || discipline
  const dateLabel = date || timestamp
  const bodyText = message || description || preview

  const isClickable = typeof onClick === 'function'
  const Component = as || (isClickable ? 'button' : 'article')
  const componentProps = isClickable
    ? { type: 'button', onClick, ...rest }
    : rest

  return (
    <Component
      className={`notice-card notice-card--${variant} ${
        isClickable ? 'notice-card--interactive' : ''
      } ${className}`.trim()}
      {...componentProps}
    >
      <header className="notice-card__header">
        {sourceLabel && (
          <span className="notice-card__source">{sourceLabel}</span>
        )}
        {dateLabel && <time className="notice-card__date">{dateLabel}</time>}
      </header>

      <h3 className="notice-card__title">{title}</h3>
      {bodyText && <p className="notice-card__message">{bodyText}</p>}
    </Component>
  )
}

export default NoticeCard
