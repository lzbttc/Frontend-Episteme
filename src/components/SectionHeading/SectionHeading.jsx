import { ArrowRightIcon } from '../icons'
import './SectionHeading.css'

/**
 * Cabeçalho padronizado de seções com suporte a ícone, título hierárquico (h1 ou h2),
 * subtítulo e ação opcional (botão com seta ou elemento customizado).
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.title - Título da seção
 * @param {import('react').ReactNode} [props.subtitle] - Subtítulo explicativo
 * @param {import('react').ReactNode} [props.icon] - Ícone opcional exibido ao lado do título
 * @param {string} [props.actionLabel] - Texto do botão de ação com seta
 * @param {Function} [props.onAction] - Callback do botão de ação
 * @param {import('react').ReactNode} [props.action] - Elemento de ação customizado
 * @param {'h1' | 'h2' | 'h3'} [props.as='h2'] - Nível hierárquico do cabeçalho
 * @param {string} [props.className=''] - Classes CSS adicionais
 */
function SectionHeading({
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
  action,
  as: HeadingTag = 'h2',
  className = '',
  ...rest
}) {
  return (
    <header className={`section-heading ${className}`.trim()} {...rest}>
      <div className="section-heading__main">
        {icon && (
          <div className="section-heading__icon" aria-hidden="true">
            {icon}
          </div>
        )}
        <div className="section-heading__text">
          <HeadingTag className="section-heading__title">{title}</HeadingTag>

          {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
        </div>
      </div>

      {action ? (
        <div className="section-heading__custom-action">{action}</div>
      ) : actionLabel ? (
        <button
          type="button"
          className="section-heading__action"
          onClick={onAction}
        >
          <span>{actionLabel}</span>
          <ArrowRightIcon size={11} />
        </button>
      ) : null}
    </header>
  )
}

export default SectionHeading
