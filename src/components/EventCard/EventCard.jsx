import DateTile from '../DateTile/DateTile'
import Button from '../Button/Button'
import { ClockIcon, MapPinIcon } from '../icons'
import { PATHS } from '../../routes/paths'
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
        <span className="event-card__label">{title}</span>
        <h4 className="event-card__title">{topic}</h4>
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
        <Button variant="dark" size="sm" to={PATHS.emBreve}>
          Ver detalhes
        </Button>
      </div>
    </div>
  )
}

export default EventCard
