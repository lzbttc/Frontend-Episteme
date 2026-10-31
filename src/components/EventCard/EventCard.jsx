import { ClockIcon, MapPinIcon } from '../icons'
import './EventCard.css'

function EventCard({ event }) {
  const { dateDay, dateMonth, title, topic, time, location } = event

  return (
    <div className="event-card">
      <div className="event-card__date">
        <span className="event-card__day">{dateDay}</span>
        <span className="event-card__month">{dateMonth}</span>
      </div>

      <div className="event-card__content">
        <h4 className="event-card__title">{title}</h4>
        <p className="event-card__topic">{topic}</p>
        <div className="event-card__meta">
          <span className="event-card__time">
            <ClockIcon size={14} />
            {time}
          </span>
          <span className="event-card__bullet">•</span>
          <span className="event-card__location">
            <MapPinIcon size={14} />
            {location}
          </span>
        </div>
      </div>

      <div className="event-card__action">
        <button type="button" className="event-card__btn-dark">
          Ver detalhes
        </button>
      </div>
    </div>
  )
}

export default EventCard
