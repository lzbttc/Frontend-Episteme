import { usePageTitle } from '../../hooks/usePageTitle'
import { PATHS } from '../../routes/paths'
import Button from '../../components/Button/Button'
import './EmBreve.css'

/**
 * Página temporária para funcionalidades em desenvolvimento.
 */
function EmBreve() {
  usePageTitle('Em breve')

  return (
    <div className="em-breve">
      <div className="em-breve__card">
        <span className="em-breve__tag">Em desenvolvimento</span>
        <h1 className="em-breve__title">Recurso em Breve</h1>
        <p className="em-breve__message">
          Esta funcionalidade está sendo preparada para as próximas atualizações
          do sistema acadêmico.
        </p>
        <Button to={PATHS.inicio} variant="primary" size="md">
          Voltar ao Início
        </Button>
      </div>
    </div>
  )
}

export default EmBreve
