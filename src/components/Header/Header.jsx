import logo from '../../assets/logo.svg'
import {
  BellIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  UserIcon,
} from '../icons'
import './Header.css'

function Header({ student, onNavigate }) {
  return (
    <header className="header">
      <div className="header__container">
        <div
          className="header__brand"
          onClick={() => onNavigate && onNavigate('inicio')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onNavigate && onNavigate('inicio')
            }
          }}
          style={{ cursor: 'pointer' }}
          title="Ir para a Página Inicial"
        >
          <img
            src={logo}
            alt="Episteme - Sistema Acadêmico"
            className="header__logo"
          />
        </div>

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
