import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Badge from '../../components/Badge/Badge'
import Modal from '../../components/Modal/Modal'
import Toast from '../../components/Toast/Toast'
import {
  UserIcon,
  CameraIcon,
  EditIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '../../components/icons'
import { PATHS } from '../../routes/paths'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../hooks/useToast'
import { useAsyncData } from '../../hooks/useAsyncData'
import { ErroApi } from '../../services/apiClient'
import {
  obterUsuarioAtual,
  atualizarUsuario,
  obterDadosAluno,
  obterResumoAcademico,
  obterCurso,
} from '../../services/usuarioService'
import { lerUsuarioId } from '../../services/authService'
import { obterToken } from '../../services/apiClient'
import { MOCK_DADOS_ACADEMICOS } from '../../mocks/perfilData'
import {
  mascaraCpf,
  mascaraTelefone,
  normalizarTelefone,
  validarCpf,
  validarTelefone,
} from '../../utils/mascaras'
import './MeuPerfil.css'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatarDataNascimento(valor) {
  if (!valor) return '—'
  try {
    const [ano, mes, dia] = valor.split('-')
    return `${dia}/${mes}/${ano}`
  } catch {
    return valor
  }
}

function formatarTelefoneExibicao(valor) {
  if (!valor) return '—'
  const digits = valor.replace(/\D/g, '')
  const local = digits.startsWith('55') ? digits.slice(2) : digits
  if (local.length === 11)
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`
  if (local.length === 10)
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`
  return valor
}

// ─── Carregamento de dados ──────────────────────────────────────────────────

async function carregarPerfil() {
  const usuarioId = lerUsuarioId(obterToken())
  const [usuario, aluno, resumo] = await Promise.all([
    obterUsuarioAtual(),
    obterDadosAluno(usuarioId),
    obterResumoAcademico(),
  ])

  let curso = null
  if (aluno?.curso_id) {
    curso = await obterCurso(aluno.curso_id)
  }

  return { usuario, aluno, resumo, curso }
}

// ─── Componentes internos ───────────────────────────────────────────────────

function CampoInfo({ label, value, fullWidth = false }) {
  return (
    <div className={`perfil__campo ${fullWidth ? 'perfil__campo--full' : ''}`}>
      <span className="perfil__campo-label">{label}</span>
      <span className="perfil__campo-valor">{value || '—'}</span>
    </div>
  )
}

// ─── Página Principal ───────────────────────────────────────────────────────

function MeuPerfil() {
  usePageTitle('Meu Perfil')
  const { eAdmin } = useAuth()
  const { toast, showToast, clearToast } = useToast()

  const carregarDados = useCallback(carregarPerfil, [])
  const { data, loading, error, } = useAsyncData(carregarDados)

  // Estado do modal de edição
  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erroModal, setErroModal] = useState('')

  // Campos do formulário de edição
  const [form, setForm] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  })
  const [erros, setErros] = useState({})

  // Dados locais (atualizados após salvar)
  const [usuarioLocal, setUsuarioLocal] = useState(null)

  const usuario = usuarioLocal || data?.usuario
  const aluno = data?.aluno
  const resumo = data?.resumo
  const curso = data?.curso

  // Sincroniza dados locais quando carrega da API
  useEffect(() => {
    if (data?.usuario && !usuarioLocal) {
      setUsuarioLocal(data.usuario)
    }
  }, [data, usuarioLocal])

  // ── Dados derivados ──────────────────────────────────────────────────────

  const nomeExibicao = usuario?.nome || '—'
  const matriculaExibicao = aluno?.matricula_id || usuario?.matricula || '—'
  const cursoExibicao = curso?.nome || (eAdmin ? 'Coordenação Acadêmica' : '—')
  const campusExibicao = MOCK_DADOS_ACADEMICOS.campus

  const mediaGeral = resumo?.media_geral != null
    ? Number(resumo.media_geral).toLocaleString('pt-BR', { minimumFractionDigits: 1 })
    : '—'

  const percentualIntegralizacao = Math.round(
    (MOCK_DADOS_ACADEMICOS.cargaHorariaIntegralizada /
      MOCK_DADOS_ACADEMICOS.cargaHorariaTotal) *
      100
  )

  // ── Modal ────────────────────────────────────────────────────────────────

  function abrirModal() {
    setForm({
      nome: usuario?.nome || '',
      email: usuario?.email || '',
      cpf: usuario?.cpf ? mascaraCpf(usuario.cpf) : '',
      telefone: usuario?.telefone ? mascaraTelefone(usuario.telefone) : '',
      senha: '',
      confirmarSenha: '',
    })
    setErros({})
    setErroModal('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
  }

  function handleChange(campo, valor) {
    let valorFinal = valor

    if (campo === 'cpf') valorFinal = mascaraCpf(valor)
    if (campo === 'telefone') valorFinal = mascaraTelefone(valor)

    setForm((prev) => ({ ...prev, [campo]: valorFinal }))
    setErros((prev) => ({ ...prev, [campo]: '' }))
    setErroModal('')
  }

  function validarForm() {
    const novosErros = {}

    if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      novosErros.email = 'E-mail inválido.'

    if (form.cpf && !validarCpf(form.cpf))
      novosErros.cpf = 'CPF inválido.'

    if (form.telefone && !validarTelefone(form.telefone))
      novosErros.telefone = 'Telefone inválido.'

    if (form.senha && form.senha.length < 8)
      novosErros.senha = 'A senha deve ter pelo menos 8 caracteres.'

    if (form.senha && form.senha !== form.confirmarSenha)
      novosErros.confirmarSenha = 'As senhas não coincidem.'

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  async function handleSalvar() {
    if (!validarForm()) return
    setSalvando(true)
    setErroModal('')

    try {
      const usuarioId = lerUsuarioId(obterToken())
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
      }

      if (form.cpf) payload.cpf = form.cpf.replace(/\D/g, '')
      if (form.telefone) payload.telefone = normalizarTelefone(form.telefone)
      if (form.senha) payload.senha = form.senha

      const atualizado = await atualizarUsuario(usuarioId, payload)
      setUsuarioLocal(atualizado)
      fecharModal()
      showToast('Dados atualizados com sucesso!', 'success')
    } catch (err) {
      if (err instanceof ErroApi) {
        if (err.status === 409)
          setErroModal('E-mail ou CPF já está em uso por outro cadastro.')
        else if (err.status === 403)
          setErroModal('Você não tem permissão para editar estes dados.')
        else
          setErroModal(err.message || 'Não foi possível salvar as alterações.')
      } else {
        setErroModal('Não foi possível conectar ao servidor.')
      }
    } finally {
      setSalvando(false)
    }
  }

  // ── Renderização ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="meu-perfil">
        <p className="meu-perfil__loading">Carregando perfil...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="meu-perfil">
        <p className="meu-perfil__error">
          Não foi possível carregar os dados do perfil.
        </p>
      </div>
    )
  }

  return (
    <div className="meu-perfil">
      {/* ── Toast de feedback ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}

      {/* ── 1. Cabeçalho ── */}
      <section className="meu-perfil__header-card">
        <Breadcrumb
          items={[
            { label: 'Portal Acadêmico', to: PATHS.inicio },
            { label: 'Meu Perfil' },
          ]}
        />
        <div>
          <h1 className="meu-perfil__title">Meu Perfil</h1>
          <p className="meu-perfil__subtitle">
            Consulte suas informações pessoais e acadêmicas.
          </p>
        </div>
      </section>

      {/* ── 2. Cartão de identificação ── */}
      <section className="meu-perfil__identity-card">
        <div className="meu-perfil__avatar-wrap">
          <div className="meu-perfil__avatar">
            <UserIcon size={36} />
          </div>
          <button
            className="meu-perfil__avatar-camera"
            type="button"
            aria-label="Alterar foto de perfil"
            title="Alterar foto de perfil"
          >
            <CameraIcon size={14} />
          </button>
        </div>

        <div className="meu-perfil__identity-info">
          <h2 className="meu-perfil__identity-name">{nomeExibicao}</h2>
          <p className="meu-perfil__identity-matricula">
            Matrícula:{' '}
            <strong>{matriculaExibicao}</strong>
          </p>
          <p className="meu-perfil__identity-curso">
            {cursoExibicao}
            {campusExibicao && (
              <>
                <span className="meu-perfil__identity-sep"> · </span>
                {campusExibicao}
              </>
            )}
          </p>
        </div>
      </section>

      {/* ── 3. Dados Pessoais ── */}
      <section className="meu-perfil__section-card">
        <div className="meu-perfil__section-header">
          <div>
            <h2 className="meu-perfil__section-title">Dados Pessoais</h2>
            <p className="meu-perfil__section-subtitle">
              Informações pessoais e de contato do usuário.
            </p>
          </div>
        </div>

        <Button variant="dark" size="sm" onClick={abrirModal}>
          <EditIcon size={14} />
          Editar dados
        </Button>

        <div className="meu-perfil__campos-grid">
          <CampoInfo label="NOME COMPLETO" value={usuario?.nome} />
          <CampoInfo label="CPF" value={usuario?.cpf ? mascaraCpf(usuario.cpf) : '—'} />
          <CampoInfo
            label="DATA DE NASCIMENTO"
            value={formatarDataNascimento(usuario?.data_nascimento)}
          />
          <CampoInfo label="E-MAIL" value={usuario?.email} />
          <CampoInfo
            label="ADMINISTRADOR"
            value={eAdmin ? 'Sim' : 'Não'}
          />
          <CampoInfo
            label="CELULAR / TELEFONE"
            value={formatarTelefoneExibicao(usuario?.telefone)}
          />
          {usuario?.endereco && (
            <CampoInfo
              label="ENDEREÇO COMPLETO"
              value={usuario.endereco}
              fullWidth
            />
          )}
        </div>
      </section>

      {/* ── 4. Dados Acadêmicos ── */}
      <section className="meu-perfil__section-card">
        <div className="meu-perfil__section-header">
          <div>
            <h2 className="meu-perfil__section-title">Dados Acadêmicos</h2>
            <p className="meu-perfil__section-subtitle">
              Informações relacionadas à vida acadêmica do usuário.
            </p>
          </div>
        </div>

        <div className="meu-perfil__campos-grid">
          <CampoInfo label="MATRÍCULA" value={matriculaExibicao} />
          <CampoInfo label="CURSO" value={cursoExibicao} />
          {/* MOCK: turno não possui endpoint */}
          <CampoInfo label="TURNO" value={MOCK_DADOS_ACADEMICOS.turno} />
          {/* MOCK: semestre letivo não possui endpoint */}
          <CampoInfo
            label="SEMESTRE LETIVO ATUAL"
            value={MOCK_DADOS_ACADEMICOS.semestreLetivo}
          />
          {/* MOCK: situação não possui endpoint dedicado */}
          <div className="perfil__campo">
            <span className="perfil__campo-label">SITUAÇÃO</span>
            <span className="perfil__campo-valor perfil__campo-valor--status">
              <span className="meu-perfil__status-dot" />
              {MOCK_DADOS_ACADEMICOS.situacao}
            </span>
          </div>
          <CampoInfo
            label="IRA / MÉDIA GERAL"
            value={mediaGeral}
          />
        </div>

        {/* Barra de integralização — MOCK */}
        <div className="meu-perfil__integralizacao">
          <div className="meu-perfil__integralizacao-header">
            <span className="meu-perfil__integralizacao-label">
              Integralização Curricular / Carga Horária
            </span>
            <span className="meu-perfil__integralizacao-valores">
              <strong>
                {MOCK_DADOS_ACADEMICOS.cargaHorariaIntegralizada.toLocaleString('pt-BR')}h
              </strong>
              {' / '}
              {MOCK_DADOS_ACADEMICOS.cargaHorariaTotal.toLocaleString('pt-BR')}h{' '}
              <span className="meu-perfil__integralizacao-pct">
                ({percentualIntegralizacao}%)
              </span>
            </span>
          </div>
          <div
            className="meu-perfil__progress-bar"
            role="progressbar"
            aria-valuenow={percentualIntegralizacao}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Integralização curricular: ${percentualIntegralizacao}%`}
          >
            <div
              className="meu-perfil__progress-fill"
              style={{ width: `${percentualIntegralizacao}%` }}
            />
          </div>
        </div>

        {/* Badges de disciplinas — MOCK */}
        <div className="meu-perfil__disciplinas-row">
          <div className="meu-perfil__disciplinas-badges">
            <Badge variant="dark" size="md">
              Disciplinas concluídas ({MOCK_DADOS_ACADEMICOS.disciplinasConcluidas})
            </Badge>
            <Badge variant="soft" size="md">
              Em andamento ({MOCK_DADOS_ACADEMICOS.disciplinasEmAndamento})
            </Badge>
          </div>
          <Link
            to={PATHS.minhasDisciplinas}
            className="meu-perfil__ver-disciplinas"
          >
            <span>Ver minhas disciplinas</span>
            <ArrowRightIcon size={12} />
          </Link>
        </div>
      </section>

      {/* ── 5. Modal de edição ── */}
      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title="Editar dados pessoais"
        className="meu-perfil__modal"
      >
        <div className="meu-perfil__form">
          {erroModal && (
            <p className="meu-perfil__form-erro" role="alert">
              {erroModal}
            </p>
          )}

          <div className="meu-perfil__form-row">
            <div className="meu-perfil__form-group">
              <label htmlFor="perfil-nome" className="meu-perfil__form-label">
                Nome completo
              </label>
              <Input
                id="perfil-nome"
                value={form.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Seu nome completo"
                error={erros.nome}
                autoComplete="name"
              />
              {erros.nome && (
                <span className="meu-perfil__form-campo-erro">{erros.nome}</span>
              )}
            </div>

            <div className="meu-perfil__form-group">
              <label htmlFor="perfil-email" className="meu-perfil__form-label">
                E-mail
              </label>
              <Input
                id="perfil-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="seu@email.com"
                error={erros.email}
                autoComplete="email"
              />
              {erros.email && (
                <span className="meu-perfil__form-campo-erro">{erros.email}</span>
              )}
            </div>
          </div>

          <div className="meu-perfil__form-row">
            <div className="meu-perfil__form-group">
              <label htmlFor="perfil-cpf" className="meu-perfil__form-label">
                CPF
              </label>
              <Input
                id="perfil-cpf"
                value={form.cpf}
                onChange={(e) => handleChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                error={erros.cpf}
                autoComplete="off"
                inputMode="numeric"
              />
              {erros.cpf && (
                <span className="meu-perfil__form-campo-erro">{erros.cpf}</span>
              )}
            </div>

            <div className="meu-perfil__form-group">
              <label htmlFor="perfil-telefone" className="meu-perfil__form-label">
                Celular / Telefone
              </label>
              <Input
                id="perfil-telefone"
                value={form.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                placeholder="+55 (00) 00000-0000"
                error={erros.telefone}
                autoComplete="tel"
                inputMode="tel"
              />
              {erros.telefone && (
                <span className="meu-perfil__form-campo-erro">{erros.telefone}</span>
              )}
            </div>
          </div>

          <hr className="meu-perfil__form-divider" />
          <p className="meu-perfil__form-hint">
            Preencha apenas se desejar alterar sua senha.
          </p>

          <div className="meu-perfil__form-row">
            <div className="meu-perfil__form-group">
              <label htmlFor="perfil-senha" className="meu-perfil__form-label">
                Nova senha
              </label>
              <Input
                id="perfil-senha"
                type="password"
                value={form.senha}
                onChange={(e) => handleChange('senha', e.target.value)}
                placeholder="Mínimo 8 caracteres"
                error={erros.senha}
                autoComplete="new-password"
              />
              {erros.senha && (
                <span className="meu-perfil__form-campo-erro">{erros.senha}</span>
              )}
            </div>

            <div className="meu-perfil__form-group">
              <label htmlFor="perfil-confirmar-senha" className="meu-perfil__form-label">
                Confirmar nova senha
              </label>
              <Input
                id="perfil-confirmar-senha"
                type="password"
                value={form.confirmarSenha}
                onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                placeholder="Repita a nova senha"
                error={erros.confirmarSenha}
                autoComplete="new-password"
              />
              {erros.confirmarSenha && (
                <span className="meu-perfil__form-campo-erro">{erros.confirmarSenha}</span>
              )}
            </div>
          </div>

          <div className="meu-perfil__form-actions">
            <Button variant="secondary" size="md" onClick={fecharModal} disabled={salvando}>
              Cancelar
            </Button>
            <Button
              variant="dark"
              size="md"
              onClick={handleSalvar}
              disabled={salvando}
            >
              {salvando ? (
                'Salvando...'
              ) : (
                <>
                  <CheckCircleIcon size={15} />
                  Salvar alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MeuPerfil
