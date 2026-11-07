import { useState, useEffect, useCallback, useMemo } from 'react'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Button from '../../components/Button/Button'
import Badge from '../../components/Badge/Badge'
import Input from '../../components/Input/Input'
import Modal from '../../components/Modal/Modal'
import ModalDetalhesComunicado from '../../components/ModalDetalhesComunicado/ModalDetalhesComunicado'
import DateTile from '../../components/DateTile/DateTile'
import MiniCalendarPicker from '../../components/MiniCalendarPicker/MiniCalendarPicker'
import {
  validarDataCoerente,
  analisarDataHora,
  formatarParaInputLocal,
} from '../../utils/dateValidation'
import {
  MegaphoneIcon,
  FileTextIcon,
  CheckCircleIcon,
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  ZapIcon,
  ChevronRightIcon,
} from '../../components/icons'
import { PATHS } from '../../routes/paths'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAuth } from '../../hooks/useAuth'
import {
  listarComunicados,
  criarComunicado,
  atualizarComunicado,
  excluirComunicado,
  obterComunicadoPorId,
  determinarSituacao,
  MAPA_SITUACAO_PLURAL,
  formatarDataHora,
  paraInputDatetimeLocal,
  parseParaTimestamp,
  normalizarTextoParaBusca,
} from '../../services/comunicadoService'
import { ErroApi } from '../../services/apiClient'
import './GerenciamentoNoticias.css'

function extrairDiaMes(dataValor) {
  const t = parseParaTimestamp(dataValor)
  const d = t ? new Date(t) : (dataValor ? new Date(dataValor) : new Date())
  if (Number.isNaN(d.getTime())) {
    return { dia: '01', mes: 'NOV' }
  }
  const dia = String(d.getDate()).padStart(2, '0')
  const meses = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
  ]
  const mes = meses[d.getMonth()]
  return { dia, mes }
}

