import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import { PATHS } from '../../routes/paths'
import { sessaoFoiExpirada } from '../../services/apiClient'

import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import {
  EyeIcon,
  EyeOffIcon,
  HelpCircleFilledIcon,
  LockIcon,
  UserOutlineIcon,
} from '../../components/icons'

import './Login.css'

const REMEMBER_USER_KEY = 'episteme_lembrar_usuario'
const MSG_SESSAO_EXPIRADA = 'Sua sessão expirou. Entre novamente.'

function Login() {
  usePageTitle('Login')
  const { token, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem(REMEMBER_USER_KEY) || ''
    } catch {
      return ''
    }
  })
  const [senha, setSenha] = useState('')
  const [lembrarUsuario, setLembrarUsuario] = useState(() => {
    try {
      return Boolean(localStorage.getItem(REMEMBER_USER_KEY))
    } catch {
      return false
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState(() =>
    sessaoFoiExpirada() ? MSG_SESSAO_EXPIRADA : ''
  )

  const [errors, setErrors] = useState({
    email: '',
    senha: '',
  })

  const destino = location.state?.from?.pathname || PATHS.inicio

  if (token) {
    return <Navigate to={destino} replace />
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    if (type === 'checkbox') {
      setLembrarUsuario(checked)
      return
    }

    if (name === 'email') {
      setEmail(value)
    } else if (name === 'senha') {
      setSenha(value)
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }

    if (generalError) {
      setGeneralError('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const trimmedSenha = senha.trim()

    const newErrors = {
      email: !trimmedEmail ? 'Preencha este campo.' : '',
      senha: !trimmedSenha ? 'Preencha este campo.' : '',
    }

    setErrors(newErrors)
    setGeneralError('')

    if (newErrors.email || newErrors.senha) {
      return
    }

    setLoading(true)

    try {
      await login({ email: trimmedEmail, senha: trimmedSenha })

      try {
        if (lembrarUsuario) {
          localStorage.setItem(REMEMBER_USER_KEY, trimmedEmail)
        } else {
          localStorage.removeItem(REMEMBER_USER_KEY)
        }
      } catch {
        // Ignora erros de localStorage caso desabilitado pelo navegador
      }

      navigate(destino, { replace: true })
    } catch (err) {
      setGeneralError(err.message || 'Falha ao autenticar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login">
      <section className="login-brand-panel">
        <p className="login-campus-title">
          PORTAL ACADÊMICO OFICIAL - CAMPUS UNIVERSITÁRIO
        </p>

        <div className="login-brand-center">
          <img
            className="login-brand-logo"
            src="/favicon.svg"
            alt=""
            aria-hidden="true"
          />

          <div className="login-brand-name">
            <strong>Episteme</strong>
            <span>SISTEMA ACADÊMICO</span>
          </div>
        </div>

        <div className="login-brand-footer">
          <span>Ambiente Acadêmico Seguro</span>
        </div>
      </section>

      <section className="login-content">
        <header className="login-content-header">
          <div className="login-header-brand">
            <img
              className="login-header-brand-icon"
              src="/favicon.svg"
              alt=""
              aria-hidden="true"
            />

            <div className="login-header-brand-text">
              <span className="login-header-brand-name">Episteme</span>
              <span className="login-header-brand-subtitle">
                SISTEMA ACADÊMICO
              </span>
            </div>
          </div>

          <Link
            to={PATHS.emBreve}
            className="login-help-button"
            aria-label="Ajuda"
          >
            <HelpCircleFilledIcon size={19} />
          </Link>
        </header>

        <div className="login-header-divider" />

        <div className="login-content-main">
          <section className="login-form-section">
            <div className="login-form-heading">
              <h1>Acesse o Portal Acadêmico</h1>

              <p>
                Informe suas credenciais para gerenciar suas atividades
                acadêmicas e serviços institucionais.
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {generalError && (
                <div className="login-general-error" role="alert">
                  {generalError}
                </div>
              )}

              <div className="login-form-field">
                <label htmlFor="email">MATRÍCULA</label>

                <div
                  className={`login-input-wrapper ${
                    errors.email ? 'has-error' : ''
                  }`}
                >
                  <UserOutlineIcon size={17} className="login-input-icon" />

                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Matrícula"
                    autoComplete="username"
                    value={email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>

                {errors.email && (
                  <span
                    id="email-error"
                    className="login-field-error"
                    role="alert"
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="login-form-field">
                <label htmlFor="senha">SENHA</label>

                <div
                  className={`login-input-wrapper ${
                    errors.senha ? 'has-error' : ''
                  }`}
                >
                  <LockIcon
                    size={20}
                    className="login-input-icon login-lock-icon"
                  />

                  <Input
                    id="senha"
                    name="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    value={senha}
                    onChange={handleChange}
                    error={errors.senha}
                  />

                  <button
                    className="login-password-toggle"
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </button>
                </div>

                {errors.senha && (
                  <span
                    id="senha-error"
                    className="login-field-error"
                    role="alert"
                  >
                    {errors.senha}
                  </span>
                )}
              </div>

              <div className="login-form-options">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    name="lembrarUsuario"
                    checked={lembrarUsuario}
                    onChange={handleChange}
                  />

                  <span className="login-checkbox" aria-hidden="true">
                    <span className="login-checkbox-mark">✓</span>
                  </span>

                  <span>Lembrar meu usuário</span>
                </label>

                <Link to={PATHS.emBreve}>Esqueceu a senha?</Link>
              </div>

              <Button type="submit" variant="dark" disabled={loading}>
                {loading ? 'Entrando...' : 'Acessar o Portal'}
              </Button>
            </form>
          </section>
        </div>

        <div className="login-footer-divider" />

        <footer className="login-footer">
          <nav className="login-footer-links" aria-label="Links institucionais">
            <div className="login-footer-links-row">
              <Link to={PATHS.emBreve}>Termos de Uso</Link>
              <Link to={PATHS.emBreve}>Privacidade</Link>
            </div>

            <Link to={PATHS.emBreve}>Ajuda e Suporte</Link>
          </nav>

          <div className="login-footer-info">
            <div className="login-footer-info-row">
              <span>Epis</span>
              <span aria-hidden="true">•</span>
              <span>1.0.0</span>
              <span aria-hidden="true">•</span>
            </div>

            <span>Campus Universitário</span>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default Login
