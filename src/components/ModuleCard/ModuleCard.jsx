
import { useState } from 'react'
import Button from '../Button/Button'
import './ModuleCard.css'

function ModuleCard({ module, onMaterialAction, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <article
      className={`module-card ${
        isExpanded ? 'module-card--expanded' : 'module-card--collapsed'
      }`}
    >
      <header className="module-card__header">
        <div className="module-card__heading">
          {module.status === 'Concluído' && (
            <svg
              className="module-card__complete-icon"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Concluído"
              role="img"
            >
              <path
                d="M7.16667 12.1667L13.0417 6.29167L11.875 5.125L7.16667 9.83333L4.79167 7.45833L3.625 8.625L7.16667 12.1667ZM8.33333 16.6667C7.18056 16.6667 6.09722 16.4479 5.08333 16.0104C4.06944 15.5729 3.1875 14.9792 2.4375 14.2292C1.6875 13.4792 1.09375 12.5972 0.65625 11.5833C0.21875 10.5694 0 9.48611 0 8.33333C0 7.18056 0.21875 6.09722 0.65625 5.08333C1.09375 4.06944 1.6875 3.1875 2.4375 2.4375C3.1875 1.6875 4.06944 1.09375 5.08333 0.65625C6.09722 0.21875 7.18056 0 8.33333 0C9.48611 0 10.5694 0.21875 11.5833 0.65625C12.5972 1.09375 13.4792 1.6875 14.2292 2.4375C14.9792 3.1875 15.5729 4.06944 16.0104 5.08333C16.4479 6.09722 16.6667 7.18056 16.6667 8.33333C16.6667 9.48611 16.4479 10.5694 16.0104 11.5833C15.5729 12.5972 14.9792 13.4792 14.2292 14.2292C13.4792 14.9792 12.5972 15.5729 11.5833 16.0104C10.5694 16.4479 9.48611 16.6667 8.33333 16.6667ZM8.33333 15C10.1944 15 11.7708 14.3542 13.0625 13.0625C14.3542 11.7708 15 10.1944 15 8.33333C15 6.47222 14.3542 4.89583 13.0625 3.60417C11.7708 2.3125 10.1944 1.66667 8.33333 1.66667C6.47222 1.66667 4.89583 2.3125 3.60417 3.60417C2.3125 4.89583 1.66667 6.47222 1.66667 8.33333C1.66667 10.1944 2.3125 11.7708 3.60417 13.0625C4.89583 14.3542 6.47222 15 8.33333 15Z"
                fill="#3B82F6"
                stroke="none"
              />
            </svg>
          )}

          <div className="module-card__heading-content">
            <h3 className="module-card__title">{module.title}</h3>

            {module.description && (
              <p className="module-card__description">
                {module.description}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          className="module-card__toggle"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? `Recolher ${module.title}`
              : `Expandir ${module.title}`
          }
        >
          <svg
            className="module-card__chevron"
            width="10"
            height="7"
            viewBox="0 0 10 7"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 6.16667L0 1.16667L1.16667 0L5 3.83333L8.83333 0L10 1.16667L5 6.16667V6.16667"
              fill="#71717A"
            />
          </svg>
        </button>
      </header>

      {isExpanded && (
        <div className="module-card__items">
          {module.items.map((item) => (
            <div className="module-card__item" key={item.id}>
              <div className="module-card__item-content">
                <h4 className="module-card__item-title">
                  {item.title}
                </h4>

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
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H7.5V1.66667H1.66667V13.3333H13.3333V7.5H15V13.3333C15 13.7917 14.8368 14.184 14.5104 14.5104C14.184 14.8368 13.7917 15 13.3333 15H1.66667V15M5.58333 10.5833L4.41667 9.41667L12.1667 1.66667H9.16667V0H15V5.83333H13.3333V2.83333L5.58333 10.5833V10.5833"
                      fill="#71717A"
                    />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.66667 10L2.5 5.83333L3.66667 4.625L5.83333 6.79167V0H7.5V6.79167L9.66667 4.625L10.8333 5.83333L6.66667 10V10M1.66667 13.3333C1.20833 13.3333 0.815972 13.1701 0.489583 12.8438C0.163194 12.5174 0 12.125 0 11.6667V9.16667H1.66667V11.6667H11.6667V9.16667H13.3333V11.6667C13.3333 12.125 13.1701 12.5174 12.8438 12.8438C12.5174 13.1701 12.125 13.3333 11.6667 13.3333H1.66667V13.3333"
                      fill="#71717A"
                    />
                  </svg>
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