import { usePageTitle } from '../../hooks/usePageTitle'
import { PATHS } from '../../routes/paths'
import Button from '../../components/Button/Button'
import './NotFound.css'

/**
 * Página 404 padrão para rotas não encontradas.
 */
function NotFound() {
  usePageTitle('Página não encontrada')

  return (
    <div className="not-found">
      <div className="not-found__card">
        <span className="not-found__code">404</span>
        <h1 className="not-found__title">Página não encontrada</h1>
        <p className="not-found__message">
          O endereço que você tentou acessar não existe ou foi alterado.
        </p>
        <Button to={PATHS.inicio} variant="primary" size="md">
          Voltar ao Início
        </Button>
      </div>
    </div>
  )
}

export default NotFound
