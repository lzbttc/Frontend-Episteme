import Badge from '../Badge/Badge'
import Button from '../Button/Button'
import { CalendarSolidIcon, CheckIcon } from '../icons'
import { STATUS_LABEL } from '../../constants/status'
import './ActivityCard.css'

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

/**
 * Card para exibição de atividades avaliativas, prazos e status de entrega.
 *
 * @param {Object} props
 * @param {Object} props.activity - Dados da atividade
 * @param {Function} props.onAction - Callback para a ação do botão
 */
function ActivityCard({ activity, onAction }) {
  const isComplete = activity.status === 'completed'

  const deadline = activity.dueAt ? formatDeadline(activity.dueAt) : null

  return (
    <article className="activity-card">
      <div className="activity-card__main">
        <div className="activity-card__meta">
          <span className="activity-card__category">{activity.category}</span>

          {activity.points != null && (
            <Badge
              variant="soft"
              size="sm"
              className="activity-card__points"
            >
              Valor:{' '}
              {activity.points.toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
              })}{' '}
              pts
            </Badge>
          )}
        </div>

        <h3 className="activity-card__title">{activity.title}</h3>

        {(deadline || activity.details) && (
          <p className="activity-card__description">
            <CalendarSolidIcon size={12} />
            {deadline}
            {activity.details && `${deadline ? ' • ' : ''}${activity.details}`}
          </p>
        )}
      </div>

      <div className="activity-card__actions">
        <Badge
          variant={
            activity.status === 'completed'
              ? 'primary'
              : activity.status === 'in_progress'
                ? 'dark'
                : 'dark'
          }
          className={`activity-card__status activity-card__status--${
            STATUS_MODIFIER[activity.status]
          }`}
          icon={isComplete ? <CheckIcon size={10} /> : undefined}
        >
          {STATUS_LABEL[activity.status]}
        </Badge>

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
