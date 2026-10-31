import './Panel.css'

/**
 * Painel de agrupamento de conteúdo em estilo "brand" (azul escuro para compromissos/avisos)
 * ou "surface" (branco com tile bege para acesso rápido e recursos).
 *
 * @param {Object} props
 * @param {'brand' | 'surface'} [props.variant='surface'] - Variante visual do painel
 * @param {import('react').ReactNode} [props.icon] - Ícone exibido no tile do cabeçalho
 * @param {import('react').ReactNode} [props.title] - Título principal do painel
 * @param {import('react').ReactNode} [props.subtitle] - Subtítulo explicativo opcional
 * @param {import('react').ReactNode} [props.action] - Ação de topo opcional (botão ou link)
 * @param {import('react').ReactNode} [props.children] - Conteúdo interno do painel
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {keyof HTMLElementTagNameMap} [props.as='section'] - Tag semântica HTML
 */
function Panel({
  variant = 'surface',
  icon,
  title,
  subtitle,
  action,
  children,
  className = '',
  as: Component = 'section',
  ...rest
}) {
  const hasHeader = icon || title || subtitle || action

  return (
    <Component
      className={`panel panel--${variant} ${className}`.trim()}
      {...rest}
    >
      {hasHeader && (
        <header className="panel__header">
          <div className="panel__title-group">
            {icon && (
              <div
                className={`panel__icon-tile panel__icon-tile--${variant}`}
                aria-hidden="true"
              >
                {icon}
              </div>
            )}
            <div className="panel__titles">
              {title && <h2 className="panel__title">{title}</h2>}
              {subtitle && <p className="panel__subtitle">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="panel__action">{action}</div>}
        </header>
      )}

      <div className="panel__content">{children}</div>
    </Component>
  )
}

export default Panel
