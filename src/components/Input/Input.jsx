import './Input.css'

function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  name,
  id,
  required = false,
  autoComplete,
  error,
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...rest
}) {
  const errorId = id && error ? `${id}-error` : undefined
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined

  return (
    <input
      className={`input ${error ? 'input--error' : ''} ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
      id={id}
      required={required}
      autoComplete={autoComplete}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      {...rest}
    />
  )
}

export default Input
