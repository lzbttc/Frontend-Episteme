import { useRef } from 'react'
import './Tabs.css'

function Tabs({
  tabs,
  activeTab,
  onChange,
  className = '',
  'aria-label': ariaLabel = 'Navegação por abas',
}) {
  const tabsListRef = useRef(null)

  function handleKeyDown(event, index) {
    const totalTabs = tabs.length
    let nextIndex = null

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % totalTabs
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + totalTabs) % totalTabs
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = totalTabs - 1
    }

    if (nextIndex !== null) {
      event.preventDefault()
      const buttons = tabsListRef.current?.querySelectorAll('[role="tab"]')
      buttons?.[nextIndex]?.focus()
      onChange?.(tabs[nextIndex].id)
    }
  }

  return (
    <div
      ref={tabsListRef}
      className={`tabs ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            className={`tabs__tab ${isActive ? 'tabs__tab--active' : ''}`}
            onClick={() => onChange?.(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