function GerenciamentoNoticias() {
  usePageTitle('Gerenciamento de Notícias')
  const { aluno, eAdmin } = useAuth()
  const usuarioId = aluno?.id

  // Estado da listagem
  const [comunicados, setComunicados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroListagem, setErroListagem] = useState(null)

  // Filtros e busca
  const [filtroStatus, setFiltroStatus] = useState('todos') // 'todos' | 'publicados' | 'programados' | 'rascunhos' | 'expirados'
  const [termoBusca, setTermoBusca] = useState('')

  // Modais
  const [modalFormAberta, setModalFormAberta] = useState(false)
  const [modoForm, setModoForm] = useState('criar') // 'criar' | 'editar'
  const [abaAtivaForm, setAbaAtivaForm] = useState('formulario') // 'formulario' | 'preview'
  const [comunicadoEditando, setComunicadoEditando] = useState(null)
  const [comunicadoVisualizando, setComunicadoVisualizando] = useState(null)
  const [comunicadoExcluindo, setComunicadoExcluindo] = useState(null)

  // Campos do formulário
  const [formTitulo, setFormTitulo] = useState('')
  const [formResumo, setFormResumo] = useState('')
  const [formCorpo, setFormCorpo] = useState('')
  const [tipoPublicacao, setTipoPublicacao] = useState('imediato') // 'imediato' | 'programado' | 'rascunho'
  const [formInicioEm, setFormInicioEm] = useState('')
  const [temEncerramento, setTemEncerramento] = useState(false)
  const [formExpiraEm, setFormExpiraEm] = useState('')

  const [agoraTimestamp, setAgoraTimestamp] = useState(() => Date.now())

  // Data atual formatada para valores mínimos de campos datetime-local
  const agoraInputLocal = useMemo(() => formatarParaInputLocal(new Date(agoraTimestamp)), [agoraTimestamp])

  // Validação e envio
  const [errosValidacao, setErrosValidacao] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState(null)
  const [conflitoInfo, setConflitoInfo] = useState(null)
  const [exibindoComparacaoConflito, setExibindoComparacaoConflito] = useState(false)
  const [excluindoEmAndamento, setExcluindoEmAndamento] = useState(false)
  const [erroExclusao, setErroExclusao] = useState(null)
  const [mensagemSucesso, setMensagemSucesso] = useState(null)

  // Ticker de tempo real para expiração e vigência automática
  useEffect(() => {
    const interval = setInterval(() => {
      setAgoraTimestamp(Date.now())
    }, 5000)

    const handleVisibility = () => {
      if (!document.hidden) {
        setAgoraTimestamp(Date.now())
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleVisibility)
    }
  }, [])

  // Carrega comunicados da API
  const carregarLista = useCallback(async () => {
    setCarregando(true)
    setErroListagem(null)
    try {
      const lista = await listarComunicados({
        limite: 100,
        incluirRascunhos: true,
        usuarioId,
      })
      setComunicados(lista)
    } catch (err) {
      if (err instanceof ErroApi && err.status === 403) {
        setErroListagem(
          'Permissão negada. Você não possui autorização para consultar esta área administrativa.'
        )
      } else {
        setErroListagem(
          err.message || 'Não foi possível carregar os comunicados.'
        )
      }
    } finally {
      setCarregando(false)
    }
  }, [usuarioId])

  useEffect(() => {
    let ativo = true

    listarComunicados({
      limite: 100,
      incluirRascunhos: true,
      usuarioId,
    })
      .then((lista) => {
        if (ativo) {
          setComunicados(lista)
          setCarregando(false)
        }
      })
      .catch((err) => {
        if (ativo) {
          if (err instanceof ErroApi && err.status === 403) {
            setErroListagem(
              'Permissão negada. Você não possui autorização para consultar esta área administrativa.'
            )
          } else {
            setErroListagem(
              err.message || 'Não foi possível carregar os comunicados.'
            )
          }
          setCarregando(false)
        }
      })

    return () => {
      ativo = false
    }
  }, [usuarioId])

  // Fecha mensagem de sucesso automaticamente após 5 segundos
  useEffect(() => {
    if (!mensagemSucesso) return
    const timer = setTimeout(() => {
      setMensagemSucesso(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [mensagemSucesso])

  // Abertura da modal para novo cadastro
  function abrirModalCriacao() {
    setModoForm('criar')
    setAbaAtivaForm('formulario')
    setComunicadoEditando(null)
    setFormTitulo('')
    setFormResumo('')
    setFormCorpo('')
    setTipoPublicacao('imediato')
    setFormInicioEm('')
    setTemEncerramento(false)
    setFormExpiraEm('')
    setErrosValidacao({})
    setErroEnvio(null)
    setConflitoInfo(null)
    setExibindoComparacaoConflito(false)
    setModalFormAberta(true)
  }

  // Abertura da modal para edição de um item existente
  function abrirModalEdicao(comunicado) {
    setModoForm('editar')
    setAbaAtivaForm('formulario')
    setComunicadoEditando(comunicado)
    setFormTitulo(comunicado.titulo || '')
    setFormResumo(comunicado.resumo || '')
    setFormCorpo(comunicado.corpo || '')

    const situacao = determinarSituacao(comunicado)
    if (!comunicado.publicado) {
      setTipoPublicacao('rascunho')
    } else if (situacao === 'programado') {
      setTipoPublicacao('programado')
    } else {
      setTipoPublicacao('imediato')
    }

    setFormInicioEm(
      comunicado.inicio_em ? paraInputDatetimeLocal(comunicado.inicio_em) : ''
    )
    setTemEncerramento(Boolean(comunicado.expira_em))
    setFormExpiraEm(
      comunicado.expira_em ? paraInputDatetimeLocal(comunicado.expira_em) : ''
    )
    setErrosValidacao({})
    setErroEnvio(null)
    setConflitoInfo(null)
    setExibindoComparacaoConflito(false)
    setModalFormAberta(true)
  }

  const fecharModalForm = useCallback(() => {
    setModalFormAberta(false)
    setComunicadoEditando(null)
    setErrosValidacao({})
    setErroEnvio(null)
    setConflitoInfo(null)
    setExibindoComparacaoConflito(false)
  }, [])

  // Validação unificada dos campos e regras de datas
  function validarFormulario() {
    const novosErros = {}

    if (!formTitulo.trim()) {
      novosErros.titulo =
        'O título é obrigatório e não pode conter apenas espaços.'
    }
    if (!formResumo.trim()) {
      novosErros.resumo =
        'O resumo é obrigatório e não pode conter apenas espaços.'
    }
    if (!formCorpo.trim()) {
      novosErros.corpo =
        'O corpo do comunicado é obrigatório e não pode conter apenas espaços.'
    }

    // Regras de agendamento e período de publicação com verificação rigorosa de coerência
    if (tipoPublicacao === 'programado') {
      const inicioJaSalvo =
        modoForm === 'editar' &&
        comunicadoEditando?.inicio_em &&
        formInicioEm === paraInputDatetimeLocal(comunicadoEditando.inicio_em)

      if (!formInicioEm) {
        novosErros.inicio_em =
          'Informe a data e horário de início para a publicação programada.'
      } else {
        const valInicio = validarDataCoerente(formInicioEm, {
          permitirPassado: Boolean(inicioJaSalvo),
          nomeCampo: 'A data e horário de início',
        })
        if (!valInicio.valido) {
          novosErros.inicio_em = valInicio.erro
        }
      }

      if (formExpiraEm) {
        const expiraJaSalvo =
          modoForm === 'editar' &&
          comunicadoEditando?.expira_em &&
          formExpiraEm === paraInputDatetimeLocal(comunicadoEditando.expira_em)

        const valExpira = validarDataCoerente(formExpiraEm, {
          permitirPassado: Boolean(expiraJaSalvo),
          minData: formInicioEm || null,
          nomeCampo: 'A data e horário de término',
        })
        if (!valExpira.valido) {
          novosErros.expira_em = valExpira.erro
        }
      }
    }

    if (tipoPublicacao === 'imediato' && temEncerramento) {
      if (!formExpiraEm) {
        novosErros.expira_em =
          'Informe a data e horário de encerramento da publicação.'
      } else {
        const expiraJaSalvo =
          modoForm === 'editar' &&
          comunicadoEditando?.expira_em &&
          formExpiraEm === paraInputDatetimeLocal(comunicadoEditando.expira_em)

        const valExpira = validarDataCoerente(formExpiraEm, {
          permitirPassado: Boolean(expiraJaSalvo),
          nomeCampo: 'A data e horário de encerramento',
        })
        if (!valExpira.valido) {
          novosErros.expira_em = valExpira.erro
        }
      }
    }

    setErrosValidacao(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // Envio do formulário (Criação ou Edição)
  async function handleSubmitForm(e) {
    e.preventDefault()
    setErroEnvio(null)

    if (!validarFormulario()) {
      setAbaAtivaForm('formulario')
      return
    }

    setEnviando(true)

    const ehPublicado = tipoPublicacao !== 'rascunho'

    // Preservação exata do timestamp original caso o usuário não tenha alterado as datas
    const inicioInalterado =
      modoForm === 'editar' &&
      comunicadoEditando?.inicio_em &&
      formInicioEm === paraInputDatetimeLocal(comunicadoEditando.inicio_em)

    const expiraInalterado =
      modoForm === 'editar' &&
      comunicadoEditando?.expira_em &&
      formExpiraEm === paraInputDatetimeLocal(comunicadoEditando.expira_em)

    const analiseInicio = formInicioEm ? analisarDataHora(formInicioEm) : null
    const inicioIso =
      tipoPublicacao === 'programado'
        ? (inicioInalterado
            ? comunicadoEditando.inicio_em
            : analiseInicio?.valido
              ? analiseInicio.dataObj.toISOString()
              : null)
        : null

    const analiseExpira = formExpiraEm ? analisarDataHora(formExpiraEm) : null
    const expiraIso =
      (temEncerramento || (tipoPublicacao === 'programado' && formExpiraEm))
        ? (expiraInalterado
            ? comunicadoEditando.expira_em
            : analiseExpira?.valido
              ? analiseExpira.dataObj.toISOString()
              : null)
        : null

    try {
      if (modoForm === 'criar') {
        const novoComunicado = await criarComunicado({
          titulo: formTitulo.trim(),
          resumo: formResumo.trim(),
          corpo: formCorpo.trim(),
          publicado: ehPublicado,
          inicio_em: inicioIso,
          expira_em: expiraIso,
          usuarioId,
        })

        // Atualiza a listagem localmente
        setComunicados((anteriores) => {
          const existe = anteriores.some((c) => c.id === novoComunicado.id)
          if (existe) return anteriores
          return [novoComunicado, ...anteriores]
        })

        fecharModalForm()

        const msgSucesso =
          tipoPublicacao === 'programado'
            ? 'Comunicado cadastrado e programado para publicação automática!'
            : ehPublicado
              ? 'Comunicado publicado com sucesso para toda a comunidade!'
              : 'Comunicado salvo como rascunho com sucesso!'

        setMensagemSucesso(msgSucesso)
      } else if (modoForm === 'editar' && comunicadoEditando) {
        const dadosAtualizados = await atualizarComunicado(
          comunicadoEditando.id,
          {
            titulo: formTitulo.trim(),
            resumo: formResumo.trim(),
            corpo: formCorpo.trim(),
            publicado: ehPublicado,
            publicado_em: comunicadoEditando.publicado_em,
            inicio_em: inicioIso,
            expira_em: expiraIso,
            versao: comunicadoEditando.versao,
          }
        )

        // Atualiza a listagem sem duplicar
        setComunicados((anteriores) =>
          anteriores.map((c) =>
            c.id === comunicadoEditando.id ? { ...c, ...dadosAtualizados } : c
          )
        )

        fecharModalForm()
        setMensagemSucesso('Comunicado atualizado com sucesso!')
      }
    } catch (err) {
      if (err instanceof ErroApi && err.status === 403) {
        setErroEnvio(
          'Acesso negado: apenas administradores podem gerenciar comunicados.'
        )
      } else if (err instanceof ErroApi && err.status === 409) {
        // Conflito de concorrência: busca a versão atual do servidor sem descartar o texto digitado
        try {
          const remoto = await obterComunicadoPorId(comunicadoEditando.id)
          setConflitoInfo({ remoto })
          setErroEnvio(
            `Conflito de concorrência: este comunicado foi alterado por outro administrador no servidor (versão ${remoto.versao}, base em edição: ${comunicadoEditando.versao}). O texto que você digitou foi 100% preservado.`
          )
        } catch {
          setErroEnvio(
            'Conflito de concorrência: este comunicado foi modificado por outro administrador no servidor. Suas alterações foram preservadas no formulário.'
          )
        }
      } else if (err instanceof ErroApi && err.status === 404) {
        setErroEnvio(err.message)
      } else if (err instanceof ErroApi && err.status === 422) {
        setErroEnvio(
          'Dados inválidos. Verifique se todos os campos foram preenchidos corretamente.'
        )
      } else {
        setErroEnvio(
          err.message || 'Falha ao salvar comunicado. Tente novamente.'
        )
      }
    } finally {
      setEnviando(false)
    }
  }

  // Resolução de conflito: atualiza a versão base mantendo os textos digitados pelo admin
  function resolverConflitoManterTexto() {
    if (!conflitoInfo?.remoto) return
    const vRemota = conflitoInfo.remoto.versao
    setComunicadoEditando((prev) => ({
      ...prev,
      versao: vRemota,
      publicado_em: conflitoInfo.remoto.publicado_em,
    }))
    setConflitoInfo(null)
    setErroEnvio(null)
    setExibindoComparacaoConflito(false)
    setMensagemSucesso(
      `Versão base atualizada para v${vRemota}. Suas alterações foram mantidas e você já pode clicar em Salvar.`
    )
  }

  // Resolução de conflito: descarta alterações locais e carrega os dados atuais do servidor
  function resolverConflitoSubstituirPeloServidor() {
    if (!conflitoInfo?.remoto) return
    const r = conflitoInfo.remoto
    setComunicadoEditando(r)
    setFormTitulo(r.titulo || '')
    setFormResumo(r.resumo || '')
    setFormCorpo(r.corpo || '')
    const sit = determinarSituacao(r)
    if (!r.publicado) {
      setTipoPublicacao('rascunho')
    } else if (sit === 'programado') {
      setTipoPublicacao('programado')
    } else {
      setTipoPublicacao('imediato')
    }
    setFormInicioEm(r.inicio_em ? paraInputDatetimeLocal(r.inicio_em) : '')
    setTemEncerramento(Boolean(r.expira_em))
    setFormExpiraEm(r.expira_em ? paraInputDatetimeLocal(r.expira_em) : '')
    setConflitoInfo(null)
    setErroEnvio(null)
    setExibindoComparacaoConflito(false)
    setMensagemSucesso('Dados do formulário substituídos pela versão mais recente do servidor.')
  }

  // Execução da exclusão com tratamento honesto do backend
  async function handleConfirmarExclusao() {
    if (!comunicadoExcluindo) return

    setExcluindoEmAndamento(true)
    setErroExclusao(null)

    const ehRascunho = !comunicadoExcluindo.publicado

    try {
      await excluirComunicado(comunicadoExcluindo.id)

      // Remove da listagem local
      setComunicados((anteriores) =>
        anteriores.filter((c) => c.id !== comunicadoExcluindo.id)
      )

      setComunicadoExcluindo(null)
      setMensagemSucesso(
        ehRascunho
          ? 'Rascunho excluído com sucesso!'
          : 'Comunicado excluído com sucesso!'
      )
    } catch (err) {
      if (err instanceof ErroApi && err.status === 404) {
        setErroExclusao(err.message)
      } else {
        setErroExclusao(
          err.message ||
            'Não foi possível excluir o comunicado. Tente novamente.'
        )
      }
    } finally {
      setExcluindoEmAndamento(false)
    }
  }

  // Contagens para os badges das abas de filtro
  const contadores = useMemo(() => {
    const cont = {
      todos: comunicados.length,
      publicados: 0,
      programados: 0,
      rascunhos: 0,
      expirados: 0,
    }

    for (const c of comunicados) {
      const situacao = determinarSituacao(c, agoraTimestamp)
      const chavePlural = MAPA_SITUACAO_PLURAL[situacao] || situacao
      if (cont[chavePlural] !== undefined) {
        cont[chavePlural] += 1
      }
    }

    return cont
  }, [comunicados, agoraTimestamp])

  // Filtragem e busca em tempo real
  const comunicadosFiltrados = useMemo(() => {
    let lista = [...comunicados]

    // Filtro por status
    if (filtroStatus !== 'todos') {
      lista = lista.filter((c) => {
        const situacao = determinarSituacao(c, agoraTimestamp)
        const chavePlural = MAPA_SITUACAO_PLURAL[situacao] || situacao
        return situacao === filtroStatus || chavePlural === filtroStatus
      })
    }

    // Busca por título, resumo ou corpo (insensível a acentuação e caixa)
    if (termoBusca.trim()) {
      const termoNormalizado = normalizarTextoParaBusca(termoBusca)
      lista = lista.filter((c) => {
        const tit = normalizarTextoParaBusca(c.titulo || '')
        const res = normalizarTextoParaBusca(c.resumo || '')
        const corp = normalizarTextoParaBusca(c.corpo || '')
        return (
          tit.includes(termoNormalizado) ||
          res.includes(termoNormalizado) ||
          corp.includes(termoNormalizado)
        )
      })
    }

    return lista
  }, [comunicados, filtroStatus, termoBusca, agoraTimestamp])

  // Helper para renderizar a badge de status adequada
  function renderBadgeStatus(comunicado) {
    const situacao = determinarSituacao(comunicado, agoraTimestamp)
    switch (situacao) {
      case 'publicado':
        return (
          <Badge variant="success" size="sm">
            Publicado
          </Badge>
        )
      case 'programado':
        return (
          <Badge variant="primary" size="sm">
            Programado
          </Badge>
        )
      case 'expirado':
        return (
          <Badge variant="dark" size="sm">
            Expirado
          </Badge>
        )
      case 'rascunho':
      default:
        return (
          <Badge variant="soft" size="sm">
            Rascunho
          </Badge>
        )
    }
  }

  // Helper para renderizar a informação do período de validade
  function renderInfoValidade(comunicado) {
    if (!comunicado.inicio_em && !comunicado.expira_em) return null

    if (comunicado.inicio_em && comunicado.expira_em) {
      return (
        <span className="gerenciamento-noticias__card-validity">
          <ClockIcon size={13} aria-hidden="true" />
          <span>
            Válido de {formatarDataHora(comunicado.inicio_em)} até{' '}
            {formatarDataHora(comunicado.expira_em)}
          </span>
        </span>
      )
    }

    if (comunicado.inicio_em) {
      return (
        <span className="gerenciamento-noticias__card-validity">
          <ClockIcon size={13} aria-hidden="true" />
          <span>A partir de {formatarDataHora(comunicado.inicio_em)}</span>
        </span>
      )
    }

    if (comunicado.expira_em) {
      return (
        <span className="gerenciamento-noticias__card-validity">
          <ClockIcon size={13} aria-hidden="true" />
          <span>Válido até {formatarDataHora(comunicado.expira_em)}</span>
        </span>
      )
    }

    return null
  }

  // Data e hora para a pré-visualização em tempo real
  const dataPreview = useMemo(() => {
    if (tipoPublicacao === 'programado' && formInicioEm) {
      return extrairDiaMes(formInicioEm)
    }
    return extrairDiaMes(new Date().toISOString())
  }, [tipoPublicacao, formInicioEm])

  return (
    <div className="gerenciamento-noticias">
      {/* ====================================================================
          A. Cabeçalho Administrativo Refinado
          ==================================================================== */}
      <header className="gerenciamento-noticias__header">
        <Breadcrumb
          items={[
            { label: 'Portal Acadêmico', to: PATHS.inicio },
            { label: 'Gerenciamento de Notícias' },
          ]}
        />

        <div className="gerenciamento-noticias__header-body">
          <div className="gerenciamento-noticias__header-info">
            <div className="gerenciamento-noticias__title-group">
              <h1 className="gerenciamento-noticias__title">
                Gerenciamento de Notícias
              </h1>
              {eAdmin && (
                <Badge variant="primary" size="sm">
                  Coordenação
                </Badge>
              )}
            </div>
            <p className="gerenciamento-noticias__subtitle">
              Cadastre, programe, edite e publique comunicados e informes oficiais
              para toda a comunidade acadêmica.
            </p>
          </div>

          <div className="gerenciamento-noticias__header-action">
            <Button
              variant="primary"
              size="md"
              onClick={abrirModalCriacao}
              className="gerenciamento-noticias__btn-novo"
            >
              <MegaphoneIcon size={16} aria-hidden="true" />
              <span>Novo Comunicado</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Alerta de sucesso flutuante / integrado */}
      {mensagemSucesso && (
        <div
          className="gerenciamento-noticias__alert gerenciamento-noticias__alert--success"
          role="status"
          aria-live="polite"
        >
          <CheckCircleIcon size={20} aria-hidden="true" />
          <span>{mensagemSucesso}</span>
          <button
            type="button"
            className="gerenciamento-noticias__alert-close"
            onClick={() => setMensagemSucesso(null)}
            aria-label="Fechar aviso"
          >
            &times;
          </button>
        </div>
      )}

      {/* Alerta de erro de listagem */}
      {erroListagem && (
        <div
          className="gerenciamento-noticias__alert gerenciamento-noticias__alert--error"
          role="alert"
        >
          <span>{erroListagem}</span>
          <Button variant="secondary" size="sm" onClick={carregarLista}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* ====================================================================
          B. Toolbar de Filtros e Busca em Tempo Real
          ==================================================================== */}
      <section
        className="gerenciamento-noticias__toolbar"
        aria-label="Controles de filtragem e pesquisa"
      >
        <div className="gerenciamento-noticias__filters" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={filtroStatus === 'todos'}
            className={`gerenciamento-noticias__filter-btn ${
              filtroStatus === 'todos'
                ? 'gerenciamento-noticias__filter-btn--active'
                : ''
            }`}
            onClick={() => setFiltroStatus('todos')}
          >
            Todos
            <span className="gerenciamento-noticias__filter-count">
              {contadores.todos}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={filtroStatus === 'publicados'}
            className={`gerenciamento-noticias__filter-btn ${
              filtroStatus === 'publicados'
                ? 'gerenciamento-noticias__filter-btn--active'
                : ''
            }`}
            onClick={() => setFiltroStatus('publicados')}
          >
            Publicados
            <span className="gerenciamento-noticias__filter-count">
              {contadores.publicados}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={filtroStatus === 'programados'}
            className={`gerenciamento-noticias__filter-btn ${
              filtroStatus === 'programados'
                ? 'gerenciamento-noticias__filter-btn--active'
                : ''
            }`}
            onClick={() => setFiltroStatus('programados')}
          >
            Programados
            <span className="gerenciamento-noticias__filter-count">
              {contadores.programados}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={filtroStatus === 'rascunhos'}
            className={`gerenciamento-noticias__filter-btn ${
              filtroStatus === 'rascunhos'
                ? 'gerenciamento-noticias__filter-btn--active'
                : ''
            }`}
            onClick={() => setFiltroStatus('rascunhos')}
          >
            Rascunhos
            <span className="gerenciamento-noticias__filter-count">
              {contadores.rascunhos}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={filtroStatus === 'expirados'}
            className={`gerenciamento-noticias__filter-btn ${
              filtroStatus === 'expirados'
                ? 'gerenciamento-noticias__filter-btn--active'
                : ''
            }`}
            onClick={() => setFiltroStatus('expirados')}
          >
            Expirados
            <span className="gerenciamento-noticias__filter-count">
              {contadores.expirados}
            </span>
          </button>
        </div>

        <div className="gerenciamento-noticias__search-wrapper">
          <SearchIcon
            size={16}
            className="gerenciamento-noticias__search-icon"
            aria-hidden="true"
          />
          <Input
            type="text"
            role="searchbox"
            className="gerenciamento-noticias__search-input"
            placeholder="Buscar por título, resumo ou corpo..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            aria-label="Buscar comunicados por título, resumo ou conteúdo"
          />
          {termoBusca && (
            <button
              type="button"
              className="gerenciamento-noticias__search-clear"
              onClick={() => setTermoBusca('')}
              title="Limpar pesquisa"
              aria-label="Limpar pesquisa"
            >
              &times;
            </button>
          )}
        </div>
      </section>

      {/* ====================================================================
          C. Área de Listagem de Comunicados
          ==================================================================== */}
      <section
        className="gerenciamento-noticias__content"
        aria-label="Lista de comunicados cadastrados"
      >
        {carregando ? (
          <div className="gerenciamento-noticias__loading">
            <p>Carregando comunicados institucionais...</p>
          </div>
        ) : comunicadosFiltrados.length === 0 ? (
          /* Estado Vazio */
          <div className="gerenciamento-noticias__empty">
            <div
              className="gerenciamento-noticias__empty-icon"
              aria-hidden="true"
            >
              <MegaphoneIcon size={32} />
            </div>
            <h2 className="gerenciamento-noticias__empty-title">
              Nenhum comunicado encontrado
            </h2>
            <p className="gerenciamento-noticias__empty-text">
              {termoBusca || filtroStatus !== 'todos'
                ? 'Não encontramos nenhum comunicado correspondente aos filtros selecionados.'
                : 'Ainda não existem notícias ou comunicados cadastrados no sistema.'}
            </p>
            {termoBusca || filtroStatus !== 'todos' ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setTermoBusca('')
                  setFiltroStatus('todos')
                }}
              >
                Limpar filtros
              </Button>
            ) : (
              <Button variant="primary" size="md" onClick={abrirModalCriacao}>
                Cadastrar primeiro comunicado
              </Button>
            )}
          </div>
        ) : (
          /* Lista de cards com anatomia completa */
          <div className="gerenciamento-noticias__list" role="list">
            {comunicadosFiltrados.map((item) => {
              const situacao = determinarSituacao(item, agoraTimestamp)
              return (
                <article
                  key={item.id}
                  className={`gerenciamento-noticias__card gerenciamento-noticias__card--${situacao}`}
                  role="listitem"
                >
                  <div className="gerenciamento-noticias__card-main">
                    <div className="gerenciamento-noticias__card-meta">
                      <span className="gerenciamento-noticias__card-date">
                        <CalendarIcon size={14} aria-hidden="true" />
                        <time dateTime={item.publicado_em || item.inicio_em}>
                          {formatarDataHora(
                            item.publicado_em || item.inicio_em
                          )}
                        </time>
                      </span>

                      {renderBadgeStatus(item)}

                      {renderInfoValidade(item)}
                    </div>

                    <h3 className="gerenciamento-noticias__card-title">
                      {item.titulo}
                    </h3>

                    <p className="gerenciamento-noticias__card-summary">
                      {item.resumo}
                    </p>
                  </div>

                  <div className="gerenciamento-noticias__card-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setComunicadoVisualizando(item)}
                      title={`Visualizar detalhes de: ${item.titulo}`}
                      aria-label={`Visualizar detalhes de ${item.titulo}`}
                    >
                      <EyeIcon size={15} aria-hidden="true" />
                      <span>Visualizar</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => abrirModalEdicao(item)}
                      title={`Editar comunicado: ${item.titulo}`}
                      aria-label={`Editar comunicado ${item.titulo}`}
                    >
                      <EditIcon size={15} aria-hidden="true" />
                      <span>Editar</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setErroExclusao(null)
                        setComunicadoExcluindo(item)
                      }}
                      className="gerenciamento-noticias__btn-excluir"
                      title={`Excluir comunicado: ${item.titulo}`}
                      aria-label={`Excluir comunicado ${item.titulo}`}
                    >
                      <TrashIcon size={15} aria-hidden="true" />
                      <span>Excluir</span>
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* ====================================================================
          D. Modal Reutilizável de Formulário (Cadastro & Edição)
          ==================================================================== */}
      <Modal
        isOpen={modalFormAberta}
        onClose={fecharModalForm}
        title={
          modoForm === 'editar'
            ? 'Editar Comunicado Institucional'
            : 'Cadastrar Novo Comunicado'
        }
        className="modal-form-comunicado"
      >
        <div className="modal-form-comunicado__wrapper">
          {/* Top Bar: Subtítulo e Seletor de Modo (Formulário vs Pré-visualização) */}
          <div className="modal-form-comunicado__topbar">
            <p className="modal-form-comunicado__top-desc">
              Preencha os campos abaixo com as informações oficiais. Você pode
              publicar imediatamente, programar para uma data futura ou salvar
              como rascunho de trabalho.
            </p>

            <div
              className="modal-form-comunicado__nav-tabs"
              role="tablist"
              aria-label="Modo de visualização da modal"
            >
              <button
                type="button"
                role="tab"
                aria-selected={abaAtivaForm === 'formulario'}
                className={`modal-form-comunicado__nav-tab-btn ${
                  abaAtivaForm === 'formulario'
                    ? 'modal-form-comunicado__nav-tab-btn--active'
                    : ''
                }`}
                onClick={() => setAbaAtivaForm('formulario')}
              >
                <EditIcon size={14} aria-hidden="true" />
                <span>Formulário</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={abaAtivaForm === 'preview'}
                className={`modal-form-comunicado__nav-tab-btn ${
                  abaAtivaForm === 'preview'
                    ? 'modal-form-comunicado__nav-tab-btn--active'
                    : ''
                }`}
                onClick={() => setAbaAtivaForm('preview')}
              >
                <EyeIcon size={14} aria-hidden="true" />
                <span>Pré-visualização</span>
                <span className="modal-form-comunicado__preview-badge-dot" />
              </button>
            </div>
          </div>

          {/* Card interativo de conflito de concorrência com opções não destrutivas */}
          {conflitoInfo?.remoto && (
            <div className="modal-form-comunicado__conflict-card" role="alert">
              <div className="modal-form-comunicado__conflict-header">
                <strong>Conflito de Concorrência Detectado</strong>
                <p>
                  Outro administrador alterou este comunicado no servidor enquanto você o editava
                  (Versão no servidor: <strong>v{conflitoInfo.remoto.versao}</strong> | Sua versão base: <strong>v{comunicadoEditando?.versao}</strong>).
                  <br />
                  <strong>Suas alterações digitadas abaixo não foram perdidas.</strong> Escolha como deseja prosseguir:
                </p>
              </div>

              <div className="modal-form-comunicado__conflict-actions">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={resolverConflitoManterTexto}
                >
                  Manter meu texto e atualizar para versão do servidor
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExibindoComparacaoConflito((v) => !v)}
                >
                  {exibindoComparacaoConflito ? 'Ocultar comparação' : 'Comparar alterações do servidor'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={resolverConflitoSubstituirPeloServidor}
                >
                  Descartar meu texto e carregar versão do servidor
                </Button>
              </div>

              {exibindoComparacaoConflito && (
                <div className="modal-form-comunicado__conflict-diff">
                  <div className="modal-form-comunicado__diff-col">
                    <span className="modal-form-comunicado__diff-tag">
                      No Servidor (v{conflitoInfo.remoto.versao})
                    </span>
                    <p><strong>Título:</strong> {conflitoInfo.remoto.titulo}</p>
                    <p><strong>Resumo:</strong> {conflitoInfo.remoto.resumo}</p>
                    <div className="modal-form-comunicado__diff-corpo">
                      <strong>Conteúdo:</strong>
                      <p>{conflitoInfo.remoto.corpo}</p>
                    </div>
                  </div>
                  <div className="modal-form-comunicado__diff-col modal-form-comunicado__diff-col--local">
                    <span className="modal-form-comunicado__diff-tag">
                      Seu Texto em Edição (Não Salvo)
                    </span>
                    <p><strong>Título:</strong> {formTitulo}</p>
                    <p><strong>Resumo:</strong> {formResumo}</p>
                    <div className="modal-form-comunicado__diff-corpo">
                      <strong>Conteúdo:</strong>
                      <p>{formCorpo}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Alerta de outros erros de envio */}
          {erroEnvio && !conflitoInfo && (
            <div className="gerenciamento-noticias__form-alert" role="alert">
              <div>
                <strong>Atenção:</strong> {erroEnvio}
              </div>
            </div>
          )}

          {/* Conteúdo Principal: Aba Formulário */}
          {abaAtivaForm === 'formulario' ? (
            <form
              onSubmit={handleSubmitForm}
              className="modal-form-comunicado__form"
              noValidate
            >
              {/* ============================================================
                  SEÇÃO 1: Conteúdo Principal da Notícia
                  ============================================================ */}
              <section className="modal-form-comunicado__section-card">
                <div className="modal-form-comunicado__section-header">
                  <div
                    className="modal-form-comunicado__section-icon-badge"
                    aria-hidden="true"
                  >
                    <FileTextIcon size={16} />
                  </div>
                  <div className="modal-form-comunicado__section-text">
                    <h3 className="modal-form-comunicado__section-title">
                      1. Conteúdo do Comunicado
                    </h3>
                    <p className="modal-form-comunicado__section-subtitle">
                      Defina o título institucional, a síntese de destaque e o
                      texto integral.
                    </p>
                  </div>
                </div>

                <div className="modal-form-comunicado__section-body">
                  {/* Campo Título */}
                  <div className="modal-form-comunicado__field">
                    <div className="modal-form-comunicado__label-row">
                      <label
                        htmlFor="form-titulo"
                        className="modal-form-comunicado__label"
                      >
                        Título da Notícia ou Comunicado{' '}
                        <span className="modal-form-comunicado__required">
                          *
                        </span>
                      </label>
                      <span className="modal-form-comunicado__counter">
                        {formTitulo.length} / 140
                      </span>
                    </div>
                    <Input
                      id="form-titulo"
                      name="titulo"
                      placeholder="Ex.: Período de matrículas e ajustes 2026.2 aberto"
                      value={formTitulo}
                      maxLength={140}
                      onChange={(e) => {
                        setFormTitulo(e.target.value)
                        if (errosValidacao.titulo) {
                          setErrosValidacao((prev) => ({
                            ...prev,
                            titulo: null,
                          }))
                        }
                      }}
                      error={Boolean(errosValidacao.titulo)}
                      aria-describedby={
                        errosValidacao.titulo ? 'form-titulo-erro' : undefined
                      }
                      disabled={enviando}
                    />
                    {errosValidacao.titulo && (
                      <span
                        id="form-titulo-erro"
                        className="modal-form-comunicado__error-msg"
                        role="alert"
                      >
                        {errosValidacao.titulo}
                      </span>
                    )}
                  </div>

                  {/* Campo Resumo */}
                  <div className="modal-form-comunicado__field">
                    <div className="modal-form-comunicado__label-row">
                      <label
                        htmlFor="form-resumo"
                        className="modal-form-comunicado__label"
                      >
                        Resumo Breve{' '}
                        <span className="modal-form-comunicado__required">
                          *
                        </span>
                      </label>
                      <span className="modal-form-comunicado__counter">
                        {formResumo.length} / 200
                      </span>
                    </div>
                    <span className="modal-form-comunicado__hint">
                      Texto conciso visível nos cards da Página Inicial e notificações.
                    </span>
                    <Input
                      id="form-resumo"
                      name="resumo"
                      placeholder="Ex.: O processo de ajustes e inclusão de disciplinas está disponível até 22 de setembro."
                      value={formResumo}
                      maxLength={200}
                      onChange={(e) => {
                        setFormResumo(e.target.value)
                        if (errosValidacao.resumo) {
                          setErrosValidacao((prev) => ({
                            ...prev,
                            resumo: null,
                          }))
                        }
                      }}
                      error={Boolean(errosValidacao.resumo)}
                      aria-describedby={
                        errosValidacao.resumo ? 'form-resumo-erro' : undefined
                      }
                      disabled={enviando}
                    />
                    {errosValidacao.resumo && (
                      <span
                        id="form-resumo-erro"
                        className="modal-form-comunicado__error-msg"
                        role="alert"
                      >
                        {errosValidacao.resumo}
                      </span>
                    )}
                  </div>

                  {/* Campo Corpo Completo */}
                  <div className="modal-form-comunicado__field">
                    <div className="modal-form-comunicado__label-row">
                      <label
                        htmlFor="form-corpo"
                        className="modal-form-comunicado__label"
                      >
                        Corpo Completo da Notícia{' '}
                        <span className="modal-form-comunicado__required">
                          *
                        </span>
                      </label>
                      <span className="modal-form-comunicado__counter">
                        {formCorpo.trim()
                          ? `${formCorpo.trim().split(/\s+/).length} palavras`
                          : '0 palavras'}{' '}
                        ({formCorpo.length} / 20.000)
                      </span>
                    </div>
                    <span className="modal-form-comunicado__hint">
                      Texto detalhado com prazos, regulamento, orientações e links úteis.
                    </span>
                    <textarea
                      id="form-corpo"
                      name="corpo"
                      rows={6}
                      className={`modal-form-comunicado__textarea ${
                        errosValidacao.corpo
                          ? 'modal-form-comunicado__textarea--error'
                          : ''
                      }`}
                      placeholder="Digite as instruções e orientações completas para a comunidade acadêmica..."
                      value={formCorpo}
                      onChange={(e) => {
                        setFormCorpo(e.target.value)
                        if (errosValidacao.corpo) {
                          setErrosValidacao((prev) => ({
                            ...prev,
                            corpo: null,
                          }))
                        }
                      }}
                      aria-invalid={Boolean(errosValidacao.corpo)}
                      aria-describedby={
                        errosValidacao.corpo ? 'form-corpo-erro' : undefined
                      }
                      disabled={enviando}
                    />
                    {errosValidacao.corpo && (
                      <span
                        id="form-corpo-erro"
                        className="modal-form-comunicado__error-msg"
                        role="alert"
                      >
                        {errosValidacao.corpo}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* ============================================================
                  SEÇÃO 2: Modalidade de Publicação e Prazos (UNIFICADA)
                  ============================================================ */}
              <section className="modal-form-comunicado__section-card">
                <div className="modal-form-comunicado__section-header">
                  <div
                    className="modal-form-comunicado__section-icon-badge"
                    aria-hidden="true"
                  >
                    <CalendarIcon size={16} />
                  </div>
                  <div className="modal-form-comunicado__section-text">
                    <h3 className="modal-form-comunicado__section-title">
                      2. Modalidade e Prazos de Publicação
                    </h3>
                    <p className="modal-form-comunicado__section-subtitle">
                      Escolha a visibilidade da notícia e configure o período em que estará disponível.
                    </p>
                  </div>
                </div>

                <div className="modal-form-comunicado__section-body">
                  {/* Grid das 3 opções de publicação */}
                  <div
                    className="modal-form-comunicado__options-grid"
                    role="radiogroup"
                    aria-label="Modalidade de publicação"
                  >
                    {/* Opção 1: Imediata */}
                    <label
                      className={`modal-form-comunicado__option-tile ${
                        tipoPublicacao === 'imediato'
                          ? 'modal-form-comunicado__option-tile--selected'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipoPublicacao"
                        value="imediato"
                        checked={tipoPublicacao === 'imediato'}
                        onChange={() => setTipoPublicacao('imediato')}
                        disabled={enviando}
                        className="modal-form-comunicado__radio-hidden"
                      />
                      <div className="modal-form-comunicado__option-header">
                        <div
                          className="modal-form-comunicado__option-icon"
                          aria-hidden="true"
                        >
                          <ZapIcon size={16} />
                        </div>
                        <span
                          className={`modal-form-comunicado__radio-circle ${
                            tipoPublicacao === 'imediato'
                              ? 'modal-form-comunicado__radio-circle--active'
                              : ''
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="modal-form-comunicado__option-name">
                        Publicação Imediata
                      </span>
                      <p className="modal-form-comunicado__option-desc">
                        Fica visível no portal assim que salvo.
                      </p>
                    </label>

                    {/* Opção 2: Programada */}
                    <label
                      className={`modal-form-comunicado__option-tile ${
                        tipoPublicacao === 'programado'
                          ? 'modal-form-comunicado__option-tile--selected'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipoPublicacao"
                        value="programado"
                        checked={tipoPublicacao === 'programado'}
                        onChange={() => setTipoPublicacao('programado')}
                        disabled={enviando}
                        className="modal-form-comunicado__radio-hidden"
                      />
                      <div className="modal-form-comunicado__option-header">
                        <div
                          className="modal-form-comunicado__option-icon"
                          aria-hidden="true"
                        >
                          <ClockIcon size={16} />
                        </div>
                        <span
                          className={`modal-form-comunicado__radio-circle ${
                            tipoPublicacao === 'programado'
                              ? 'modal-form-comunicado__radio-circle--active'
                              : ''
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="modal-form-comunicado__option-name">
                        Publicação Programada
                      </span>
                      <p className="modal-form-comunicado__option-desc">
                        Liberação automática em data e horário futuros.
                      </p>
                    </label>

                    {/* Opção 3: Rascunho */}
                    <label
                      className={`modal-form-comunicado__option-tile ${
                        tipoPublicacao === 'rascunho'
                          ? 'modal-form-comunicado__option-tile--selected'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipoPublicacao"
                        value="rascunho"
                        checked={tipoPublicacao === 'rascunho'}
                        onChange={() => setTipoPublicacao('rascunho')}
                        disabled={enviando}
                        className="modal-form-comunicado__radio-hidden"
                      />
                      <div className="modal-form-comunicado__option-header">
                        <div
                          className="modal-form-comunicado__option-icon"
                          aria-hidden="true"
                        >
                          <FileTextIcon size={16} />
                        </div>
                        <span
                          className={`modal-form-comunicado__radio-circle ${
                            tipoPublicacao === 'rascunho'
                              ? 'modal-form-comunicado__radio-circle--active'
                              : ''
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="modal-form-comunicado__option-name">
                        Salvar Rascunho
                      </span>
                      <p className="modal-form-comunicado__option-desc">
                        Armazenado com segurança para revisão prévia.
                      </p>
                    </label>
                  </div>

                  {/* Painel Contextual Integrado de Datas & Vigência */}
                  <div className="modal-form-comunicado__contextual-panel">
                    {/* Cenário A: Publicação Imediata */}
                    {tipoPublicacao === 'imediato' && (
                      <div className="modal-form-comunicado__imediato-panel">
                        <div className="modal-form-comunicado__validity-row">
                          <span className="modal-form-comunicado__validity-label">
                            Duração da Exibição:
                          </span>
                          <div
                            className="modal-form-comunicado__pill-group"
                            role="radiogroup"
                            aria-label="Duração da exibição da notícia"
                          >
                            <button
                              type="button"
                              role="radio"
                              aria-checked={!temEncerramento}
                              className={`modal-form-comunicado__pill-btn ${
                                !temEncerramento
                                  ? 'modal-form-comunicado__pill-btn--active'
                                  : ''
                              }`}
                              onClick={() => {
                                setTemEncerramento(false)
                                setFormExpiraEm('')
                                setErrosValidacao((prev) => ({
                                  ...prev,
                                  expira_em: null,
                                }))
                              }}
                              disabled={enviando}
                            >
                              Prazo Indeterminado
                            </button>
                            <button
                              type="button"
                              role="radio"
                              aria-checked={temEncerramento}
                              className={`modal-form-comunicado__pill-btn ${
                                temEncerramento
                                  ? 'modal-form-comunicado__pill-btn--active'
                                  : ''
                              }`}
                              onClick={() => setTemEncerramento(true)}
                              disabled={enviando}
                            >
                              Período Determinado
                            </button>
                          </div>
                        </div>

                        {temEncerramento ? (
                          <div className="modal-form-comunicado__expiration-field">
                            <label
                              htmlFor="form-expira-em"
                              className="modal-form-comunicado__label"
                            >
                              Data e Horário de Encerramento (Término){' '}
                              <span className="modal-form-comunicado__required">
                                *
                              </span>
                            </label>
                            <MiniCalendarPicker
                              id="form-expira-em"
                              name="expira_em"
                              value={formExpiraEm}
                              onChange={(novoValor) => {
                                setFormExpiraEm(novoValor)
                                if (novoValor) {
                                  const expiraJaSalvo =
                                    modoForm === 'editar' &&
                                    comunicadoEditando?.expira_em &&
                                    novoValor === paraInputDatetimeLocal(comunicadoEditando.expira_em)
                                  const checagem = validarDataCoerente(novoValor, {
                                    permitirPassado: Boolean(expiraJaSalvo),
                                    nomeCampo: 'A data de encerramento',
                                  })
                                  setErrosValidacao((prev) => ({
                                    ...prev,
                                    expira_em: checagem.valido ? null : checagem.erro,
                                  }))
                                } else {
                                  setErrosValidacao((prev) => ({
                                    ...prev,
                                    expira_em: null,
                                  }))
                                }
                              }}
                              min={
                                modoForm === 'editar' &&
                                comunicadoEditando?.expira_em &&
                                formExpiraEm === paraInputDatetimeLocal(comunicadoEditando.expira_em)
                                  ? undefined
                                  : agoraInputLocal
                              }
                              error={Boolean(errosValidacao.expira_em)}
                              disabled={enviando}
                              required
                            />
                            {errosValidacao.expira_em ? (
                              <span
                                className="modal-form-comunicado__error-msg"
                                role="alert"
                              >
                                {errosValidacao.expira_em}
                              </span>
                            ) : (
                              <span className="modal-form-comunicado__hint">
                                A notícia deixa de aparecer automaticamente aos estudantes ao atingir este horário.
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="modal-form-comunicado__quiet-hint">
                            A notícia permanecerá no portal continuamente até uma ação manual da coordenação.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Cenário B: Publicação Programada */}
                    {tipoPublicacao === 'programado' && (
                      <div className="modal-form-comunicado__schedule-grid">
                        <div className="modal-form-comunicado__field">
                          <label
                            htmlFor="form-inicio-em"
                            className="modal-form-comunicado__label"
                          >
                            Data e Horário de Início (Liberação){' '}
                            <span className="modal-form-comunicado__required">
                              *
                            </span>
                          </label>
                          <MiniCalendarPicker
                            id="form-inicio-em"
                            name="inicio_em"
                            value={formInicioEm}
                            onChange={(novoValor) => {
                              setFormInicioEm(novoValor)
                              if (novoValor) {
                                const inicioJaSalvo =
                                  modoForm === 'editar' &&
                                  comunicadoEditando?.inicio_em &&
                                  novoValor === paraInputDatetimeLocal(comunicadoEditando.inicio_em)
                                const checagem = validarDataCoerente(novoValor, {
                                  permitirPassado: Boolean(inicioJaSalvo),
                                  nomeCampo: 'A data de início',
                                })
                                setErrosValidacao((prev) => {
                                  const erros = {
                                    ...prev,
                                    inicio_em: checagem.valido ? null : checagem.erro,
                                  }
                                  if (formExpiraEm) {
                                    const expiraJaSalvo =
                                      modoForm === 'editar' &&
                                      comunicadoEditando?.expira_em &&
                                      formExpiraEm === paraInputDatetimeLocal(comunicadoEditando.expira_em)
                                    const checagemFim = validarDataCoerente(formExpiraEm, {
                                      permitirPassado: Boolean(expiraJaSalvo),
                                      minData: novoValor,
                                      nomeCampo: 'A data de encerramento',
                                    })
                                    erros.expira_em = checagemFim.valido ? null : checagemFim.erro
                                  }
                                  return erros
                                })
                              } else {
                                setErrosValidacao((prev) => ({
                                  ...prev,
                                  inicio_em: null,
                                }))
                              }
                            }}
                            min={
                              modoForm === 'editar' &&
                              comunicadoEditando?.inicio_em &&
                              formInicioEm === paraInputDatetimeLocal(comunicadoEditando.inicio_em)
                                ? undefined
                                : agoraInputLocal
                            }
                            error={Boolean(errosValidacao.inicio_em)}
                            disabled={enviando}
                            required
                          />
                          {errosValidacao.inicio_em ? (
                            <span
                              className="modal-form-comunicado__error-msg"
                              role="alert"
                            >
                              {errosValidacao.inicio_em}
                            </span>
                          ) : (
                            <span className="modal-form-comunicado__hint">
                              Liberação automática no portal a partir deste horário.
                            </span>
                          )}
                        </div>

                        <div className="modal-form-comunicado__field">
                          <label
                            htmlFor="form-expira-em"
                            className="modal-form-comunicado__label"
                          >
                            Data e Horário de Término{' '}
                            <span className="modal-form-comunicado__optional">
                              (Opcional)
                            </span>
                          </label>
                          <MiniCalendarPicker
                            id="form-expira-em"
                            name="expira_em"
                            value={formExpiraEm}
                            onChange={(novoValor) => {
                              setFormExpiraEm(novoValor)
                              setTemEncerramento(Boolean(novoValor))
                              if (novoValor) {
                                const expiraJaSalvo =
                                  modoForm === 'editar' &&
                                  comunicadoEditando?.expira_em &&
                                  novoValor === paraInputDatetimeLocal(comunicadoEditando.expira_em)
                                const checagem = validarDataCoerente(novoValor, {
                                  permitirPassado: Boolean(expiraJaSalvo),
                                  minData: formInicioEm || null,
                                  nomeCampo: 'A data de término',
                                })
                                setErrosValidacao((prev) => ({
                                  ...prev,
                                  expira_em: checagem.valido ? null : checagem.erro,
                                }))
                              } else {
                                setErrosValidacao((prev) => ({
                                  ...prev,
                                  expira_em: null,
                                }))
                              }
                            }}
                            min={
                              formInicioEm ||
                              (modoForm === 'editar' &&
                              comunicadoEditando?.expira_em &&
                              formExpiraEm === paraInputDatetimeLocal(comunicadoEditando.expira_em)
                                ? undefined
                                : agoraInputLocal)
                            }
                            error={Boolean(errosValidacao.expira_em)}
                            disabled={enviando}
                          />
                          {errosValidacao.expira_em ? (
                            <span
                              className="modal-form-comunicado__error-msg"
                              role="alert"
                            >
                              {errosValidacao.expira_em}
                            </span>
                          ) : (
                            <span className="modal-form-comunicado__hint">
                              Deixe em branco para prazo indeterminado.
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cenário C: Salvar como Rascunho */}
                    {tipoPublicacao === 'rascunho' && (
                      <p className="modal-form-comunicado__quiet-hint">
                        Este comunicado será salvo de forma privada na aba <strong>Rascunhos</strong> e não ficará visível publicamente no portal.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Rodapé da Modal com Ações */}
              <div className="modal-form-comunicado__footer">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={fecharModalForm}
                  disabled={enviando}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={enviando}
                >
                  {enviando ? (
                    modoForm === 'editar' ? (
                      'Salvando alterações...'
                    ) : tipoPublicacao === 'rascunho' ? (
                      'Salvando Rascunho...'
                    ) : (
                      'Publicando...'
                    )
                  ) : modoForm === 'editar' ? (
                    <>
                      <CheckCircleIcon size={16} aria-hidden="true" />
                      <span>Salvar Alterações</span>
                    </>
                  ) : tipoPublicacao === 'rascunho' ? (
                    <>
                      <FileTextIcon size={16} aria-hidden="true" />
                      <span>Salvar como Rascunho</span>
                    </>
                  ) : tipoPublicacao === 'programado' ? (
                    <>
                      <ClockIcon size={16} aria-hidden="true" />
                      <span>Programar Publicação</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon size={16} aria-hidden="true" />
                      <span>Publicar Comunicado Agora</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* ============================================================
               ABA 2: Pré-visualização em Tempo Real (Live Preview)
               ============================================================ */
            <div className="modal-form-comunicado__preview-tab">
              <div className="modal-form-comunicado__preview-intro">
                <EyeIcon size={16} aria-hidden="true" />
                <span>
                  Simulação em tempo real de como este comunicado aparecerá no
                  portal do estudante com os dados preenchidos até o momento.
                </span>
              </div>

              {/* Pré-visualização 1: Card na Página Inicial */}
              <div className="modal-form-comunicado__preview-card-wrap">
                <span className="modal-form-comunicado__preview-card-tag">
                  Visualização no Card da Página Inicial
                </span>

                <article className="modal-form-comunicado__simulated-news-card">
                  <DateTile
                    day={dataPreview.dia}
                    month={dataPreview.mes}
                    variant="soft"
                    size="sm"
                  />

                  <div className="modal-form-comunicado__simulated-content">
                    <h4 className="modal-form-comunicado__simulated-title">
                      {formTitulo.trim() || 'Título do Comunicado Acadêmico'}
                    </h4>
                    <p className="modal-form-comunicado__simulated-summary">
                      {formResumo.trim() ||
                        'Resumo breve da notícia que será apresentado aos alunos no feed de comunicados da Página Inicial.'}
                    </p>
                  </div>

                  <div
                    className="modal-form-comunicado__simulated-arrow"
                    aria-hidden="true"
                  >
                    <ChevronRightIcon size={16} />
                  </div>
                </article>
              </div>

              {/* Pré-visualização 2: Leitura Completa */}
              <div className="modal-form-comunicado__preview-card-wrap">
                <span className="modal-form-comunicado__preview-card-tag">
                  Visualização na Modal de Leitura Completa
                </span>

                <div className="modal-form-comunicado__simulated-full-view">
                  <div className="modal-form-comunicado__simulated-full-meta">
                    <span className="modal-form-comunicado__simulated-date">
                      <CalendarIcon size={14} aria-hidden="true" />
                      <span>
                        {tipoPublicacao === 'programado' && formInicioEm
                          ? formatarDataHora(formInicioEm)
                          : formatarDataHora(new Date().toISOString())}
                      </span>
                    </span>

                    {tipoPublicacao === 'rascunho' ? (
                      <Badge variant="soft" size="sm">
                        Rascunho
                      </Badge>
                    ) : tipoPublicacao === 'programado' ? (
                      <Badge variant="primary" size="sm">
                        Programado
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Publicado
                      </Badge>
                    )}
                  </div>

                  <h3 className="modal-form-comunicado__simulated-full-title">
                    {formTitulo.trim() || 'Título do Comunicado'}
                  </h3>

                  <div className="modal-form-comunicado__simulated-summary-box">
                    <strong>Resumo:</strong>
                    <p>
                      {formResumo.trim() ||
                        'O resumo aparecerá destacado nesta caixa introdutória.'}
                    </p>
                  </div>

                  <div className="modal-form-comunicado__simulated-body">
                    <strong>Conteúdo completo:</strong>
                    <div className="modal-form-comunicado__simulated-body-text">
                      {formCorpo.trim() ||
                        'O texto integral do comunicado será exibido aqui, formatado com quebras de linha e estrutura limpa.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações no preview */}
              <div className="modal-form-comunicado__preview-footer">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setAbaAtivaForm('formulario')}
                >
                  <EditIcon size={15} aria-hidden="true" />
                  <span>Voltar para o Formulário</span>
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSubmitForm}
                  disabled={enviando}
                >
                  {enviando ? (
                    'Processando...'
                  ) : (
                    <>
                      <CheckCircleIcon size={16} aria-hidden="true" />
                      <span>
                        {modoForm === 'editar'
                          ? 'Salvar Alterações'
                          : tipoPublicacao === 'rascunho'
                            ? 'Salvar Rascunho'
                            : 'Publicar Notícia'}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ====================================================================
          E. Modal de Confirmação de Exclusão
          ==================================================================== */}
      {comunicadoExcluindo && (
        <Modal
          isOpen={Boolean(comunicadoExcluindo)}
          onClose={() => {
            if (!excluindoEmAndamento) {
              setComunicadoExcluindo(null)
              setErroExclusao(null)
            }
          }}
          title="Confirmar Exclusão de Comunicado"
          className="modal-exclusao-comunicado"
        >
          <div className="modal-exclusao-comunicado__content">
            {erroExclusao ? (
              <div
                className="gerenciamento-noticias__form-alert"
                role="alert"
              >
                <strong>Falha na exclusão:</strong> {erroExclusao}
              </div>
            ) : (
              <p className="modal-exclusao-comunicado__text">
                Tem certeza de que deseja excluir permanentemente o comunicado{' '}
                <strong>&ldquo;{comunicadoExcluindo.titulo}&rdquo;</strong>?
              </p>
            )}

            <div className="modal-exclusao-comunicado__preview-card">
              <span className="modal-exclusao-comunicado__preview-status">
                {renderBadgeStatus(comunicadoExcluindo)}
              </span>
              <h4 className="modal-exclusao-comunicado__preview-title">
                {comunicadoExcluindo.titulo}
              </h4>
              <p className="modal-exclusao-comunicado__preview-summary">
                {comunicadoExcluindo.resumo}
              </p>
            </div>

            <p className="modal-exclusao-comunicado__warning">
              Esta ação é definitiva e removerá o comunicado das listagens institucionais.
            </p>

            <div className="modal-exclusao-comunicado__footer">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setComunicadoExcluindo(null)
                  setErroExclusao(null)
                }}
                disabled={excluindoEmAndamento}
              >
                Cancelar
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleConfirmarExclusao}
                disabled={excluindoEmAndamento}
                className="modal-exclusao-comunicado__btn-confirmar"
              >
                {excluindoEmAndamento ? (
                  'Excluindo...'
                ) : (
                  <>
                    <TrashIcon size={16} aria-hidden="true" />
                    <span>Confirmar Exclusão</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ====================================================================
          F. Modal de Detalhes e Leitura do Comunicado
          ==================================================================== */}
      <ModalDetalhesComunicado
        comunicado={comunicadoVisualizando}
        isOpen={Boolean(comunicadoVisualizando)}
        onClose={() => setComunicadoVisualizando(null)}
        ehAdmin={true}
        onEditar={(item) => {
          setComunicadoVisualizando(null)
          abrirModalEdicao(item)
        }}
        onExcluir={(item) => {
          setComunicadoVisualizando(null)
          setErroExclusao(null)
          setComunicadoExcluindo(item)
        }}
      />
    </div>
  )
}

export default GerenciamentoNoticias
