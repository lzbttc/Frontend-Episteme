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

function obterIconeCategoria(iconeNome, size = 18) {
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

  // Perfil autenticado derivado da sessão
  const perfilAutenticado = useMemo(
    () => identificarPerfilAutenticado(aluno, token),
    [aluno, token]
  )

  // Estados principais
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas')
  const [perfilFiltro, setPerfilFiltro] = useState(perfilAutenticado)
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

  // Limpa todos os filtros para estado padrão
  const handleResetFiltros = useCallback(() => {
    setTermoBusca('')
    setCategoriaAtiva('todas')
    setPerfilFiltro(perfilAutenticado)
  }, [perfilAutenticado])

  // Filtragem de orientações
  const orientacoesFiltradas = useMemo(() => {
    let lista = ORIENTACOES_AJUDA

    if (categoriaAtiva !== 'todas') {
      lista = lista.filter((ori) => ori.categoriaId === categoriaAtiva)
    }

    if (perfilFiltro !== 'todos') {
      lista = lista.filter((ori) => ori.perfis.includes(perfilFiltro))
    }

    if (termoBusca.trim()) {
      const termo = normalizarTexto(termoBusca)
      lista = lista.filter((ori) => {
        const matchTitulo = normalizarTexto(ori.titulo).includes(termo)
        const matchResumo = normalizarTexto(ori.resumo).includes(termo)
        const matchPassos = ori.passos?.some((p) =>
          normalizarTexto(p).includes(termo)
        )
        const matchTags = ori.tags?.some((t) =>
          normalizarTexto(t).includes(termo)
        )
        return matchTitulo || matchResumo || matchPassos || matchTags
      })
    }

    return lista
  }, [categoriaAtiva, perfilFiltro, termoBusca])

  // Filtragem de FAQs
  const faqsFiltradas = useMemo(() => {
    let lista = FAQS_AJUDA

    if (categoriaAtiva !== 'todas') {
      lista = lista.filter((faq) => faq.categoriaId === categoriaAtiva)
    }

    if (perfilFiltro !== 'todos') {
      lista = lista.filter((faq) => faq.perfis.includes(perfilFiltro))
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

    // Ordenação com destaque para itens pertinentes ao perfil autenticado
    return lista.sort((a, b) => {
      const aRelevante = a.perfis.includes(perfilAutenticado)
      const bRelevante = b.perfis.includes(perfilAutenticado)
      if (aRelevante && !bRelevante) return -1
      if (!aRelevante && bRelevante) return 1
      return 0
    })
  }, [categoriaAtiva, perfilFiltro, termoBusca, perfilAutenticado])

  // Ações de expandir e recolher todos os FAQs
  const handleExpandirTodos = useCallback(() => {
    setOpenFaqIds(faqsFiltradas.map((f) => f.id))
  }, [faqsFiltradas])

  const handleRecolherTodos = useCallback(() => {
    setOpenFaqIds([])
  }, [])

  // Categoria atual selecionada (quando não for 'todas')
  const categoriaAtualObj = useMemo(() => {
    return CATEGORIAS_AJUDA.find((c) => c.id === categoriaAtiva) || null
  }, [categoriaAtiva])

  // Itens do acordeão sem poluição visual
  const accordionItems = useMemo(() => {
    return faqsFiltradas.map((faq) => {
      const categoria = CATEGORIAS_AJUDA.find((c) => c.id === faq.categoriaId)
      const ehDestaquePerfil = faq.perfis.includes(perfilAutenticado)

      return {
        id: faq.id,
        title: faq.pergunta,
        highlighted: ehDestaquePerfil,
        badge: (
          <span className="central-ajuda__faq-badges">
            {categoriaAtiva === 'todas' && categoria && (
              <Badge variant="soft" size="sm">
                {categoria.nome}
              </Badge>
            )}
            {ehDestaquePerfil && perfilFiltro === 'todos' && (
              <Badge variant="primary" size="sm">
                Recomendado
              </Badge>
            )}
          </span>
        ),
        content: (
          <div className="central-ajuda__faq-resposta">
            <p>{faq.resposta}</p>
            {faq.tags && faq.tags.length > 0 && (
              <div className="central-ajuda__faq-tags">
                <span className="central-ajuda__faq-tags-label">Tags:</span>
                {faq.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="central-ajuda__tag-btn"
                    onClick={() => setTermoBusca(tag)}
                    title={`Buscar por ${tag}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        ),
      }
    })
  }, [faqsFiltradas, categoriaAtiva, perfilAutenticado, perfilFiltro])

  const totalResultados = faqsFiltradas.length + orientacoesFiltradas.length

  return (
    <div className="central-ajuda">
      {/* 1. Header Card Limpo com Título e Campo de Busca */}
      <header className="central-ajuda__header-card">
        <nav
          className="central-ajuda__breadcrumbs"
          aria-label="Navegação estrutural"
        >
          <Link
            to={PATHS.inicio}
            className="central-ajuda__breadcrumb-link"
            title="Voltar para a Página Inicial"
          >
            Portal Acadêmico
          </Link>
          <span
            className="central-ajuda__breadcrumb-separator"
            aria-hidden="true"
          >
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
            <h1 className="central-ajuda__title">Central de Ajuda</h1>
            <p className="central-ajuda__subtitle">
              Orientações de uso e respostas para as principais dúvidas do EPIS.
            </p>
          </div>

          {/* Campo de Busca Unificado (sem duplo 'x') */}
          <div className="central-ajuda__search-wrapper">
            <form
              className="central-ajuda__search-box"
              onSubmit={(e) => e.preventDefault()}
              role="search"
            >
              <label
                htmlFor="input-busca-ajuda"
                className="central-ajuda__visually-hidden"
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

      {/* 2. Barra de Navegação por Categorias (Abas Horizontais Limpas) */}
      <nav
        className="central-ajuda__nav-tabs"
        role="tablist"
        aria-label="Categorias de ajuda"
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
          <HelpCircleIcon size={16} />
          <span>Todas as Categorias</span>
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
              {obterIconeCategoria(cat.icone, 16)}
              <span>{cat.nome}</span>
            </button>
          )
        })}
      </nav>

      {/* 3. Barra de Contexto por Perfil e Ações Rápidas */}
      <section
        className="central-ajuda__toolbar"
        aria-label="Filtro de perfil e ações"
      >
        <div className="central-ajuda__toolbar-perfil">
          <span className="central-ajuda__toolbar-label">
            Perfil:&nbsp;
            <span className="central-ajuda__toolbar-active-indicator">
              (Seu: <strong>{PERFIS_LABELS[perfilAutenticado]}</strong>)
            </span>
          </span>

          <div
            className="central-ajuda__perfil-pills"
            role="group"
            aria-label="Alternar perfil"
          >
            <button
              type="button"
              className={`central-ajuda__pill-btn ${
                perfilFiltro === perfilAutenticado
                  ? 'central-ajuda__pill-btn--active'
                  : ''
              }`}
              onClick={() => setPerfilFiltro(perfilAutenticado)}
            >
              Meu Perfil ({PERFIS_LABELS[perfilAutenticado]})
            </button>
            <button
              type="button"
              className={`central-ajuda__pill-btn ${
                perfilFiltro === PERFIS.ALUNO
                  ? 'central-ajuda__pill-btn--active'
                  : ''
              }`}
              onClick={() => setPerfilFiltro(PERFIS.ALUNO)}
            >
              Aluno
            </button>
            <button
              type="button"
              className={`central-ajuda__pill-btn ${
                perfilFiltro === PERFIS.PROFESSOR
                  ? 'central-ajuda__pill-btn--active'
                  : ''
              }`}
              onClick={() => setPerfilFiltro(PERFIS.PROFESSOR)}
            >
              Professor
            </button>
            <button
              type="button"
              className={`central-ajuda__pill-btn ${
                perfilFiltro === PERFIS.COORDENACAO
                  ? 'central-ajuda__pill-btn--active'
                  : ''
              }`}
              onClick={() => setPerfilFiltro(PERFIS.COORDENACAO)}
            >
              Coordenação
            </button>
            <button
              type="button"
              className={`central-ajuda__pill-btn ${
                perfilFiltro === 'todos'
                  ? 'central-ajuda__pill-btn--active'
                  : ''
              }`}
              onClick={() => setPerfilFiltro('todos')}
            >
              Todos
            </button>
          </div>
        </div>

        {faqsFiltradas.length > 0 && (
          <div className="central-ajuda__toolbar-actions">
            <button
              type="button"
              className="central-ajuda__text-action-btn"
              onClick={handleExpandirTodos}
            >
              Expandir todos
            </button>
            <span
              className="central-ajuda__text-action-divider"
              aria-hidden="true"
            >
              &bull;
            </span>
            <button
              type="button"
              className="central-ajuda__text-action-btn"
              onClick={handleRecolherTodos}
            >
              Recolher todos
            </button>
          </div>
        )}
      </section>

      {/* 4. Feedback de busca ativo */}
      {termoBusca && (
        <div className="central-ajuda__search-feedback" role="status">
          <span>
            Buscando por: <strong>&ldquo;{termoBusca}&rdquo;</strong> &mdash;{' '}
            {totalResultados}{' '}
            {totalResultados === 1 ? 'resultado' : 'resultados'}
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

      {/* 5. Estado Vazio (Sem resultados) */}
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
            Não encontramos resultados para a busca atual. Tente palavras-chave
            mais gerais ou redefina os filtros.
          </p>
          <Button variant="primary" size="md" onClick={handleResetFiltros}>
            Redefinir filtros
          </Button>
        </section>
      )}

      {/* 6. Orientações de Uso da Categoria Ativa (Guia Objetivo e Limpo) */}
      {orientacoesFiltradas.length > 0 && (
        <section
          className="central-ajuda__orientacoes-block"
          aria-label="Orientações e Guia de Uso"
        >
          {orientacoesFiltradas.map((ori) => {
            const cat = CATEGORIAS_AJUDA.find((c) => c.id === ori.categoriaId)
            return (
              <div key={ori.id} className="central-ajuda__guia-card">
                <div className="central-ajuda__guia-header">
                  <div className="central-ajuda__guia-title-box">
                    <span className="central-ajuda__guia-badge">
                      Guia de Uso &bull; {cat?.nome || 'Geral'}
                    </span>
                    <h2 className="central-ajuda__guia-titulo">{ori.titulo}</h2>
                  </div>
                  <span className="central-ajuda__guia-perfis-tag">
                    {ori.perfis.map((p) => PERFIS_LABELS[p]).join(', ')}
                  </span>
                </div>

                <p className="central-ajuda__guia-resumo">{ori.resumo}</p>

                <div className="central-ajuda__guia-passos">
                  <h3 className="central-ajuda__guia-passos-title">
                    Passo a passo:
                  </h3>
                  <ol className="central-ajuda__guia-lista">
                    {ori.passos.map((passo, idx) => (
                      <li key={idx} className="central-ajuda__guia-item">
                        {passo}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )
          })}
        </section>
      )}

      {/* 7. Perguntas Frequentes (FAQ) */}
      {faqsFiltradas.length > 0 && (
        <section
          className="central-ajuda__faq-block"
          aria-label="Perguntas Frequentes"
        >
          <div className="central-ajuda__faq-header">
            <h2 className="central-ajuda__faq-title">
              {categoriaAtualObj
                ? `Perguntas Frequentes — ${categoriaAtualObj.nome}`
                : 'Perguntas Frequentes'}
            </h2>
            <span className="central-ajuda__faq-count">
              {faqsFiltradas.length}{' '}
              {faqsFiltradas.length === 1 ? 'pergunta' : 'perguntas'}
            </span>
          </div>

          <Accordion
            items={accordionItems}
            openIds={openFaqIds}
            onToggle={handleToggleFaq}
          />
        </section>
      )}

      {/* 8. Rodapé Compacto de Suporte */}
      <footer className="central-ajuda__footer-suporte">
        <p>
          Ainda com dúvidas? Entre em contato com a secretaria acadêmica:{' '}
          <a
            href="mailto:secretaria@episteme.dev"
            className="central-ajuda__footer-link"
          >
            secretaria@episteme.dev
          </a>
        </p>
      </footer>
    </div>
  )
}

export default CentralAjuda
