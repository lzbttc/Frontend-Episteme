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
}) {
  return (
    <input
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
      id={id}
      required={required}
      autoComplete={autoComplete}
    />
  )
}

export default Input