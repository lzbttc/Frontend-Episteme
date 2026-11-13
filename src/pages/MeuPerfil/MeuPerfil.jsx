import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../hooks/useToast'
import { obterUsuarioLogado, atualizarUsuarioLogado } from '../../services/usuarioService'
import { ErroApi } from '../../services/apiClient'
import {
  validarCpf,
  mascaraCpf,
  mascaraTelefone,
  normalizarTelefone,
  validarTelefone,
} from '../../utils/validacoes'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Toast from '../../components/Toast/Toast'
import {
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  EditIcon,
} from '../../components/icons'
import './MeuPerfil.css'

/* ─── Dados iniciais de formulário ─────────────────────────── */
const FORM_VAZIO = {
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  senha: '',
  confirmarSenha: '',
}

const ERROS_VAZIOS = {
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  senha: '',
  confirmarSenha: '',
}

/* ─── Helpers ───────────────────────────────────────────────── */
function exibirCpf(cpf) {
  if (!cpf) return ''
  const soDigitos = String(cpf).replace(/\D/g, '')
  if (soDigitos.length !== 11) return cpf
  return soDigitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function exibirTelefone(tel) {
  if (!tel) return ''
  // Remove prefixo +55 para exibição
  let soDigitos = String(tel).replace(/\D/g, '')
  if (soDigitos.startsWith('55') && soDigitos.length >= 12) {
    soDigitos = soDigitos.slice(2)
  }
  if (soDigitos.length <= 10) {
    return soDigitos.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return soDigitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

function MeuPerfil() {
  usePageTitle('Meu Perfil')
  const { eAdmin } = useAuth()
  const { toast, showToast, clearToast } = useToast()

  /* estado do usuário vindo da API */
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')

  /* estado de edição */
  const [emEdicao, setEmEdicao] = useState(false)
  const [salvando, setSalvando] = useState(false)

  /* campos do formulário */
  const [form, setForm] = useState(FORM_VAZIO)
  const [erros, setErros] = useState(ERROS_VAZIOS)
  const [erroGeral, setErroGeral] = useState('')

  /* visibilidade de senha */
  const [verSenha, setVerSenha] = useState(false)
  const [verConfirmar, setVerConfirmar] = useState(false)

  /* ── Carregamento inicial ─────────────────────────── */
  const carregarUsuario = useCallback(async () => {
    setCarregando(true)
    setErroCarregamento('')
    try {
      const dados = await obterUsuarioLogado()
      setUsuario(dados)
      setForm({
        nome: dados.nome || '',
        email: dados.email || '',
        cpf: exibirCpf(dados.cpf || ''),
        telefone: exibirTelefone(dados.telefone || ''),
        senha: '',
        confirmarSenha: '',
      })
    } catch (err) {
      setErroCarregamento(err.message || 'Erro ao carregar perfil.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarUsuario()
  }, [carregarUsuario])

  /* ── Manipulação de campos ───────────────────────── */
  function handleChange(e) {
    const { name, value } = e.target
    let valorFormatado = value

    if (name === 'cpf') {
      valorFormatado = mascaraCpf(value)
    } else if (name === 'telefone') {
      valorFormatado = mascaraTelefone(value)
    }

    setForm((prev) => ({ ...prev, [name]: valorFormatado }))

    if (erros[name]) {
      setErros((prev) => ({ ...prev, [name]: '' }))
    }
    if (erroGeral) setErroGeral('')
  }

  /* ── Validação ───────────────────────────────────── */
  function validar() {
    const novosErros = { ...ERROS_VAZIOS }
    let valido = true

    if (!form.nome.trim()) {
      novosErros.nome = 'O nome é obrigatório.'
      valido = false
    }

    if (!form.email.trim()) {
      novosErros.email = 'O e-mail é obrigatório.'
      valido = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      novosErros.email = 'Informe um e-mail válido.'
      valido = false
    }

    if (form.cpf && !validarCpf(form.cpf)) {
      novosErros.cpf = 'CPF inválido. Verifique os dígitos.'
      valido = false
    }

    if (form.telefone && !validarTelefone(form.telefone)) {
      novosErros.telefone = 'Telefone inválido. Informe DDD + número.'
      valido = false
    }

    if (form.senha) {
      if (form.senha.length < 8) {
        novosErros.senha = 'A senha deve ter no mínimo 8 caracteres.'
        valido = false
      }
      if (form.senha !== form.confirmarSenha) {
        novosErros.confirmarSenha = 'As senhas não coincidem.'
        valido = false
      }
    }

    setErros(novosErros)
    return valido
  }

  /* ── Cancelar edição ─────────────────────────────── */
  function handleCancelar() {
    setEmEdicao(false)
    setErros(ERROS_VAZIOS)
    setErroGeral('')
    if (usuario) {
      setForm({
        nome: usuario.nome || '',
        email: usuario.email || '',
        cpf: exibirCpf(usuario.cpf || ''),
        telefone: exibirTelefone(usuario.telefone || ''),
        senha: '',
        confirmarSenha: '',
      })
    }
  }

  /* ── Salvar ──────────────────────────────────────── */
  async function handleSalvar(e) {
    e.preventDefault()
    if (!validar()) return

    setSalvando(true)
    setErroGeral('')

    const payload = {
      nome: form.nome.trim(),
      email: form.email.trim(),
    }

    const cpfSoDigitos = form.cpf.replace(/\D/g, '')
    if (cpfSoDigitos) {
      payload.cpf = cpfSoDigitos
    }

    if (form.telefone) {
      payload.telefone = normalizarTelefone(form.telefone)
    }

    if (form.senha) {
      payload.senha = form.senha
    }

    try {
      const atualizado = await atualizarUsuarioLogado(payload)
      setUsuario(atualizado)
      setForm((prev) => ({
        ...prev,
        cpf: exibirCpf(atualizado.cpf || ''),
        telefone: exibirTelefone(atualizado.telefone || ''),
        senha: '',
        confirmarSenha: '',
      }))
      setEmEdicao(false)
      showToast('Perfil atualizado com sucesso!')
    } catch (err) {
      if (err instanceof ErroApi) {
        if (err.status === 409) {
          setErroGeral('E-mail ou CPF já cadastrado em outro usuário.')
        } else if (err.status === 403) {
          setErroGeral('Você não tem permissão para alterar este campo.')
        } else {
          setErroGeral(err.message || 'Erro ao salvar. Tente novamente.')
        }
      } else {
        setErroGeral(err.message || 'Erro ao salvar. Tente novamente.')
      }
    } finally {
      setSalvando(false)
    }
  }

  /* ── Render: carregando ──────────────────────────── */
  if (carregando) {
    return (
      <div className="meu-perfil">
        <div className="meu-perfil__loading" aria-live="polite">
          <div className="meu-perfil__spinner" aria-hidden="true" />
          <p>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  /* ── Render: erro de carregamento ────────────────── */
  if (erroCarregamento) {
    return (
      <div className="meu-perfil">
        <div className="meu-perfil__error" role="alert">
          <p>{erroCarregamento}</p>
          <Button variant="outline" size="sm" onClick={carregarUsuario}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const nomeExibido = usuario?.nome || 'Usuário'
  const iniciais = nomeExibido
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  /* ── Render principal ────────────────────────────── */
  return (
    <div className="meu-perfil">
      {/* ─── Cabeçalho da página ─── */}
      <section className="meu-perfil__header-card">
        <div className="meu-perfil__avatar" aria-hidden="true">
          {iniciais || <UserIcon size={28} />}
        </div>

        <div className="meu-perfil__header-info">
          <h1 className="meu-perfil__user-name">{nomeExibido}</h1>
          <p className="meu-perfil__user-email">{usuario?.email || ''}</p>

          <div className="meu-perfil__tags">
            {usuario?.matricula && (
              <span className="meu-perfil__tag">
                Matrícula: {usuario.matricula}
              </span>
            )}
            <span
              className={`meu-perfil__tag meu-perfil__tag--role ${
                usuario?.e_admin ? 'meu-perfil__tag--admin' : ''
              }`}
            >
              {usuario?.e_admin ? 'Coordenação / Admin' : 'Aluno'}
            </span>
          </div>
        </div>

        {!emEdicao && (
          <Button
            variant="outline"
            size="sm"
            className="meu-perfil__edit-btn"
            onClick={() => setEmEdicao(true)}
          >
            <EditIcon size={15} aria-hidden="true" />
            Editar perfil
          </Button>
        )}
      </section>

      {/* ─── Formulário de dados ─── */}
      <form
        className="meu-perfil__form-card"
        onSubmit={handleSalvar}
        noValidate
      >
        <header className="meu-perfil__form-header">
          <div className="meu-perfil__form-title-group">
            <div className="meu-perfil__form-icon-tile" aria-hidden="true">
              <UserIcon size={18} />
            </div>
            <div>
              <h2 className="meu-perfil__form-title">Dados cadastrais</h2>
              <p className="meu-perfil__form-subtitle">
                Informações de contato e acesso ao sistema
              </p>
            </div>
          </div>
        </header>

        {/* Alerta de erro geral */}
        {erroGeral && (
          <div className="meu-perfil__alert meu-perfil__alert--error" role="alert">
            {erroGeral}
          </div>
        )}

        <div className="meu-perfil__fields">
          {/* Nome */}
          <div className="meu-perfil__field">
            <label htmlFor="perfil-nome" className="meu-perfil__label">
              NOME COMPLETO
            </label>
            <Input
              id="perfil-nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              disabled={!emEdicao}
              placeholder="Nome completo"
              autoComplete="name"
              error={erros.nome}
              aria-describedby={erros.nome ? 'perfil-nome-error' : undefined}
            />
            {erros.nome && (
              <span id="perfil-nome-error" className="meu-perfil__field-error" role="alert">
                {erros.nome}
              </span>
            )}
          </div>

          {/* E-mail */}
          <div className="meu-perfil__field">
            <label htmlFor="perfil-email" className="meu-perfil__label">
              E-MAIL
            </label>
            <Input
              id="perfil-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={!emEdicao}
              placeholder="email@instituicao.edu.br"
              autoComplete="email"
              error={erros.email}
              aria-describedby={erros.email ? 'perfil-email-error' : undefined}
            />
            {erros.email && (
              <span id="perfil-email-error" className="meu-perfil__field-error" role="alert">
                {erros.email}
              </span>
            )}
          </div>

          {/* CPF */}
          <div className="meu-perfil__field">
            <label htmlFor="perfil-cpf" className="meu-perfil__label">
              CPF
            </label>
            <Input
              id="perfil-cpf"
              name="cpf"
              type="text"
              value={form.cpf}
              onChange={handleChange}
              disabled={!emEdicao}
              placeholder="000.000.000-00"
              autoComplete="off"
              inputMode="numeric"
              error={erros.cpf}
              aria-describedby={erros.cpf ? 'perfil-cpf-error' : undefined}
            />
            {erros.cpf && (
              <span id="perfil-cpf-error" className="meu-perfil__field-error" role="alert">
                {erros.cpf}
              </span>
            )}
          </div>

          {/* Telefone */}
          <div className="meu-perfil__field">
            <label htmlFor="perfil-telefone" className="meu-perfil__label">
              TELEFONE
            </label>
            <Input
              id="perfil-telefone"
              name="telefone"
              type="tel"
              value={form.telefone}
              onChange={handleChange}
              disabled={!emEdicao}
              placeholder="(00) 00000-0000"
              autoComplete="tel"
              error={erros.telefone}
              aria-describedby={erros.telefone ? 'perfil-telefone-error' : undefined}
            />
            {erros.telefone && (
              <span id="perfil-telefone-error" className="meu-perfil__field-error" role="alert">
                {erros.telefone}
              </span>
            )}
            {emEdicao && (
              <span className="meu-perfil__field-hint">
                Será salvo no formato +55DDNNNNNNNNN
              </span>
            )}
          </div>

          {/* Matrícula – somente leitura para não-admin */}
          {usuario?.matricula !== undefined && (
            <div className="meu-perfil__field">
              <label htmlFor="perfil-matricula" className="meu-perfil__label">
                MATRÍCULA
                {!eAdmin && (
                  <span className="meu-perfil__field-locked" aria-label="campo bloqueado">
                    🔒
                  </span>
                )}
              </label>
              <Input
                id="perfil-matricula"
                name="matricula"
                type="text"
                value={usuario?.matricula || ''}
                disabled
                placeholder="—"
                aria-readonly="true"
              />
              {!eAdmin && emEdicao && (
                <span className="meu-perfil__field-hint">
                  Apenas administradores podem alterar a matrícula.
                </span>
              )}
            </div>
          )}

          {/* Admin – somente leitura para não-admin */}
          <div className="meu-perfil__field">
            <label htmlFor="perfil-admin" className="meu-perfil__label">
              PERFIL DE ACESSO
              {!eAdmin && (
                <span className="meu-perfil__field-locked" aria-label="campo bloqueado">
                  🔒
                </span>
              )}
            </label>
            <Input
              id="perfil-admin"
              name="e_admin"
              type="text"
              value={usuario?.e_admin ? 'Coordenação / Administrador' : 'Aluno'}
              disabled
              aria-readonly="true"
            />
            {!eAdmin && emEdicao && (
              <span className="meu-perfil__field-hint">
                Apenas administradores podem alterar o perfil de acesso.
              </span>
            )}
          </div>
        </div>

        {/* ─── Seção de senha (só em modo edição) ─── */}
        {emEdicao && (
          <div className="meu-perfil__section">
            <div className="meu-perfil__section-header">
              <div className="meu-perfil__form-icon-tile" aria-hidden="true">
                <LockIcon size={18} />
              </div>
              <div>
                <h3 className="meu-perfil__section-title">Alterar senha</h3>
                <p className="meu-perfil__form-subtitle">
                  Deixe em branco para manter a senha atual
                </p>
              </div>
            </div>

            <div className="meu-perfil__fields">
              {/* Nova senha */}
              <div className="meu-perfil__field">
                <label htmlFor="perfil-senha" className="meu-perfil__label">
                  NOVA SENHA
                </label>
                <div className="meu-perfil__password-wrapper">
                  <Input
                    id="perfil-senha"
                    name="senha"
                    type={verSenha ? 'text' : 'password'}
                    value={form.senha}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    error={erros.senha}
                    aria-describedby={erros.senha ? 'perfil-senha-error' : undefined}
                  />
                  <button
                    type="button"
                    className="meu-perfil__password-toggle"
                    onClick={() => setVerSenha((v) => !v)}
                    aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {verSenha ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {erros.senha && (
                  <span id="perfil-senha-error" className="meu-perfil__field-error" role="alert">
                    {erros.senha}
                  </span>
                )}
              </div>

              {/* Confirmar senha */}
              <div className="meu-perfil__field">
                <label htmlFor="perfil-confirmar" className="meu-perfil__label">
                  CONFIRMAR NOVA SENHA
                </label>
                <div className="meu-perfil__password-wrapper">
                  <Input
                    id="perfil-confirmar"
                    name="confirmarSenha"
                    type={verConfirmar ? 'text' : 'password'}
                    value={form.confirmarSenha}
                    onChange={handleChange}
                    placeholder="Repita a nova senha"
                    autoComplete="new-password"
                    error={erros.confirmarSenha}
                    aria-describedby={
                      erros.confirmarSenha ? 'perfil-confirmar-error' : undefined
                    }
                  />
                  <button
                    type="button"
                    className="meu-perfil__password-toggle"
                    onClick={() => setVerConfirmar((v) => !v)}
                    aria-label={verConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {verConfirmar ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {erros.confirmarSenha && (
                  <span
                    id="perfil-confirmar-error"
                    className="meu-perfil__field-error"
                    role="alert"
                  >
                    {erros.confirmarSenha}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Ações ─── */}
        {emEdicao && (
          <div className="meu-perfil__actions">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={handleCancelar}
              disabled={salvando}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        )}
      </form>

      {/* Toast de confirmação */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </div>
  )
}

export default MeuPerfil
