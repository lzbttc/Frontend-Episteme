import { useRef, useId } from 'react'
import { ChevronDownIcon } from '../icons'
import './Accordion.css'

/**
 * Componente de Acordeão acessível em conformidade com as diretrizes WAI-ARIA.
 *
 * Suporta expansão/recolhimento individual ou múltiplo, navegação por teclado (Enter, Espaço, Setas, Home, End),
 * estados de foco visíveis e atributos semânticos completos.
 *
 * @param {Object} props
 * @param {Array<{ id: string, title: import('react').ReactNode, content: import('react').ReactNode, badge?: import('react').ReactNode, highlighted?: boolean }>} props.items
 * @param {string[]} props.openIds - Lista de IDs dos itens abertos
 * @param {(id: string) => void} props.onToggle - Callback ao clicar ou alternar item
 * @param {string} [props.className]
 */
function Accordion({ items = [], openIds = [], onToggle, className = '' }) {
  const containerRef = useRef(null)
  const baseId = useId()

  function handleKeyDown(event, index) {
    const total = items.length
    if (total === 0) return

    let nextIndex

    switch (event.key) {
      case 'ArrowDown':
        nextIndex = (index + 1) % total
        break
      case 'ArrowUp':
        nextIndex = (index - 1 + total) % total
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = total - 1
        break
      default:
        return
    }

    event.preventDefault()
    const buttons = containerRef.current?.querySelectorAll(
      '.accordion__trigger'
    )
    buttons?.[nextIndex]?.focus()
  }

  return (
    <div ref={containerRef} className={`accordion ${className}`.trim()}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id)
        const headerId = `${baseId}-header-${item.id}`
        const panelId = `${baseId}-panel-${item.id}`

        return (
          <div
            key={item.id}
            className={`accordion__item ${
              isOpen ? 'accordion__item--open' : ''
            } ${item.highlighted ? 'accordion__item--highlighted' : ''}`}
          >
            <h3 className="accordion__heading">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="accordion__trigger"
                onClick={() => onToggle?.(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <span className="accordion__title-wrapper">
                  <span className="accordion__title">{item.title}</span>
                  {item.badge && (
                    <span className="accordion__badges">{item.badge}</span>
                  )}
                </span>
                <span
                  className={`accordion__icon ${
                    isOpen ? 'accordion__icon--rotated' : ''
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDownIcon size={18} />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={`accordion__panel ${
                isOpen ? 'accordion__panel--open' : ''
              }`}
            >
              <div className="accordion__content">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
