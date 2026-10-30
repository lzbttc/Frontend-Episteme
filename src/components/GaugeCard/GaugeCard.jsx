import './GaugeCard.css'

function GaugeCard({ value, label, percentage = 85 }) {
  const radius = 50
  const stroke = 10
  const normalizedRadius = radius - stroke * 0.5
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="gauge-card">
      <div className="gauge-card__visual">
        <svg height={radius * 2} width={radius * 2} className="gauge-card__svg">
          <circle
            className="gauge-card__background"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className="gauge-card__progress"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="gauge-card__value-wrapper">
          <span className="gauge-card__value">{value}</span>
          <span className="gauge-card__label">{label}</span>
        </div>
      </div>
    </div>
  )
}

export default GaugeCard
