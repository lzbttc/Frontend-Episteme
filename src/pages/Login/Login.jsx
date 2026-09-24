import { useState } from 'react'

import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'

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
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9.12083 14.6667C9.44167 14.6667 9.71285 14.5559 9.93437 14.3344C10.1559 14.1128 10.2667 13.8417 10.2667 13.5208C10.2667 13.2 10.1559 12.9288 9.93437 12.7073C9.71285 12.4858 9.44167 12.375 9.12083 12.375C8.8 12.375 8.52882 12.4858 8.30729 12.7073C8.08576 12.9288 7.975 13.2 7.975 13.5208C7.975 13.8417 8.08576 14.1128 8.30729 14.3344C8.52882 14.5559 8.8 14.6667 9.12083 14.6667ZM8.29583 11.1375H9.99167C9.99167 10.6333 10.049 10.2361 10.1635 9.94583C10.2781 9.65556 10.6028 9.25833 11.1375 8.75417C11.5347 8.35694 11.8479 7.97882 12.0771 7.61979C12.3063 7.26076 12.4208 6.82917 12.4208 6.325C12.4208 5.46944 12.1076 4.8125 11.4812 4.35417C10.8549 3.89583 10.1139 3.66667 9.25833 3.66667C8.3875 3.66667 7.6809 3.89583 7.13854 4.35417C6.59618 4.8125 6.21806 5.3625 6.00417 6.00417L7.51667 6.6C7.59306 6.325 7.76493 6.02708 8.03229 5.70625C8.29965 5.38542 8.70833 5.225 9.25833 5.225C9.74722 5.225 10.1139 5.35868 10.3583 5.62604C10.6028 5.8934 10.725 6.1875 10.725 6.50833C10.725 6.81389 10.6333 7.10035 10.45 7.36771C10.2667 7.63507 10.0375 7.88333 9.7625 8.1125C9.09028 8.70833 8.67778 9.15903 8.525 9.46458C8.37222 9.77014 8.29583 10.3278 8.29583 11.1375ZM9.16667 18.3333C7.89861 18.3333 6.70694 18.0927 5.59167 17.6115C4.47639 17.1302 3.50625 16.4771 2.68125 15.6521C1.85625 14.8271 1.20312 13.8569 0.721875 12.7417C0.240625 11.6264 0 10.4347 0 9.16667C0 7.89861 0.240625 6.70694 0.721875 5.59167C1.20312 4.47639 1.85625 3.50625 2.68125 2.68125C3.50625 1.85625 4.47639 1.20312 5.59167 0.721875C6.70694 0.240625 7.89861 0 9.16667 0C10.4347 0 11.6264 0.240625 12.7417 0.721875C13.8569 1.20312 14.8271 1.85625 15.6521 2.68125C16.4771 3.50625 17.1302 4.47625 17.6115 5.59167C18.0927 6.70694 18.3333 7.89861 18.3333 9.16667C18.3333 10.4347 18.0927 11.6264 17.6115 12.7417C17.1302 13.8569 16.4771 14.8271 15.6521 15.6521C14.8271 16.4771 14.8271 17.1302 12.7417 17.6115C11.6264 18.0927 10.4347 18.3333 9.16667 18.3333ZM9.16667 16.5C11.2139 16.5 12.9479 15.7896 14.3687 14.3687C15.7896 12.9479 16.5 11.2139 16.5 9.16667C16.5 7.11944 15.7896 5.38542 14.3687 3.96458C12.9479 2.54375 11.2139 1.83333 9.16667 1.83333C7.11944 1.83333 5.38542 2.54375 3.96458 3.96458C2.54375 5.38542 1.83333 7.11944 1.83333 9.16667C1.83333 11.2139 2.54375 12.9479 3.96458 14.3687C5.38542 15.7896 7.11944 16.5 9.16667 16.5Z"
                fill="#71717A"
              />
            </svg>
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
                  <svg
                    className="login-input-icon"
                    width="14"
                    height="17"
                    viewBox="0 0 14 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M10.0002 4.16668C10.0002 6.00639 8.50655 7.50001 6.66683 7.50001C4.82711 7.50001 3.3335 6.00639 3.3335 4.16668C3.3335 2.32696 4.82711 0.833344 6.66683 0.833344C8.50655 0.833344 10.0002 2.32696 10.0002 4.16668V4.16668M6.66683 10C3.44732 10 0.833496 12.6138 0.833496 15.8333H12.5002C12.5002 12.6138 9.88633 10 6.66683 10V10"
                      stroke="#71717A"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <Input
                    id="matricula"
                    name="matricula"
                    type="text"
                    placeholder="Matrícula"
                    autoComplete="username"
                    onChange={handleMatriculaChange}
                  />
                </div>

                {errors.matricula && (
                  <span className="login-field-error">{errors.matricula}</span>
                )}
              </div>

              <div className="login-form-field">
                <label htmlFor="senha">SENHA</label>

                <div
                  className={`login-input-wrapper ${
                    errors.senha ? 'has-error' : ''
                  }`}
                >
                  <svg
                    className="login-input-icon login-lock-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M18.3335 5.83333C18.3335 3.99362 16.8399 2.5 15.0002 2.5C13.1604 2.5 11.6668 3.99362 11.6668 5.83333V9.16667M5.00016 17.5H15.0002C15.9206 17.5 16.6668 16.7538 16.6668 15.8333V10.8333C16.6668 9.91286 15.9206 9.16667 15.0002 9.16667H5.00016C4.07969 9.16667 3.3335 9.91286 3.3335 10.8333V15.8333C3.3335 16.7538 4.07969 17.5 5.00016 17.5Z"
                      stroke="#71717A"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <Input
                    id="senha"
                    name="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    onChange={handleSenhaChange}
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M12.5 10C12.5 11.3798 11.3798 12.5 10 12.5C8.62021 12.5 7.5 11.3798 7.5 10C7.5 8.62021 8.62021 7.5 10 7.5C11.3798 7.5 12.5 8.62021 12.5 10V10"
                          stroke="#71717A"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.04834 10C3.11001 6.61919 6.26917 4.16669 10 4.16669C13.7317 4.16669 16.89 6.61919 17.9517 10C16.89 13.3809 13.7317 15.8334 10 15.8334C6.26917 15.8334 3.11001 13.3809 2.04834 10V10"
                          stroke="#71717A"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="15"
                        viewBox="0 0 18 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M11.2852 7.87546C11.2852 9.25525 10.165 10.3755 8.78522 10.3755C7.40543 10.3755 6.28522 9.25525 6.28522 7.87546C6.28522 6.49567 7.40543 5.37546 8.78522 5.37546C10.165 5.37546 11.2852 6.49567 11.2852 7.87546V7.87546"
                          stroke="#71717A"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M0.833557 7.87546C1.89522 4.49463 5.05439 2.04213 8.78522 2.04213C12.5169 2.04213 15.6752 4.49463 16.7369 7.87546C15.6752 11.2563 12.5169 13.7088 8.78522 13.7088C5.05439 13.7088 1.89522 11.2563 0.833557 7.87546V7.87546"
                          stroke="#71717A"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="1.68521"
                          y1="13.797"
                          x2="14.6488"
                          y2="0.833328"
                          stroke="#71717A"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {errors.senha && (
                  <span className="login-field-error">{errors.senha}</span>
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
