import { ChevronRightIcon } from '../icons'
import './NewsCard.css'

function NewsCard({ news }) {
  const { dateDay, dateMonth, title, summary } = news

  return (
    <article className="news-card">
      <div className="news-card__date">
        <span className="news-card__day">{dateDay}</span>
        <span className="news-card__month">{dateMonth}</span>
      </div>

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
