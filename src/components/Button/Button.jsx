import { Link } from 'react-router-dom'
import './Button.css'

/**
 * Componente de botão padronizado. Suporta variantes de estilo, tamanhos e
 * renderização como <Link> do React Router quando a prop `to` é informada.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Conteúdo do botão
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'ghost-light' | 'dark'} [props.variant='primary'] - Estilo visual
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Tamanho do botão
 * @param {string} [props.to] - Rota para navegação (renderiza <Link>)
 * @param {Function} [props.onClick] - Callback de clique
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Tipo HTML do botão
 * @param {boolean} [props.disabled=false] - Estado desabilitado
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
