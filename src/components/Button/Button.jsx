import './Button.css'

function Button({
  children,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}) {
  return (
    <button
      className={`button ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button