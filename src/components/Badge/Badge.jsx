import './Badge.css'

/**
 * Pílula/selo visual para códigos, status, etiquetas, contadores e pontos.
 * Suporta variantes "primary", "dark", "soft" e "success".
 *
 * @param {Object} props
 * @param {'primary' | 'dark' | 'soft' | 'success'} [props.variant='soft'] - Estilo visual da pílula
 * @param {'sm' | 'md'} [props.size='md'] - Tamanho da pílula
 * @param {import('react').ReactNode} [props.icon] - Ícone opcional exibido antes do texto
 * @param {import('react').ReactNode} props.children - Conteúdo textual ou elementos internos
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {keyof HTMLElementTagNameMap} [props.as='span'] - Tag HTML semântica
 */
function Badge({
  variant = 'soft',
  size = 'md',
  icon,
  children,
  className = '',
  as: Component = 'span',
  ...rest
}) {
  return (
    <Component
      className={`badge badge--${variant} badge--${size} ${className}`.trim()}
      {...rest}
    >
      {icon && (
        <span className="badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Component>
  )
}

export default Badge
