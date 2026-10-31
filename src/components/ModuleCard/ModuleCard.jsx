import { useState } from 'react'
import Button from '../Button/Button'
import {
  CheckCircleFilledIcon,
  ChevronDownFilledIcon,
  DownloadIcon,
  ExternalLinkIcon,
} from '../icons'
import { STATUS_LABEL } from '../../constants/status'
import './ModuleCard.css'

function ModuleCard({ module, onMaterialAction, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const filesCount = module.items.length
  const description = `${STATUS_LABEL[module.status]} • ${filesCount} ${
    filesCount === 1 ? 'arquivo disponível' : 'arquivos disponíveis'
  }`

  return (
    <article
      className={`module-card ${
        isExpanded ? 'module-card--expanded' : 'module-card--collapsed'
      }`}
    >
      <header className="module-card__header">
        <div className="module-card__heading">
          {module.status === 'completed' && (
            <CheckCircleFilledIcon
              size={17}
              className="module-card__complete-icon"
              aria-label="Concluído"
              role="img"
            />
          )}

          <div className="module-card__heading-content">
            <h3 className="module-card__title">{module.title}</h3>

            <p className="module-card__description">{description}</p>
          </div>
        </div>

        <button
          type="button"
          className="module-card__toggle"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded ? `Recolher ${module.title}` : `Expandir ${module.title}`
          }
        >
          <ChevronDownFilledIcon size={10} className="module-card__chevron" />
        </button>
      </header>

      {isExpanded && (
        <div className="module-card__items">
          {module.items.map((item) => (
            <div className="module-card__item" key={item.id}>
              <div className="module-card__item-content">
                <h4 className="module-card__item-title">{item.title}</h4>

                <p className="module-card__item-description">
                  {item.description}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="module-card__action"
                onClick={() => onMaterialAction(item)}
              >
                {item.type === 'video' ? (
                  <ExternalLinkIcon size={15} />
                ) : (
                  <DownloadIcon size={14} />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export default ModuleCard
