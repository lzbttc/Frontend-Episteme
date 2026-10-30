import Button from '../Button/Button'
import './ActivityCard.css'

const STATUS_LABEL = {
  completed: 'Concluído',
  in_progress: 'Em andamento',
  pending: 'Pendente',
}

const STATUS_MODIFIER = {
  completed: 'complete',
  in_progress: 'progress',
  pending: 'pending',
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

// Recebe uma data ISO (com ou sem horário) e monta o texto do prazo.
// Prazo em aberto: "Prazo: 22/Set às 23:59". Prazo encerrado: "Prazo: 22/Set".
function formatDeadline(dueAt) {
  const hasTime = dueAt.includes('T')
  const date = new Date(hasTime ? dueAt : `${dueAt}T00:00:00`)

  const parts = dateFormatter.formatToParts(date)
  const day = parts.find((part) => part.type === 'day').value
  const month = parts.find((part) => part.type === 'month').value
  const shortMonth = month.replace('.', '')
  const monthLabel = `${shortMonth.charAt(0).toUpperCase()}${shortMonth.slice(1)}`

  const deadline = `Prazo: ${day}/${monthLabel}`

  const isOpen = hasTime && date.getTime() > Date.now()

  return isOpen ? `${deadline} às ${timeFormatter.format(date)}` : deadline
}

function ActivityCard({ activity, onAction }) {
  const isComplete = activity.status === 'completed'

  const deadline = activity.dueAt ? formatDeadline(activity.dueAt) : null

  return (
    <article className="activity-card">
      <div className="activity-card__main">
        <div className="activity-card__meta">
          <span className="activity-card__category">{activity.category}</span>

          {activity.points != null && (
            <span className="activity-card__points">
              Valor:{' '}
              {activity.points.toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
              })}{' '}
              pts
            </span>
          )}
        </div>

        <h3 className="activity-card__title">{activity.title}</h3>

        {(deadline || activity.details) && (
          <p className="activity-card__description">
            <svg
              width="11"
              height="12"
              viewBox="0 0 11 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6.70833 9.33333C6.3 9.33333 5.95486 9.19236 5.67292 8.91042C5.39097 8.62847 5.25 8.28333 5.25 7.875C5.25 7.46667 5.39097 7.12153 5.67292 6.83958C5.95486 6.55764 6.3 6.41667 6.70833 6.41667C7.11667 6.41667 7.46181 6.55764 7.74375 6.83958C8.02569 7.12153 8.16667 7.46667 8.16667 7.875C8.16667 8.28333 8.02569 8.62847 7.74375 8.91042C7.46181 9.19236 7.11667 9.33333 6.70833 9.33333V9.33333M1.16667 11.6667C0.845833 11.6667 0.571181 11.5524 0.342708 11.324C0.114236 11.0955 0 10.8208 0 10.5V2.33333C0 2.0125 0.114236 1.73785 0.342708 1.50937C0.571181 1.2809 0.845833 1.16667 1.16667 1.16667H1.75V0H2.91667V1.16667H7.58333V0H8.75V1.16667H9.33333C9.65417 1.16667 9.92882 1.2809 10.1573 1.50937C10.3858 1.73785 10.5 2.0125 10.5 2.33333V10.5C10.5 10.8208 10.3858 11.0955 10.1573 11.324C9.92882 11.5524 9.65417 11.6667 9.33333 11.6667H1.16667V11.6667M1.16667 10.5H9.33333V10.5V10.5V4.66667H1.16667V10.5V10.5V10.5V10.5M1.16667 3.5H9.33333V2.33333V2.33333V2.33333H1.16667V2.33333V2.33333V3.5V3.5M1.16667 3.5V2.33333V2.33333V2.33333V2.33333V2.33333V2.33333V3.5V3.5V3.5"
                fill="#71717A"
              />
            </svg>
            {deadline}
            {activity.details && `${deadline ? ' • ' : ''}${activity.details}`}
          </p>
        )}
      </div>

      <div className="activity-card__actions">
        <span
          className={`activity-card__status activity-card__status--${
            STATUS_MODIFIER[activity.status]
          }`}
        >
          {isComplete && (
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.325 7.01458L0 3.68958L0.83125 2.85833L3.325 5.35208L8.67708 0L9.50833 0.83125L3.325 7.01458Z"
                fill="white"
              />
            </svg>
          )}
          {STATUS_LABEL[activity.status]}
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAction(activity)}
        >
          {activity.action}
        </Button>
      </div>
    </article>
  )
}

export default ActivityCard
