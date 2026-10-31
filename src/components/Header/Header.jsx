import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import { BellIcon, ChevronDownIcon, HelpCircleIcon, UserIcon } from '../icons'
import { PATHS } from '../../routes/paths'
import './Header.css'

/**
 * Cabeçalho principal da aplicação para as páginas internas autenticadas.
 *
 * @param {Object} props
 * @param {Object} props.student - Dados do aluno logado
 */
function Header({ student }) {
  return (
    <header className="header">
      <div className="header__container">
        <Link
          to={PATHS.inicio}
          className="header__brand"
          title="Ir para a Página Inicial"
        >
          <img
            src={logo}
            alt="Episteme - Sistema Acadêmico"
            className="header__logo"
          />
        </Link>

        <div className="header__actions">
          <button
            className="header__icon-btn"
            title="Notificações"
            aria-label="Notificações"
          >
            <BellIcon size={20} />
            <span className="header__badge-dot"></span>
          </button>

          <button className="header__icon-btn" title="Ajuda" aria-label="Ajuda">
            <HelpCircleIcon size={20} />
          </button>

          <div
            className="header__user-profile"
            role="button"
            tabIndex={0}
            title="Perfil do Usuário"
          >
            <div className="header__avatar">
              <UserIcon size={18} />
            </div>
            <div className="header__user-info">
              <span className="header__user-name">{student.name}</span>
              <span className="header__user-sub">{student.matricula}</span>
            </div>
            <button
              className="header__profile-shortcut"
              aria-label="Atalho do perfil"
            >
              <ChevronDownIcon size={10} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
