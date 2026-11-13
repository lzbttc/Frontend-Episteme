import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import {
  BellIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  UserIcon,
  MegaphoneIcon,
  UserOutlineIcon,
  LogoutIcon,
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const student = aluno || { name: 'Usuário', matricula: '' }
  const isGerenciamentoAtivo =
    location.pathname === PATHS.gerenciamentoNoticias

  function handleLogout() {
    setDropdownOpen(false)
    logout()
    navigate(PATHS.login, { replace: true })
  }

  function toggleDropdown() {
    setDropdownOpen((prev) => !prev)
  }

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  // Fecha o dropdown com Escape
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dropdownOpen])

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
          {/* Navegação administrativa discreta exclusiva para a Coordenação */}
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
            onClick={() => navigate(PATHS.notificacoes)}
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
            ref={dropdownRef}
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
              className={`header__profile-shortcut${dropdownOpen ? ' header__profile-shortcut--open' : ''}`}
              aria-label="Abrir menu do perfil"
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
              type="button"
              onClick={toggleDropdown}
              title="Menu da conta"
            >
              <ChevronDownIcon size={10} />
            </button>

            {dropdownOpen && (
              <div
                className="header__dropdown"
                role="menu"
                aria-label="Menu da conta"
              >
                <button
                  className="header__dropdown-item"
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false)
                    navigate(PATHS.meuPerfil)
                  }}
                >
                  <UserOutlineIcon size={17} className="header__dropdown-item-icon" />
                  <span>Meu perfil</span>
                </button>

                <div className="header__dropdown-divider" aria-hidden="true" />

                <button
                  className="header__dropdown-item header__dropdown-item--danger"
                  role="menuitem"
                  type="button"
                  onClick={handleLogout}
                >
                  <LogoutIcon size={17} className="header__dropdown-item-icon" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
