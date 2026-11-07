import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import { PATHS } from '../../routes/paths'
import Accordion from '../../components/Accordion/Accordion'
import Badge from '../../components/Badge/Badge'
import Button from '../../components/Button/Button'
import {
  AcademicCapIcon,
  BellIcon,
  BookOpenIcon,
  CalendarIcon,
  ChevronRightSmallIcon,
  HelpCircleIcon,
  MegaphoneIcon,
  SearchIcon,
  SearchSlashIcon,
  UserIcon,
} from '../../components/icons'
import {
  CATEGORIAS_AJUDA,
  ORIENTACOES_AJUDA,
  FAQS_AJUDA,
  PERFIS,
  PERFIS_LABELS,
} from '../../mocks/centralAjudaData'
import { identificarPerfilAutenticado } from '../../services/ajudaService'
import './CentralAjuda.css'

const SUBTITULOS_POR_PERFIL = {
  [PERFIS.ALUNO]:
    'Orientações sobre matrícula, turmas virtuais, horários e dúvidas frequentes do estudante.',
  [PERFIS.PROFESSOR]:
    'Orientações sobre gerenciamento de turmas, diários eletrônicos, horários e rotinas docentes.',
  [PERFIS.COORDENACAO]:
    'Orientações sobre gestão acadêmica, deferimento de matrículas, turmas e ensalamento.',
}

function obterIconeCategoria(iconeNome, size = 16) {
  switch (iconeNome) {
    case 'user':
      return <UserIcon size={size} />
    case 'academic':
      return <AcademicCapIcon size={size} />
    case 'book':
      return <BookOpenIcon size={size} />
    case 'calendar':
      return <CalendarIcon size={size} />
    case 'megaphone':
      return <MegaphoneIcon size={size} />
    case 'bell':
      return <BellIcon size={size} />
    default:
      return <HelpCircleIcon size={size} />
  }
}

