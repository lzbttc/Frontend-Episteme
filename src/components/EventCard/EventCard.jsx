import DateTile from '../DateTile/DateTile'
import { ClockIcon, MapPinIcon } from '../icons'
import './EventCard.css'

/**
 * Card para exibição de eventos acadêmicos e avaliações.
 *
 * @param {Object} props
 * @param {Object} props.event - Dados do evento
 */
function EventCard({ event }) {
  const { dateDay, dateMonth, title, topic, time, location } = event

  return (
    <div className="event-card">
      <DateTile day={dateDay} month={dateMonth} variant="strong" size="lg" />

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
