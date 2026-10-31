import './Button.css'

function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
