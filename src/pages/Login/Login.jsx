import { useState } from 'react'

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

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState({
    matricula: '',
    senha: '',
  })

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const matricula = formData.get('matricula')?.trim()
    const senha = formData.get('senha')

    setErrors({
      matricula: !matricula ? 'Preencha este campo.' : '',
      senha: !senha ? 'Preencha este campo.' : '',
    })
  }

  function handleMatriculaChange() {
    if (errors.matricula) {
      setErrors((current) => ({
        ...current,
        matricula: '',
      }))
    }
  }

  function handleSenhaChange() {
    if (errors.senha) {
      setErrors((current) => ({
        ...current,
        senha: '',
      }))
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

          <button
            className="login-help-button"
            type="button"
            aria-label="Ajuda"
          >
            <HelpCircleFilledIcon size={19} />
          </button>
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
              <div className="login-form-field">
                <label htmlFor="matricula">USUÁRIO</label>

                <div
                  className={`login-input-wrapper ${
                    errors.matricula ? 'has-error' : ''
                  }`}
                >
                  <UserOutlineIcon size={17} className="login-input-icon" />

                  <Input
                    id="matricula"
                    name="matricula"
                    type="text"
                    placeholder="Matrícula"
                    autoComplete="username"
                    onChange={handleMatriculaChange}
                    error={errors.matricula}
                  />
                </div>

                {errors.matricula && (
                  <span
                    id="matricula-error"
                    className="login-field-error"
                    role="alert"
                  >
                    {errors.matricula}
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
                    onChange={handleSenhaChange}
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
                      <EyeIcon size={20} />
                    ) : (
                      <EyeOffIcon size={18} />
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
                  <input type="checkbox" name="lembrarUsuario" />

                  <span className="login-checkbox" aria-hidden="true">
                    <span className="login-checkbox-mark">✓</span>
                  </span>

                  <span>Lembrar meu usuário</span>
                </label>

                <a href="/recuperar-senha">Esqueceu a senha?</a>
              </div>

              <Button type="submit">Acessar o Portal</Button>
            </form>
          </section>
        </div>

        <div className="login-footer-divider" />

        <footer className="login-footer">
          <nav className="login-footer-links" aria-label="Links institucionais">
            <div className="login-footer-links-row">
              <a href="/termos-de-uso">Termos de Uso</a>
              <a href="/politica-de-privacidade">Privacidade</a>
            </div>

            <a href="/central-de-ajuda">Ajuda e Suporte</a>
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
