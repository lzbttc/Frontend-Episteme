import { useState, useEffect, useCallback, useMemo } from 'react'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Button from '../../components/Button/Button'
import Badge from '../../components/Badge/Badge'
import Input from '../../components/Input/Input'
import Modal from '../../components/Modal/Modal'
import {
  MegaphoneIcon,
  FileTextIcon,
  CheckCircleIcon,
  SearchIcon,
  CalendarIcon,
  EyeIcon,
} from '../../components/icons'
import { PATHS } from '../../routes/paths'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  listarComunicados,
  criarComunicado,
} from '../../services/comunicadoService'
import { ErroApi } from '../../services/apiClient'
import './GerenciamentoNoticias.css'

function formatarDataHora(valor) {
  if (!valor) return 'Data não informada'
  try {
    const data = new Date(valor.includes('T') ? valor : `${valor}T00:00:00`)
    if (Number.isNaN(data.getTime())) return valor
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data)
  } catch {
    return valor
  }
}

function GerenciamentoNoticias() {
  usePageTitle('Gerenciamento de Notícias')

  // Estado da listagem
  const [comunicados, setComunicados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroListagem, setErroListagem] = useState(null)

  // Filtros e busca
  const [filtroStatus, setFiltroStatus] = useState('todos') // 'todos' | 'publicados' | 'rascunhos'
  const [termoBusca, setTermoBusca] = useState('')

  // Modais
  const [modalCadastroAberta, setModalCadastroAberta] = useState(false)
  const [comunicadoVisualizando, setComunicadoVisualizando] = useState(null)

  // Formulário de cadastro
  const [formTitulo, setFormTitulo] = useState('')
  const [formResumo, setFormResumo] = useState('')
  const [formCorpo, setFormCorpo] = useState('')
  const [formPublicado, setFormPublicado] = useState(true) // Padrão: publicado = true

  // Validação e envio
  const [errosValidacao, setErrosValidacao] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState(null)
  const [mensagemSucesso, setMensagemSucesso] = useState(null)

  // Carrega comunicados da API
  const carregarLista = useCallback(async () => {
    setCarregando(true)
    setErroListagem(null)
    try {
      const lista = await listarComunicados({
        limite: 50,
        incluirRascunhos: true,
      })
      setComunicados(lista)
    } catch (err) {
      if (err instanceof ErroApi && err.status === 403) {
        setErroListagem(
          'Permissão negada. Você não possui autorização para consultar esta área.'
        )
      } else {
        setErroListagem(
          err.message || 'Não foi possível carregar os comunicados.'
        )
      }
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true

    listarComunicados({ limite: 50, incluirRascunhos: true })
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
              'Permissão negada. Você não possui autorização para consultar esta área.'
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
  }, [])

  // Fecha mensagem de sucesso automaticamente após 5 segundos
  useEffect(() => {
    if (!mensagemSucesso) return
    const timer = setTimeout(() => {
      setMensagemSucesso(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [mensagemSucesso])

  // Abertura da modal de cadastro limpa os erros mas preserva dados se reaberta
  function abrirModalCadastro() {
    setErrosValidacao({})
    setErroEnvio(null)
    setModalCadastroAberta(true)
  }

  function fecharModalCadastro() {
    setModalCadastroAberta(false)
    setErrosValidacao({})
    setErroEnvio(null)
  }

  // Validação rigorosa dos campos
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

    setErrosValidacao(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // Envio do formulário
  async function handleSubmitCadastro(e) {
    e.preventDefault()
    setErroEnvio(null)

    if (!validarFormulario()) {
      return
    }

    setEnviando(true)

    try {
      const novoComunicado = await criarComunicado({
        titulo: formTitulo.trim(),
        resumo: formResumo.trim(),
        corpo: formCorpo.trim(),
        publicado: formPublicado,
      })

      // Atualiza a listagem localmente sem exigir recarregar a página
      setComunicados((anteriores) => {
        const existe = anteriores.some((c) => c.id === novoComunicado.id)
        if (existe) return anteriores
        return [novoComunicado, ...anteriores]
      })

      // Limpa formulário após sucesso
      setFormTitulo('')
      setFormResumo('')
      setFormCorpo('')
      setFormPublicado(true)
      setErrosValidacao({})
      fecharModalCadastro()

      setMensagemSucesso(
        formPublicado
          ? 'Comunicado publicado com sucesso para toda a comunidade!'
          : 'Comunicado salvo como rascunho com sucesso!'
      )
    } catch (err) {
      if (err instanceof ErroApi && err.status === 403) {
        setErroEnvio(
          'Acesso negado: apenas administradores podem cadastrar e publicar comunicados.'
        )
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

  // Filtragem e busca dos comunicados
  const comunicadosFiltrados = useMemo(() => {
    let lista = [...comunicados]

    // Filtro por status
    if (filtroStatus === 'publicados') {
      lista = lista.filter((c) => c.publicado === true)
    } else if (filtroStatus === 'rascunhos') {
      lista = lista.filter((c) => c.publicado === false)
    }

    // Busca por título ou resumo
    if (termoBusca.trim()) {
      const termoNormalizado = termoBusca.toLowerCase().trim()
      lista = lista.filter((c) => {
        const tit = (c.titulo || '').toLowerCase()
        const res = (c.resumo || '').toLowerCase()
        return tit.includes(termoNormalizado) || res.includes(termoNormalizado)
      })
    }

    return lista
  }, [comunicados, filtroStatus, termoBusca])

  // Contagens para badges de filtro
  const totalPublicados = useMemo(
    () => comunicados.filter((c) => c.publicado === true).length,
    [comunicados]
  )
  const totalRascunhos = useMemo(
    () => comunicados.filter((c) => c.publicado === false).length,
    [comunicados]
  )

  return (
    <div className="gerenciamento-noticias">
      {/* ====================================================================
          A. Cabeçalho (Breadcrumb, Título + Badge, Subtítulo e Ação)
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
              <Badge variant="primary" size="sm">
                Coordenação
              </Badge>
            </div>
            <p className="gerenciamento-noticias__subtitle">
              Cadastre, organize e publique comunicados e informes oficiais para
              toda a comunidade acadêmica.
            </p>
          </div>

          <div className="gerenciamento-noticias__header-action">
            <Button
              variant="primary"
              size="md"
              onClick={abrirModalCadastro}
              className="gerenciamento-noticias__btn-novo"
            >
              <MegaphoneIcon size={18} />
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
          <CheckCircleIcon size={20} />
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

      {/* Alerta de erro de carregamento */}
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
          B. Toolbar de Filtros e Busca
          ==================================================================== */}
      <section
        className="gerenciamento-noticias__toolbar"
        aria-label="Controles de filtragem e pesquisa"
      >
        <div className="gerenciamento-noticias__filters">
          <button
            type="button"
            className={`gerenciamento-noticias__filter-btn ${
              filtroStatus === 'todos'
                ? 'gerenciamento-noticias__filter-btn--active'
                : ''
            }`}
            onClick={() => setFiltroStatus('todos')}
          >
            Todos
            <span className="gerenciamento-noticias__filter-count">
              {comunicados.length}
            </span>
          </button>

          <button
            type="button"
            className={`gerenciamento-noticias__filter-btn ${
              filtroStatus === 'publicados'
                ? 'gerenciamento-noticias__filter-btn--active'
                : ''
            }`}
            onClick={() => setFiltroStatus('publicados')}
          >
            Publicados
            <span className="gerenciamento-noticias__filter-count">
              {totalPublicados}
            </span>
          </button>

          <button
            type="button"
            className={`gerenciamento-noticias__filter-btn ${
              filtroStatus === 'rascunhos'
                ? 'gerenciamento-noticias__filter-btn--active'
                : ''
            }`}
            onClick={() => setFiltroStatus('rascunhos')}
          >
            Rascunhos
            <span className="gerenciamento-noticias__filter-count">
              {totalRascunhos}
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
            placeholder="Buscar por título ou resumo..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            aria-label="Buscar comunicados por título ou resumo"
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
                : 'Ainda não existem notícias ou comunicados cadastrados.'}
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
              <Button variant="primary" size="md" onClick={abrirModalCadastro}>
                Cadastrar primeiro comunicado
              </Button>
            )}
          </div>
        ) : (
          /* Lista compacta de comunicados */
          <div className="gerenciamento-noticias__list" role="list">
            {comunicadosFiltrados.map((item) => (
              <article
                key={item.id}
                className={`gerenciamento-noticias__card ${
                  !item.publicado ? 'gerenciamento-noticias__card--draft' : ''
                }`}
                role="listitem"
              >
                <div className="gerenciamento-noticias__card-main">
                  <div className="gerenciamento-noticias__card-meta">
                    <span className="gerenciamento-noticias__card-date">
                      <CalendarIcon size={14} aria-hidden="true" />
                      <time dateTime={item.publicado_em}>
                        {formatarDataHora(item.publicado_em)}
                      </time>
                    </span>

                    {item.publicado ? (
                      <Badge variant="success" size="sm">
                        Publicado
                      </Badge>
                    ) : (
                      <Badge variant="soft" size="sm">
                        Rascunho
                      </Badge>
                    )}
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
                  >
                    <EyeIcon size={16} />
                    <span>Visualizar</span>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ====================================================================
          D. Modal de Cadastro de Comunicado (Com opção Publicar / Rascunho)
          ==================================================================== */}
      <Modal
        isOpen={modalCadastroAberta}
        onClose={fecharModalCadastro}
        title="Cadastrar Novo Comunicado"
        className="modal-cadastro-comunicado"
      >
        <form
          onSubmit={handleSubmitCadastro}
          className="modal-cadastro-comunicado__form"
          noValidate
        >
          {erroEnvio && (
            <div className="gerenciamento-noticias__form-alert" role="alert">
              {erroEnvio}
            </div>
          )}

          {/* Campo Título */}
          <div className="modal-cadastro-comunicado__field">
            <label
              htmlFor="form-titulo"
              className="modal-cadastro-comunicado__label"
            >
              Título da Notícia ou Comunicado{' '}
              <span className="modal-cadastro-comunicado__required">*</span>
            </label>
            <Input
              id="form-titulo"
              name="titulo"
              placeholder="Ex.: Período de matrículas e ajustes 2026.2 aberto"
              value={formTitulo}
              onChange={(e) => {
                setFormTitulo(e.target.value)
                if (errosValidacao.titulo) {
                  setErrosValidacao((prev) => ({ ...prev, titulo: null }))
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
                className="modal-cadastro-comunicado__error-msg"
                role="alert"
              >
                {errosValidacao.titulo}
              </span>
            )}
          </div>

          {/* Campo Resumo */}
          <div className="modal-cadastro-comunicado__field">
            <label
              htmlFor="form-resumo"
              className="modal-cadastro-comunicado__label"
            >
              Resumo Breve{' '}
              <span className="modal-cadastro-comunicado__required">*</span>
            </label>
            <span className="modal-cadastro-comunicado__hint">
              Apresentação concisa que aparece nos cards da Página Inicial e
              notificações.
            </span>
            <Input
              id="form-resumo"
              name="resumo"
              placeholder="Ex.: O processo de ajustes e inclusão de disciplinas está disponível até 22 de setembro."
              value={formResumo}
              onChange={(e) => {
                setFormResumo(e.target.value)
                if (errosValidacao.resumo) {
                  setErrosValidacao((prev) => ({ ...prev, resumo: null }))
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
                className="modal-cadastro-comunicado__error-msg"
                role="alert"
              >
                {errosValidacao.resumo}
              </span>
            )}
          </div>

          {/* Campo Corpo */}
          <div className="modal-cadastro-comunicado__field">
            <label
              htmlFor="form-corpo"
              className="modal-cadastro-comunicado__label"
            >
              Corpo Completo da Notícia{' '}
              <span className="modal-cadastro-comunicado__required">*</span>
            </label>
            <span className="modal-cadastro-comunicado__hint">
              Texto completo com prazos, regulamento e instruções detalhadas.
            </span>
            <textarea
              id="form-corpo"
              name="corpo"
              rows={6}
              className={`modal-cadastro-comunicado__textarea ${
                errosValidacao.corpo
                  ? 'modal-cadastro-comunicado__textarea--error'
                  : ''
              }`}
              placeholder="Digite o texto detalhado do comunicado para a comunidade acadêmica..."
              value={formCorpo}
              onChange={(e) => {
                setFormCorpo(e.target.value)
                if (errosValidacao.corpo) {
                  setErrosValidacao((prev) => ({ ...prev, corpo: null }))
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
                className="modal-cadastro-comunicado__error-msg"
                role="alert"
              >
                {errosValidacao.corpo}
              </span>
            )}
          </div>

          {/* Seletor Explícito: Publicar vs Rascunho (Requirement 4.4) */}
          <div className="modal-cadastro-comunicado__field">
            <label className="modal-cadastro-comunicado__label">
              Opção de Publicação
            </label>
            <span className="modal-cadastro-comunicado__hint">
              Defina se a notícia deve ficar pública imediatamente ou se ficará
              guardada como rascunho.
            </span>

            <div
              className="modal-cadastro-comunicado__publication-options"
              role="radiogroup"
              aria-label="Opção de publicação do comunicado"
            >
              <label
                className={`modal-cadastro-comunicado__option-card ${
                  formPublicado
                    ? 'modal-cadastro-comunicado__option-card--active'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="publicado"
                  checked={formPublicado === true}
                  onChange={() => setFormPublicado(true)}
                  disabled={enviando}
                />
                <div className="modal-cadastro-comunicado__option-text">
                  <div className="modal-cadastro-comunicado__option-title">
                    <span>Publicar Imediatamente</span>
                    <Badge variant="success" size="sm">
                      Público
                    </Badge>
                  </div>
                  <p className="modal-cadastro-comunicado__option-desc">
                    O comunicado será disponibilizado publicamente para alunos e
                    professores no portal.
                  </p>
                </div>
              </label>

              <label
                className={`modal-cadastro-comunicado__option-card ${
                  !formPublicado
                    ? 'modal-cadastro-comunicado__option-card--active'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="publicado"
                  checked={formPublicado === false}
                  onChange={() => setFormPublicado(false)}
                  disabled={enviando}
                />
                <div className="modal-cadastro-comunicado__option-text">
                  <div className="modal-cadastro-comunicado__option-title">
                    <span>Salvar como Rascunho</span>
                    <Badge variant="soft" size="sm">
                      Rascunho
                    </Badge>
                  </div>
                  <p className="modal-cadastro-comunicado__option-desc">
                    O comunicado não ficará visível publicamente e poderá ser
                    revisado pela coordenação.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Rodapé da Modal com Ações */}
          <div className="modal-cadastro-comunicado__footer">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={fecharModalCadastro}
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
                formPublicado ? (
                  'Publicando...'
                ) : (
                  'Salvando Rascunho...'
                )
              ) : formPublicado ? (
                <>
                  <CheckCircleIcon size={16} />
                  <span>Publicar Comunicado</span>
                </>
              ) : (
                <>
                  <FileTextIcon size={16} />
                  <span>Salvar como Rascunho</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ====================================================================
          E. Modal de Detalhes e Leitura do Comunicado
          ==================================================================== */}
      {comunicadoVisualizando && (
        <Modal
          isOpen={Boolean(comunicadoVisualizando)}
          onClose={() => setComunicadoVisualizando(null)}
          title="Detalhes do Comunicado"
          className="modal-detalhes-comunicado"
        >
          <div className="modal-detalhes-comunicado__content">
            <div className="modal-detalhes-comunicado__header">
              <span className="modal-detalhes-comunicado__date">
                <CalendarIcon size={14} aria-hidden="true" />
                {formatarDataHora(comunicadoVisualizando.publicado_em)}
              </span>

              {comunicadoVisualizando.publicado ? (
                <Badge variant="success" size="sm">
                  Publicado
                </Badge>
              ) : (
                <Badge variant="soft" size="sm">
                  Rascunho
                </Badge>
              )}
            </div>

            <h2 className="modal-detalhes-comunicado__title">
              {comunicadoVisualizando.titulo}
            </h2>

            <div className="modal-detalhes-comunicado__summary-box">
              <strong>Resumo:</strong>
              <p>{comunicadoVisualizando.resumo}</p>
            </div>

            <div className="modal-detalhes-comunicado__body">
              <strong>Conteúdo completo:</strong>
              <div className="modal-detalhes-comunicado__text">
                {comunicadoVisualizando.corpo}
              </div>
            </div>

            <div className="modal-detalhes-comunicado__footer">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setComunicadoVisualizando(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default GerenciamentoNoticias
