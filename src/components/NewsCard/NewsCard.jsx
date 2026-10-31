import DateTile from '../DateTile/DateTile'
import { ChevronRightIcon } from '../icons'
import './NewsCard.css'

/**
 * Card para exibição de comunicados e notícias acadêmicas.
 *
 * @param {Object} props
 * @param {Object} props.news - Dados da notícia
 */
function NewsCard({ news }) {
  const { dateDay, dateMonth, title, summary } = news

  return (
    <article className="news-card">
      <DateTile day={dateDay} month={dateMonth} variant="soft" size="sm" />

      <div className="news-card__content">
        <h4 className="news-card__title">{title}</h4>
        <p className="news-card__summary">{summary}</p>
      </div>

      <button
        className="news-card__arrow-btn"
        aria-label="Ler notícia completa"
      >
        <ChevronRightIcon size={16} />
      </button>
    </article>
  )
}

export default NewsCard
