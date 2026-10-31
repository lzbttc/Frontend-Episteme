import './ResourceItem.css'
import {
  CalendarDaysIcon,
  ChevronRightSmallIcon,
  CodeIcon,
  DocumentIcon,
  ExternalLinkIcon,
} from '../icons'

function ResourceItem({ resource, onAction }) {
  return (
    <article className="resource-item">
      <span className="resource-item__icon">
        {resource.type === 'document' && <DocumentIcon size={17} />}
        {resource.type === 'link' && <CodeIcon size={15} />}
        {resource.type === 'calendar' && <CalendarDaysIcon size={15} />}
      </span>

      <div className="resource-item__content">
        <h3 className="resource-item__title">{resource.title}</h3>
        <p className="resource-item__description">{resource.description}</p>
      </div>

      <button
        type="button"
        className="resource-item__action"
        aria-label={`Abrir ${resource.title}`}
        onClick={() => onAction(resource)}
      >
        {resource.type === 'link' ? (
          <ExternalLinkIcon size={13} />
        ) : (
          <ChevronRightSmallIcon size={8} />
        )}
      </button>
    </article>
  )
}

export default ResourceItem
