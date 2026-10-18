import logo from '../../assets/logo.svg'
import './Header.css'

function Header({ student }) {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="header__badge-dot"></span>
          </button>

          <button className="header__icon-btn" title="Ajuda" aria-label="Ajuda">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>

          <div
            className="header__user-profile"
            role="button"
            tabIndex={0}
            title="Perfil do Usuário"
          >
            <div className="header__avatar">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="header__user-info">
              <span className="header__user-name">{student.name}</span>
              <span className="header__user-sub">{student.matricula}</span>
            </div>
            <button
              className="header__profile-shortcut"
              aria-label="Atalho do perfil"
            >
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#71717A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
