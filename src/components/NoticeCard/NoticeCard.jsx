import './NoticeCard.css'

function NoticeCard({ notice }) {
  return (
    <article className="notice-card">
      <header className="notice-card__header">
        <span className="notice-card__author">{notice.author}</span>
        <time className="notice-card__date">{notice.date}</time>
      </header>

      <h3 className="notice-card__title">{notice.title}</h3>
      <p className="notice-card__message">{notice.message}</p>
    </article>
  )
}

export default NoticeCard