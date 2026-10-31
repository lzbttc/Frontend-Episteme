import Badge from '../Badge/Badge'
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarGridIcon,
  FileTextIcon,
  MessageSquareIcon,
  ReportCardIcon,
  SwapArrowsIcon,
  ZapIcon,
} from '../icons'
import './QuickActionCard.css'

const ICON_MAP = {
  academic: AcademicCapIcon,
  'file-text': FileTextIcon,
  message: MessageSquareIcon,
  calendar: CalendarGridIcon,
  'calendar-grid': CalendarGridIcon,
  report: ReportCardIcon,
  swap: SwapArrowsIcon,
  zap: ZapIcon,
}

/**
 * Card de ação rápida em orientação vertical (padrão, para painéis no Início)
 * ou horizontal (para listas compactas como em Minhas Disciplinas).
 *
 * @param {Object} props
 * @param {Object} props.action - Objeto com os dados da ação
 * @param {string} props.action.id - Identificador único
 * @param {string} props.action.title - Título da ação
 * @param {string} [props.action.description] - Descrição explicativa
 * @param {string} [props.action.subtitle] - Subtítulo alternativo
 * @param {string | import('react').ReactNode} [props.action.icon] - Chave do mapa ou ícone React
 * @param {string} [props.action.badge] - Selo ou indicador opcional
 * @param {'vertical' | 'horizontal'} [props.orientation='vertical'] - Orientação do layout
 * @param {Function} [props.onClick] - Callback de clique (renderiza botão)
 * @param {string} [props.href] - Link de navegação (se não houver onClick)
 * @param {string} [props.className=''] - Classes CSS adicionais
 */
function QuickActionCard({
  action,
  orientation = 'vertical',
  onClick,
  href,
  className = '',
  ...rest
}) {
  const { title, description, subtitle, icon, badge, id } = action

  const textDescription = description || subtitle

  let IconComponent = BookOpenIcon
  if (typeof icon === 'string') {
    IconComponent = ICON_MAP[icon] || BookOpenIcon
  }

  const isButton = typeof onClick === 'function'
  const Component = isButton ? 'button' : 'a'
  const componentProps = isButton
    ? { type: 'button', onClick, ...rest }
    : { href: href || `#${id}`, ...rest }

  return (
    <Component
      className={`quick-action-card quick-action-card--${orientation} ${className}`.trim()}
      {...componentProps}
    >
      <div className="quick-action-card__icon" aria-hidden="true">
        {typeof icon === 'object' && icon !== null ? (
          icon
        ) : (
          <IconComponent size={20} />
        )}
      </div>

      <div className="quick-action-card__info">
        <span className="quick-action-card__title">{title}</span>
        {textDescription && (
          <span className="quick-action-card__description">
            {textDescription}
          </span>
        )}
      </div>

      {badge && (
        <Badge variant="soft" className="quick-action-card__badge">
          {badge}
        </Badge>
      )}
    </Component>
  )
}

export default QuickActionCard
