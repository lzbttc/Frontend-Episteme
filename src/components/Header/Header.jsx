
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import {
  BellIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  UserIcon,
  MegaphoneIcon,
} from '../icons'
import { PATHS } from '../../routes/paths'
import { useAuth } from '../../hooks/useAuth'
import './Header.css'

/**
 * Cabeçalho principal da aplicação para as páginas internas autenticadas.
 * Exibe logo, ações de ícone (notificações, ajuda) e perfil do usuário logado.
 * Quando o usuário é administrador (Coordenação), exibe atalho institucional discreto para Gerenciar Notícias.
 */
function Header() {
  const { aluno, eAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const student = aluno || { name: 'Usuário', matricula: '' }
  const isGerenciamentoAtivo =
    location.pathname === PATHS.gerenciamentoNoticias

  function handleLogout() {
    logout()
    navigate(PATHS.login, { replace: true })
  }

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
          {eAdmin && (
            <Link
              to={PATHS.gerenciamentoNoticias}
              className={`header__admin-link ${
                isGerenciamentoAtivo ? 'header__admin-link--active' : ''
              }`}
              title="Gerenciamento de Notícias da Coordenação"
              aria-current={isGerenciamentoAtivo ? 'page' : undefined}
            >
              <MegaphoneIcon size={16} aria-hidden="true" />
              <span>Gerenciar Notícias</span>
            </Link>
          )}

          <button
            className="header__icon-btn"
            title="Notificações"
            aria-label="Notificações"
            type="button"
          >
            <BellIcon size={20} />
            <span className="header__badge-dot" />
          </button>

          <Link
            to={PATHS.ajuda}
            className="header__icon-btn"
            title="Central de Ajuda"
            aria-label="Central de Ajuda"
          >
            <HelpCircleIcon size={20} />
          </Link>

          <div
            className="header__user-profile"
            role="group"
            aria-label="Menu do usuário"
          >
            <div className="header__avatar" aria-hidden="true">
              <UserIcon size={18} />
            </div>

            <div className="header__user-info">
              <span className="header__user-name">{student.name}</span>
              <span className="header__user-sub">
                {student.matricula || (eAdmin ? 'Coordenação' : '')}
              </span>
            </div>

            <button
              className="header__profile-shortcut"
              aria-label="Abrir menu do perfil"
              type="button"
              onClick={handleLogout}
              title="Sair do sistema"
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
