import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
import Toast from '../../components/Toast/Toast'
import {
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  EditIcon,
  ChevronRightSmallIcon,
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
  let soDigitos = String(tel).replace(/\D/g, '')
  if (soDigitos.startsWith('55') && soDigitos.length >= 12) {
    soDigitos = soDigitos.slice(2)
  }
  if (soDigitos.length <= 10) {
    return soDigitos.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return soDigitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

/* ─── Campo de formulário estilizado ─────────────────────────── */
function CampoForm({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  disabled,
  placeholder,
  autoComplete,
  inputMode,
  error,
  hint,
  locked,
  children,
}) {
  return (
    <div className={`perfil-campo${error ? ' perfil-campo--erro' : ''}`}>
      <label htmlFor={id} className="perfil-campo__label">
        {label}
        {locked && (
          <span className="perfil-campo__lock" aria-label="campo bloqueado">
            <LockIcon size={12} aria-hidden="true" />
          </span>
        )}
      </label>
      <div className="perfil-campo__input-wrap">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          aria-invalid={error ? 'true' : undefined}
          className="perfil-campo__input"
        />
        {children}
      </div>
      {error && (
        <span id={`${id}-error`} className="perfil-campo__error" role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${id}-hint`} className="perfil-campo__hint">
          {hint}
        </span>
      )}
    </div>
  )
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
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  const papelUsuario = usuario?.e_admin ? 'Coordenação' : 'Aluno'

  /* ── Render principal ────────────────────────────── */
  return (
    <div className="meu-perfil">

      {/* ─── Card 1: Breadcrumb / Navbar ─── */}
      <div className="meu-perfil__nav-card">
        <nav className="meu-perfil__breadcrumb" aria-label="Localização atual">
          <span className="meu-perfil__breadcrumb-item meu-perfil__breadcrumb-item--dim">
            Portal Acadêmico
          </span>
          <ChevronRightSmallIcon size={14} className="meu-perfil__breadcrumb-sep" aria-hidden="true" />
          <span className="meu-perfil__breadcrumb-item">Meu Perfil</span>
        </nav>
        <h1 className="meu-perfil__page-title">Menu Perfil</h1>
      </div>

      {/* ─── Card 2: Hero / Avatar ─── */}
      <div className="meu-perfil__hero-card">
        {/* Avatar */}
        <div className="meu-perfil__avatar" aria-hidden="true">
          <span className="meu-perfil__avatar-initials">{iniciais}</span>
          {/* Botão de editar foto (mockado) */}
          <button
            className="meu-perfil__avatar-edit"
            type="button"
            aria-label="Alterar foto de perfil"
            title="Alterar foto (em breve)"
            tabIndex={-1}
          >
            <EditIcon size={12} aria-hidden="true" />
          </button>
        </div>

        {/* Info do usuário */}
        <div className="meu-perfil__hero-info">
          <p className="meu-perfil__hero-name">{nomeExibido}</p>
          <p className="meu-perfil__hero-email">{usuario?.email || ''}</p>
        </div>

        {/* Tags / badges */}
        <div className="meu-perfil__hero-badges">
          {usuario?.matricula && (
            <span className="meu-perfil__badge">
              Matrícula: {usuario.matricula}
            </span>
          )}
          <span className={`meu-perfil__badge ${usuario?.e_admin ? 'meu-perfil__badge--admin' : 'meu-perfil__badge--role'}`}>
            {papelUsuario}
          </span>
        </div>

        {/* Botão Editar Perfil */}
        {!emEdicao && (
          <Button
            variant="outline"
            size="sm"
            className="meu-perfil__hero-edit-btn"
            onClick={() => setEmEdicao(true)}
            type="button"
          >
            <EditIcon size={14} aria-hidden="true" />
            Editar perfil
          </Button>
        )}
      </div>

      {/* ─── Card 3: Dados Cadastrais ─── */}
      <form className="meu-perfil__form-card" onSubmit={handleSalvar} noValidate>

        {/* Cabeçalho da seção */}
        <div className="meu-perfil__section-header">
          <div className="meu-perfil__section-icon" aria-hidden="true">
            <UserIcon size={18} />
          </div>
          <div>
            <h2 className="meu-perfil__section-title">Dados cadastrais</h2>
            <p className="meu-perfil__section-subtitle">
              Informações de contato e acesso ao sistema
            </p>
          </div>
        </div>

        {/* Alerta de erro geral */}
        {erroGeral && (
          <div className="meu-perfil__alert" role="alert">
            {erroGeral}
          </div>
        )}

        {/* Linha 1: Nome | Email | CPF */}
        <div className="meu-perfil__row meu-perfil__row--3">
          <CampoForm
            id="perfil-nome"
            label="Nome completo"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            disabled={!emEdicao}
            placeholder="Nome completo"
            autoComplete="name"
            error={erros.nome}
          />
          <CampoForm
            id="perfil-email"
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={!emEdicao}
            placeholder="email@instituicao.edu.br"
            autoComplete="email"
            error={erros.email}
          />
          <CampoForm
            id="perfil-cpf"
            label="CPF"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            disabled={!emEdicao}
            placeholder="000.000.000-00"
            autoComplete="off"
            inputMode="numeric"
            error={erros.cpf}
          />
        </div>

        {/* Linha 2: Telefone | Matrícula */}
        <div className="meu-perfil__row meu-perfil__row--2-wide">
          <CampoForm
            id="perfil-telefone"
            label="Telefone"
            name="telefone"
            type="tel"
            value={form.telefone}
            onChange={handleChange}
            disabled={!emEdicao}
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            error={erros.telefone}
            hint={emEdicao ? 'Formato: +55DDNNNNNNNNN' : undefined}
          />
          <CampoForm
            id="perfil-matricula"
            label="Matrícula"
            name="matricula"
            value={usuario?.matricula || '—'}
            disabled
            placeholder="—"
            locked={!eAdmin}
          />
        </div>

        {/* Linha 3: Perfil de acesso (largura total) */}
        <div className="meu-perfil__row meu-perfil__row--1">
          <CampoForm
            id="perfil-admin"
            label="Perfil de acesso"
            name="e_admin"
            value={usuario?.e_admin ? 'Coordenação / Administrador' : 'Aluno'}
            disabled
            locked={!eAdmin}
          />
        </div>

        {/* Ações (modo edição — dados cadastrais) */}
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
          </div>
        )}
      </form>

      {/* ─── Card 4: Senha ─── */}
      {emEdicao && (
        <form
          className="meu-perfil__form-card"
          onSubmit={handleSalvar}
          noValidate
          aria-label="Alterar senha"
        >
          {/* Cabeçalho da seção */}
          <div className="meu-perfil__section-header">
            <div className="meu-perfil__section-icon" aria-hidden="true">
              <LockIcon size={18} />
            </div>
            <div>
              <h2 className="meu-perfil__section-title">Alterar senha</h2>
              <p className="meu-perfil__section-subtitle">
                Deixe em branco para manter a senha atual
              </p>
            </div>
          </div>

          {/* Linha 1: Nova senha | Confirmar senha | (vazio) */}
          <div className="meu-perfil__row meu-perfil__row--3">
            {/* Nova senha */}
            <div className={`perfil-campo${erros.senha ? ' perfil-campo--erro' : ''}`}>
              <label htmlFor="perfil-senha" className="perfil-campo__label">
                Nova senha
              </label>
              <div className="perfil-campo__input-wrap perfil-campo__input-wrap--password">
                <input
                  id="perfil-senha"
                  name="senha"
                  type={verSenha ? 'text' : 'password'}
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  aria-describedby={erros.senha ? 'perfil-senha-error' : undefined}
                  aria-invalid={erros.senha ? 'true' : undefined}
                  className="perfil-campo__input"
                />
                <button
                  type="button"
                  className="perfil-campo__eye-btn"
                  onClick={() => setVerSenha((v) => !v)}
                  aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={0}
                >
                  {verSenha ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
              {erros.senha && (
                <span id="perfil-senha-error" className="perfil-campo__error" role="alert">
                  {erros.senha}
                </span>
              )}
            </div>

            {/* Confirmar senha */}
            <div className={`perfil-campo${erros.confirmarSenha ? ' perfil-campo--erro' : ''}`}>
              <label htmlFor="perfil-confirmar" className="perfil-campo__label">
                Confirmar nova senha
              </label>
              <div className="perfil-campo__input-wrap perfil-campo__input-wrap--password">
                <input
                  id="perfil-confirmar"
                  name="confirmarSenha"
                  type={verConfirmar ? 'text' : 'password'}
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                  aria-describedby={erros.confirmarSenha ? 'perfil-confirmar-error' : undefined}
                  aria-invalid={erros.confirmarSenha ? 'true' : undefined}
                  className="perfil-campo__input"
                />
                <button
                  type="button"
                  className="perfil-campo__eye-btn"
                  onClick={() => setVerConfirmar((v) => !v)}
                  aria-label={verConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={0}
                >
                  {verConfirmar ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
              {erros.confirmarSenha && (
                <span id="perfil-confirmar-error" className="perfil-campo__error" role="alert">
                  {erros.confirmarSenha}
                </span>
              )}
            </div>

            {/* Terceiro campo: vazio (ocupa espaço no grid 3 colunas) */}
            <div className="perfil-campo" aria-hidden="true" />
          </div>

          {/* Ações finais */}
          <div className="meu-perfil__actions meu-perfil__actions--save">
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      )}

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
