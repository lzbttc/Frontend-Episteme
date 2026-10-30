import './SectionHeading.css'

function SectionHeading({ title, subtitle, actionLabel, onAction }) {
  return (
    <header className="section-heading">
      <div>
        <h2 className="section-heading__title">{title}</h2>

        <p className="section-heading__subtitle">{subtitle}</p>
      </div>

      {actionLabel && (
        <button
          type="button"
          className="section-heading__action"
          onClick={onAction}
        >
          {actionLabel}

          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8.11667 6H0V4.66667H8.11667L4.38333 0.933333L5.33333 0L10.6667 5.33333L5.33333 10.6667L4.38333 9.73333L8.11667 6V6"
              fill="#090D16"
            />
          </svg>
        </button>
      )}
    </header>
  )
}

export default SectionHeading