function normalizarTexto(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function CentralAjuda() {
  usePageTitle('Central de Ajuda')
  const { aluno, token } = useAuth()

  // Perfil autenticado exclusivo do usuário logado
  const perfilAutenticado = useMemo(
    () => identificarPerfilAutenticado(aluno, token),
    [aluno, token]
  )

  // Estados principais
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas')
  const [termoBusca, setTermoBusca] = useState('')
  const [openFaqIds, setOpenFaqIds] = useState([])

  // Alterna FAQ individual
  const handleToggleFaq = useCallback((id) => {
    setOpenFaqIds((atuais) =>
      atuais.includes(id)
        ? atuais.filter((item) => item !== id)
        : [...atuais, id]
    )
  }, [])

  // Limpa a busca
  const handleLimparBusca = useCallback(() => {
    setTermoBusca('')
  }, [])

  // Redefine busca e categoria
  const handleResetFiltros = useCallback(() => {
    setTermoBusca('')
    setCategoriaAtiva('todas')
  }, [])

  // Categoria atual selecionada (quando não for 'todas')
  const categoriaAtualObj = useMemo(() => {
    return CATEGORIAS_AJUDA.find((c) => c.id === categoriaAtiva) || null
  }, [categoriaAtiva])

  // Guia de Uso: exibido APENAS quando uma categoria específica estiver selecionada
  const orientacaoAtiva = useMemo(() => {
    if (categoriaAtiva === 'todas') return null

    const ori = ORIENTACOES_AJUDA.find(
      (item) =>
        item.categoriaId === categoriaAtiva &&
        item.perfis.includes(perfilAutenticado)
    )

    if (!ori) return null

    // Se houver busca ativa, só exibe o guia se ele corresponder aos termos
    if (termoBusca.trim()) {
      const termo = normalizarTexto(termoBusca)
      const matchTitulo = normalizarTexto(ori.titulo).includes(termo)
      const matchResumo = normalizarTexto(ori.resumo).includes(termo)
      const matchPassos = ori.passos?.some((p) =>
        normalizarTexto(p).includes(termo)
      )
      const matchTags = ori.tags?.some((t) =>
        normalizarTexto(t).includes(termo)
      )
      if (!matchTitulo && !matchResumo && !matchPassos && !matchTags) {
        return null
      }
    }

    return ori
  }, [categoriaAtiva, perfilAutenticado, termoBusca])

  // Todas as FAQs filtradas pela categoria e busca (pertinentes ao perfil + gerais)
  const faqsFiltradas = useMemo(() => {
    let lista = FAQS_AJUDA.filter(
      (faq) => faq.perfis.includes(perfilAutenticado) || faq.perfis.length >= 2
    )

    if (categoriaAtiva !== 'todas') {
      lista = lista.filter((faq) => faq.categoriaId === categoriaAtiva)
    }

    if (termoBusca.trim()) {
      const termo = normalizarTexto(termoBusca)
      lista = lista.filter((faq) => {
        const matchPergunta = normalizarTexto(faq.pergunta).includes(termo)
        const matchResposta = normalizarTexto(faq.resposta).includes(termo)
        const matchTags = faq.tags?.some((t) =>
          normalizarTexto(t).includes(termo)
        )
        return matchPergunta || matchResposta || matchTags
      })
    }

    return lista
  }, [categoriaAtiva, perfilAutenticado, termoBusca])

  // Separação em dois grupos: Prioritárias para o perfil e Gerais
  const { faqsPrioritarias, faqsGerais } = useMemo(() => {
    const prioritarias = []
    const gerais = []

    faqsFiltradas.forEach((faq) => {
      // Pergunta prioritária: explicitamente direcionada ao perfil do usuário
      const ehEspecificoDoPerfil =
        faq.perfis.includes(perfilAutenticado) && faq.perfis.length < 3

      if (ehEspecificoDoPerfil) {
        prioritarias.push(faq)
      } else {
        gerais.push(faq)
      }
    })

    return { faqsPrioritarias: prioritarias, faqsGerais: gerais }
  }, [faqsFiltradas, perfilAutenticado])

  // Ações de expandir e recolher todos os FAQs
  const handleExpandirTodos = useCallback(() => {
    setOpenFaqIds(faqsFiltradas.map((f) => f.id))
  }, [faqsFiltradas])

  const handleRecolherTodos = useCallback(() => {
    setOpenFaqIds([])
  }, [])

  // Helper para criar itens de acordeão sem repetição do selo "Destaque Aluno"
  const mapearFaqParaAcordeao = useCallback(
    (faq, ehPrioritaria) => {
      const categoria = CATEGORIAS_AJUDA.find((c) => c.id === faq.categoriaId)

      return {
        id: faq.id,
        title: faq.pergunta,
        highlighted: ehPrioritaria,
        badge:
          categoriaAtiva === 'todas' && categoria ? (
            <span className="central-ajuda__faq-badges">
              <Badge variant="soft" size="sm">
                {categoria.nome}
              </Badge>
            </span>
          ) : null,
        content: (
          <div className="central-ajuda__faq-resposta">
            <p className="central-ajuda__faq-texto">{faq.resposta}</p>
            {faq.tags && faq.tags.length > 0 && (
              <div className="central-ajuda__faq-tags">
                <span className="central-ajuda__faq-tags-label">
                  Palavras-chave:
                </span>
                <div className="central-ajuda__faq-tags-list">
                  {faq.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="central-ajuda__tag-btn"
                      onClick={() => setTermoBusca(tag)}
                      title={`Buscar por "${tag}"`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      }
    },
    [categoriaAtiva]
  )

  const accordionItemsPrioritarias = useMemo(() => {
    return faqsPrioritarias.map((faq) => mapearFaqParaAcordeao(faq, true))
  }, [faqsPrioritarias, mapearFaqParaAcordeao])

  const accordionItemsGerais = useMemo(() => {
    return faqsGerais.map((faq) => mapearFaqParaAcordeao(faq, false))
  }, [faqsGerais, mapearFaqParaAcordeao])

  const totalFaqs = faqsFiltradas.length
  const totalResultados = totalFaqs + (orientacaoAtiva ? 1 : 0)

  return (
    <div className="central-ajuda">
      {/* ====================================================================
          A. Cabeçalho (Breadcrumb, Título + Perfil, Subtítulo e Busca)
          ==================================================================== */}
      <header className="central-ajuda__header-card">
        <nav
          className="central-ajuda__breadcrumb"
          aria-label="Navegação estrutural"
        >
          <Link
            to={PATHS.inicio}
            className="central-ajuda__breadcrumb-link"
            title="Voltar para a Página Inicial"
          >
            Portal Acadêmico
          </Link>
          <span className="central-ajuda__breadcrumb-sep" aria-hidden="true">
            <ChevronRightSmallIcon size={14} />
          </span>
          <span
            className="central-ajuda__breadcrumb-current"
            aria-current="page"
          >
            Central de Ajuda
          </span>
        </nav>

        <div className="central-ajuda__header-body">
          <div className="central-ajuda__header-title-area">
            <div className="central-ajuda__title-group">
              <h1 className="central-ajuda__title">Central de Ajuda</h1>
              <Badge
                variant="primary"
                size="sm"
                className="central-ajuda__role-badge"
              >
                {PERFIS_LABELS[perfilAutenticado]}
              </Badge>
            </div>
            <p className="central-ajuda__subtitle">
              {SUBTITULOS_POR_PERFIL[perfilAutenticado] ||
                'Orientações e respostas para as principais dúvidas do EPIS.'}
            </p>
          </div>

          {/* Campo de Busca (Unificado, sem duplo 'x') */}
          <div className="central-ajuda__search-container">
            <form
              className="central-ajuda__search-form"
              onSubmit={(e) => e.preventDefault()}
              role="search"
            >
              <label
                htmlFor="input-busca-ajuda"
                className="central-ajuda__sr-only"
              >
                Pesquisar na central de ajuda
              </label>
              <SearchIcon
                size={18}
                className="central-ajuda__search-icon"
                aria-hidden="true"
              />
              <input
                id="input-busca-ajuda"
                type="text"
                role="searchbox"
                className="central-ajuda__search-input"
                placeholder="Pesquisar por assunto ou palavra-chave..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
              {termoBusca && (
                <button
                  type="button"
                  className="central-ajuda__search-clear"
                  onClick={handleLimparBusca}
                  aria-label="Limpar pesquisa"
                  title="Limpar pesquisa"
                >
                  &times;
                </button>
              )}
            </form>
          </div>
        </div>
      </header>

      {/* ====================================================================
          B. Navegação por Categorias (Barra Horizontal Limpa)
          ==================================================================== */}
      <nav
        className="central-ajuda__nav-tabs"
        role="tablist"
        aria-label="Navegação por categorias de ajuda"
      >
        <button
          type="button"
          role="tab"
          id="tab-todas"
          aria-selected={categoriaAtiva === 'todas'}
          className={`central-ajuda__tab-btn ${
            categoriaAtiva === 'todas' ? 'central-ajuda__tab-btn--active' : ''
          }`}
          onClick={() => setCategoriaAtiva('todas')}
        >
          <HelpCircleIcon size={15} />
          <span>Todas</span>
        </button>

        {CATEGORIAS_AJUDA.map((cat) => {
          const isActive = categoriaAtiva === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              id={`tab-${cat.id}`}
              aria-selected={isActive}
              className={`central-ajuda__tab-btn ${
                isActive ? 'central-ajuda__tab-btn--active' : ''
              }`}
              onClick={() => setCategoriaAtiva(cat.id)}
            >
              {obterIconeCategoria(cat.icone, 15)}
              <span>{cat.nome}</span>
            </button>
          )
        })}
      </nav>

      {/* ====================================================================
          C. Barra de Ações e Informações (Toolbar Compacta e Limpa)
          ==================================================================== */}
      <section
        className="central-ajuda__toolbar"
        aria-label="Ações e informações dos resultados"
      >
        <div className="central-ajuda__toolbar-meta">
          <span className="central-ajuda__toolbar-count">
            {totalFaqs}{' '}
            {totalFaqs === 1 ? 'dúvida disponível' : 'dúvidas disponíveis'}
          </span>
        </div>

        {totalFaqs > 0 && (
          <div className="central-ajuda__toolbar-actions">
            <button
              type="button"
              className="central-ajuda__action-link"
              onClick={handleExpandirTodos}
            >
              Expandir todos
            </button>
            <span className="central-ajuda__action-sep" aria-hidden="true">
              |
            </span>
            <button
              type="button"
              className="central-ajuda__action-link"
              onClick={handleRecolherTodos}
            >
              Recolher todos
            </button>
          </div>
        )}
      </section>

      {/* Feedback de busca ativa */}
      {termoBusca && (
        <div className="central-ajuda__search-feedback" role="status">
          <span>
            Exibindo resultados para:{' '}
            <strong>&ldquo;{termoBusca}&rdquo;</strong> ({totalResultados}{' '}
            {totalResultados === 1 ? 'item' : 'itens'})
          </span>
          <button
            type="button"
            className="central-ajuda__search-feedback-clear"
            onClick={handleLimparBusca}
          >
            Limpar busca
          </button>
        </div>
      )}

      {/* Estado Vazio (Sem resultados encontrados) */}
      {totalResultados === 0 && (
        <section
          className="central-ajuda__empty-state"
          role="region"
          aria-label="Nenhum resultado encontrado"
        >
          <SearchSlashIcon
            size={40}
            className="central-ajuda__empty-icon"
            aria-hidden="true"
          />
          <h2 className="central-ajuda__empty-title">
            Nenhum conteúdo encontrado
          </h2>
          <p className="central-ajuda__empty-desc">
            Não encontramos dúvidas ou orientações para &ldquo;{termoBusca}
            &rdquo;. Verifique a ortografia ou redefina os filtros para ver
            todas as opções.
          </p>
          <Button variant="primary" size="md" onClick={handleResetFiltros}>
            Redefinir busca e filtros
          </Button>
        </section>
      )}

      {/* ====================================================================
          D. Guia de Uso (Exibido SOMENTE quando uma categoria específica estiver ativa)
          ==================================================================== */}
      {orientacaoAtiva && (
        <section
          className="central-ajuda__guide-section"
          aria-label="Orientações e Guia de Uso da Categoria"
        >
          <div className="central-ajuda__guide-card">
            <div className="central-ajuda__guide-header">
              <span className="central-ajuda__guide-kicker">
                Guia de Uso &bull; {categoriaAtualObj?.nome} &bull;{' '}
                {PERFIS_LABELS[perfilAutenticado]}
              </span>
              <h2 className="central-ajuda__guide-title">
                {orientacaoAtiva.titulo}
              </h2>
              <p className="central-ajuda__guide-summary">
                {orientacaoAtiva.resumo}
              </p>
            </div>

            <div className="central-ajuda__guide-steps-wrapper">
              <h3 className="central-ajuda__guide-steps-heading">
                Procedimento passo a passo:
              </h3>
              <ol className="central-ajuda__guide-steps">
                {orientacaoAtiva.passos.map((passo, idx) => (
                  <li key={idx} className="central-ajuda__guide-step">
                    <span
                      className="central-ajuda__step-number"
                      aria-hidden="true"
                    >
                      {idx + 1}
                    </span>
                    <span className="central-ajuda__step-text">{passo}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          E. Perguntas Frequentes (Separadas em: Dúvidas frequentes e Perguntas Gerais)
          ==================================================================== */}
      {totalFaqs > 0 && (
        <section
          className="central-ajuda__faq-section"
          aria-label="Perguntas Frequentes"
        >
          {/* Grupo 1: Dúvidas frequentes do perfil */}
          {faqsPrioritarias.length > 0 && (
            <div className="central-ajuda__faq-group">
              <div className="central-ajuda__faq-group-header">
                <h2 className="central-ajuda__faq-group-title">
                  Dúvidas frequentes
                </h2>
              </div>
              <Accordion
                items={accordionItemsPrioritarias}
                openIds={openFaqIds}
                onToggle={handleToggleFaq}
              />
            </div>
          )}

          {/* Grupo 2: Perguntas Gerais */}
          {faqsGerais.length > 0 && (
            <div className="central-ajuda__faq-group">
              <div className="central-ajuda__faq-group-header">
                <h2 className="central-ajuda__faq-group-title">
                  Perguntas Gerais
                </h2>
              </div>
              <Accordion
                items={accordionItemsGerais}
                openIds={openFaqIds}
                onToggle={handleToggleFaq}
              />
            </div>
          )}
        </section>
      )}

      {/* ====================================================================
          F. Rodapé de Apoio (Contato Institucional com a Secretaria)
          ==================================================================== */}
      <footer
        className="central-ajuda__footer"
        aria-label="Canais de apoio e suporte acadêmico"
      >
        <div className="central-ajuda__footer-inner">
          <p className="central-ajuda__footer-prompt">
            Não encontrou o que precisava ou tem uma dúvida específica sobre seu
            vínculo acadêmico?
          </p>
          <p className="central-ajuda__footer-contact">
            Entre em contato com a Secretaria Acadêmica:{' '}
            <a
              href="mailto:secretaria@episteme.dev"
              className="central-ajuda__footer-link"
            >
              secretaria@episteme.dev
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default CentralAjuda
