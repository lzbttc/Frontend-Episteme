import DateTile from '../DateTile/DateTile'
import { ChevronRightIcon } from '../icons'
import './NewsCard.css'

/**
 * Card para exibição de comunicados e notícias acadêmicas.
 *
 * @param {Object} props
 * @param {Object} props.news - Dados da notícia
 * @param {Function} [props.onVisualizar] - Callback ao clicar para ler a notícia
 */
function NewsCard({ news, onVisualizar }) {
  const { dateDay, dateMonth, title, summary } = news

  return (
    <article
      className="news-card"
      onClick={() => onVisualizar?.(news)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onVisualizar?.(news)
        }
      }}
      aria-label={`Ler notícia completa: ${title}`}
    >
      <DateTile day={dateDay} month={dateMonth} variant="soft" size="sm" />

      <div className="news-card__content">
        <h4 className="news-card__title">{title}</h4>
        <p className="news-card__summary">{summary}</p>
      </div>

      <button
        type="button"
        className="news-card__arrow-btn"
        onClick={(e) => {
          e.stopPropagation()
          onVisualizar?.(news)
        }}
        aria-label={`Ler notícia completa: ${title}`}
      >
        <ChevronRightIcon size={16} />
      </button>
    </article>
  )
}

export default NewsCard
