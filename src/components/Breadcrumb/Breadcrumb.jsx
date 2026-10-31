import './Breadcrumb.css'

function Breadcrumb({ items, className = '' }) {
  if (!items || items.length === 0) return null

  return (
    <nav
      className={`breadcrumb ${className}`}
      aria-label="Navegação estrutural"
    >
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="breadcrumb__item">
              {isLast ? (
                <span className="breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  {item.to ? (
                    <a href={item.to} className="breadcrumb__link">
                      {item.label}
                    </a>
                  ) : item.onClick ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="breadcrumb__button"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="breadcrumb__text">{item.label}</span>
                  )}
                  <span className="breadcrumb__separator" aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
