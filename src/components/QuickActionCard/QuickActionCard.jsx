import {
  AcademicCapIcon,
  BookOpenIcon,
  FileTextIcon,
  MessageSquareIcon,
} from '../icons'
import './QuickActionCard.css'

const ICON_MAP = {
  academic: AcademicCapIcon,
  'file-text': FileTextIcon,
  message: MessageSquareIcon,
}

function QuickActionCard({ action }) {
  const { title, description, icon } = action
  const IconComponent = ICON_MAP[icon] || BookOpenIcon

  return (
    <a href={`#${action.id}`} className="quick-action-card">
      <div className="quick-action-card__icon">
        <IconComponent size={20} />
      </div>
      <div className="quick-action-card__info">
        <span className="quick-action-card__title">{title}</span>
        <span className="quick-action-card__description">{description}</span>
      </div>
    </a>
  )
}

export default QuickActionCard
