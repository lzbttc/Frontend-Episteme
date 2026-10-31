import Button from '../Button/Button'
import { ClockIcon, MapPinIcon, UserIcon } from '../icons'
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
          <UserIcon size={16} />
          <span>{professor}</span>
        </div>

        <div className="discipline-card__detail-item">
          <ClockIcon size={16} />
          <span>{schedule}</span>
        </div>

        <div className="discipline-card__detail-item">
          <MapPinIcon size={16} />
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
