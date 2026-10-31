import { ArrowRightIcon } from '../icons'
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

          <ArrowRightIcon size={11} />
        </button>
      )}
    </header>
  )
}

export default SectionHeading
