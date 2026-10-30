import Button from '../Button/Button'
import './DisciplineCard.css'

function DisciplineCard({ discipline, onAccess }) {
  const { code, name, professor, schedule, room, progress } = discipline

  return (
    <div className="discipline-card">
      <div className="discipline-card__header">
        <span className="discipline-card__code">{code}</span>
        <span className="discipline-card__progress-badge">
          {progress}% concluído
        </span>
      </div>

      <h3 className="discipline-card__title">{name}</h3>

      <div className="discipline-card__details">
        <div className="discipline-card__detail-item">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{professor}</span>
        </div>

        <div className="discipline-card__detail-item">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{schedule}</span>
        </div>

        <div className="discipline-card__detail-item">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{room}</span>
        </div>
      </div>

      <div className="discipline-card__progress-bar">
        <div
          className="discipline-card__progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="discipline-card__footer">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAccess && onAccess(discipline)}
        >
          Acessar Turma
        </Button>
      </div>
    </div>
  )
}

export default DisciplineCard
