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
  CheckCircleIcon,
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

function obterIconeCategoria(iconeNome, size = 22) {
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

  // Perfil autenticado real derivado da sessão
  const perfilAutenticado = useMemo(
    () => identificarPerfilAutenticado(aluno, token),
    [aluno, token]
  )

  // Estados de filtro e busca
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas')
  const [perfilFiltro, setPerfilFiltro] = useState(perfilAutenticado)
  const [termoBusca, setTermoBusca] = useState('')
  const [openFaqIds, setOpenFaqIds] = useState([])

  // Alterna item individual do FAQ
  const handleToggleFaq = useCallback((id) => {
    setOpenFaqIds((atuais) =>
      atuais.includes(id)
        ? atuais.filter((item) => item !== id)
        : [...atuais, id]
    )
  }, [])

  // Limpa a busca e restaura a visualização
  const handleLimparBusca = useCallback(() => {
    setTermoBusca('')
  }, [])

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

  // Contagem de itens por categoria
  const contagemPorCategoria = useMemo(() => {
    const mapa = {}
    CATEGORIAS_AJUDA.forEach((cat) => {
      const qtdFaqs = FAQS_AJUDA.filter(
        (f) =>
          f.categoriaId === cat.id &&
          (perfilFiltro === 'todos' || f.perfis.includes(perfilFiltro))
      ).length
      mapa[cat.id] = qtdFaqs
    })
    return mapa
  }, [perfilFiltro])

  // Ações de expandir e recolher todos os FAQs visíveis
  const handleExpandirTodos = useCallback(() => {
    setOpenFaqIds(faqsFiltradas.map((f) => f.id))
  }, [faqsFiltradas])

  const handleRecolherTodos = useCallback(() => {
    setOpenFaqIds([])
  }, [])

  // Preparação dos itens do acordeão
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
            {categoria && (
              <Badge variant="soft" size="sm">
                {categoria.nome}
              </Badge>
            )}
            {ehDestaquePerfil && (
              <Badge variant="primary" size="sm">
                Seu perfil
              </Badge>
            )}
            {faq.perfis.map((p) => (
              <Badge key={p} variant="dark" size="sm">
                {PERFIS_LABELS[p]}
              </Badge>
            ))}
          </span>
        ),
        content: (
          <div className="central-ajuda__faq-resposta">
            <p>{faq.resposta}</p>
            {faq.tags && faq.tags.length > 0 && (
              <div className="central-ajuda__faq-tags">
                <span className="central-ajuda__faq-tags-label">
                  Palavras-chave:
                </span>
                {faq.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="central-ajuda__tag-btn"
                    onClick={() => setTermoBusca(tag)}
                    title={`Filtrar por ${tag}`}
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
  }, [faqsFiltradas, perfilAutenticado])

  const totalResultados = faqsFiltradas.length + orientacoesFiltradas.length
  const temFiltroAtivo =
    termoBusca.trim() !== '' ||
    categoriaAtiva !== 'todas' ||
    perfilFiltro !== perfilAutenticado

  return (
    <div className="central-ajuda">
      {/* 1. Header Card com Breadcrumbs e Apresentação */}
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

        <div className="central-ajuda__hero">
          <div className="central-ajuda__hero-text">
            <div className="central-ajuda__title-row">
              <span className="central-ajuda__badge-destaque">
                <HelpCircleIcon size={16} /> Suporte e Orientações
              </span>
              <span className="central-ajuda__user-role-badge">
                Perfil ativo:{' '}
                <strong>{PERFIS_LABELS[perfilAutenticado]}</strong>
              </span>
            </div>
            <h1 className="central-ajuda__title">
              Como podemos ajudar você hoje?
            </h1>
            <p className="central-ajuda__subtitle">
              Explore orientações de uso, tutoriais rápidos e respostas para as
              dúvidas mais frequentes sobre o sistema EPIS.
            </p>
          </div>

          {/* Campo de Busca de Conteúdo */}
          <div className="central-ajuda__search-container">
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
                size={20}
                className="central-ajuda__search-icon"
                aria-hidden="true"
              />
              <input
                id="input-busca-ajuda"
                type="search"
                className="central-ajuda__search-input"
                placeholder="Pesquise por palavra-chave (ex: matrícula, notas, senha, diário)..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                autoComplete="off"
              />
              {termoBusca && (
                <button
                  type="button"
                  className="central-ajuda__search-clear"
                  onClick={handleLimparBusca}
                  aria-label="Limpar pesquisa"
                  title="Limpar pesquisa"
                >
                  ×
                </button>
              )}
            </form>
          </div>
        </div>
      </header>

      {/* 2. Barra de Contextualização por Perfil */}
      <section
        className="central-ajuda__contexto-perfil-bar"
        aria-label="Filtro de contexto por perfil de usuário"
      >
        <div className="central-ajuda__contexto-info">
          <CheckCircleIcon size={18} className="central-ajuda__contexto-icon" />
          <span>
            Conteúdo contextualizado para{' '}
            <strong>{PERFIS_LABELS[perfilFiltro] || 'Todos os perfis'}</strong>
            {perfilFiltro === perfilAutenticado && (
              <span className="central-ajuda__contexto-ativo-tag">
                {' '}
                (Seu Perfil)
              </span>
            )}
          </span>
        </div>

        <div
          className="central-ajuda__perfil-botoes"
          role="group"
          aria-label="Filtrar por perfil"
        >
          <button
            type="button"
            className={`central-ajuda__perfil-btn ${
              perfilFiltro === perfilAutenticado
                ? 'central-ajuda__perfil-btn--active'
                : ''
            }`}
            onClick={() => setPerfilFiltro(perfilAutenticado)}
          >
            Meu Perfil ({PERFIS_LABELS[perfilAutenticado]})
          </button>
          <button
            type="button"
            className={`central-ajuda__perfil-btn ${
              perfilFiltro === PERFIS.ALUNO
                ? 'central-ajuda__perfil-btn--active'
                : ''
            }`}
            onClick={() => setPerfilFiltro(PERFIS.ALUNO)}
          >
            Aluno
          </button>
          <button
            type="button"
            className={`central-ajuda__perfil-btn ${
              perfilFiltro === PERFIS.PROFESSOR
                ? 'central-ajuda__perfil-btn--active'
                : ''
            }`}
            onClick={() => setPerfilFiltro(PERFIS.PROFESSOR)}
          >
            Professor
          </button>
          <button
            type="button"
            className={`central-ajuda__perfil-btn ${
              perfilFiltro === PERFIS.COORDENACAO
                ? 'central-ajuda__perfil-btn--active'
                : ''
            }`}
            onClick={() => setPerfilFiltro(PERFIS.COORDENACAO)}
          >
            Coordenação
          </button>
          <button
            type="button"
            className={`central-ajuda__perfil-btn ${
              perfilFiltro === 'todos'
                ? 'central-ajuda__perfil-btn--active'
                : ''
            }`}
            onClick={() => setPerfilFiltro('todos')}
          >
            Todos os perfis
          </button>
        </div>
      </section>

      {/* 3. Seletor de Categorias Temáticas */}
      <section
        className="central-ajuda__categorias-section"
        aria-label="Categorias da central de ajuda"
      >
        <div className="central-ajuda__section-header">
          <div>
            <h2 className="central-ajuda__section-title">
              Categorias Temáticas
            </h2>
            <p className="central-ajuda__section-subtitle">
              Selecione um módulo do sistema para filtrar orientações e
              perguntas frequentes
            </p>
          </div>
          {categoriaAtiva !== 'todas' && (
            <button
              type="button"
              className="central-ajuda__reset-categoria-btn"
              onClick={() => setCategoriaAtiva('todas')}
            >
              Ver todas as categorias
            </button>
          )}
        </div>

        <div
          className="central-ajuda__categorias-grid"
          role="tablist"
          aria-label="Abas de categorias"
        >
          <button
            type="button"
            role="tab"
            aria-selected={categoriaAtiva === 'todas'}
            className={`central-ajuda__categoria-card ${
              categoriaAtiva === 'todas'
                ? 'central-ajuda__categoria-card--active'
                : ''
            }`}
            onClick={() => setCategoriaAtiva('todas')}
          >
            <div className="central-ajuda__categoria-icon-box">
              <HelpCircleIcon size={24} />
            </div>
            <div className="central-ajuda__categoria-info">
              <h3 className="central-ajuda__categoria-nome">
                Todas as Categorias
              </h3>
              <p className="central-ajuda__categoria-desc">
                Visão completa de todos os tópicos e perguntas frequentes.
              </p>
            </div>
            <span className="central-ajuda__categoria-count">
              {
                FAQS_AJUDA.filter(
                  (f) =>
                    perfilFiltro === 'todos' || f.perfis.includes(perfilFiltro)
                ).length
              }{' '}
              FAQs
            </span>
          </button>

          {CATEGORIAS_AJUDA.map((cat) => {
            const isActive = categoriaAtiva === cat.id
            const count = contagemPorCategoria[cat.id] || 0

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={isActive}
                className={`central-ajuda__categoria-card ${
                  isActive ? 'central-ajuda__categoria-card--active' : ''
                }`}
                onClick={() => setCategoriaAtiva(cat.id)}
              >
                <div className="central-ajuda__categoria-icon-box">
                  {obterIconeCategoria(cat.icone)}
                </div>
                <div className="central-ajuda__categoria-info">
                  <h3 className="central-ajuda__categoria-nome">{cat.nome}</h3>
                  <p className="central-ajuda__categoria-desc">
                    {cat.descricao}
                  </p>
                </div>
                <span className="central-ajuda__categoria-count">
                  {count} {count === 1 ? 'FAQ' : 'FAQs'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 4. Feedback de busca ativo */}
      {termoBusca && (
        <div className="central-ajuda__busca-feedback" role="status">
          <span>
            Exibindo resultados para:{' '}
            <strong>&ldquo;{termoBusca}&rdquo;</strong> ({totalResultados}{' '}
            {totalResultados === 1 ? 'item encontrado' : 'itens encontrados'})
          </span>
          <button
            type="button"
            className="central-ajuda__busca-limpar-btn"
            onClick={handleLimparBusca}
          >
            Limpar pesquisa
          </button>
        </div>
      )}

      {/* 5. Estado Vazio (Sem resultados encontrados) */}
      {totalResultados === 0 && (
        <section
          className="central-ajuda__empty-state"
          role="region"
          aria-label="Nenhum resultado encontrado"
        >
          <div className="central-ajuda__empty-icon" aria-hidden="true">
            <SearchSlashIcon size={48} />
          </div>
          <h2 className="central-ajuda__empty-title">
            Nenhum conteúdo encontrado
          </h2>
          <p className="central-ajuda__empty-desc">
            Não encontramos nenhuma orientação ou pergunta correspondente aos
            filtros selecionados
            {termoBusca ? ` para o termo "${termoBusca}"` : ''}.
          </p>
          <div className="central-ajuda__empty-actions">
            {temFiltroAtivo && (
              <Button
                variant="primary"
                onClick={() => {
                  setTermoBusca('')
                  setCategoriaAtiva('todas')
                  setPerfilFiltro('todos')
                }}
              >
                Limpar todos os filtros
              </Button>
            )}
            {termoBusca && (
              <Button variant="outline" onClick={handleLimparBusca}>
                Limpar apenas a busca
              </Button>
            )}
          </div>
        </section>
      )}

      {/* 6. Orientações e Guias Rápidos */}
      {orientacoesFiltradas.length > 0 && (
        <section
          className="central-ajuda__orientacoes-section"
          aria-label="Orientações e guias de uso"
        >
          <div className="central-ajuda__section-header">
            <div>
              <h2 className="central-ajuda__section-title">
                Orientações de Uso
              </h2>
              <p className="central-ajuda__section-subtitle">
                Passo a passo objetivo para as funcionalidades mais importantes
              </p>
            </div>
            <span className="central-ajuda__badge-contagem">
              {orientacoesFiltradas.length}{' '}
              {orientacoesFiltradas.length === 1 ? 'guia' : 'guias'}
            </span>
          </div>

          <div className="central-ajuda__orientacoes-grid">
            {orientacoesFiltradas.map((ori) => {
              const categoria = CATEGORIAS_AJUDA.find(
                (c) => c.id === ori.categoriaId
              )
              const ehDestaque = ori.perfis.includes(perfilAutenticado)

              return (
                <article
                  key={ori.id}
                  className={`central-ajuda__orientacao-card ${
                    ehDestaque ? 'central-ajuda__orientacao-card--destaque' : ''
                  }`}
                >
                  <div className="central-ajuda__orientacao-topo">
                    <div className="central-ajuda__orientacao-categoria">
                      {categoria && (
                        <span className="central-ajuda__orientacao-categoria-tag">
                          {obterIconeCategoria(categoria.icone, 16)}
                          {categoria.nome}
                        </span>
                      )}
                    </div>
                    <div className="central-ajuda__orientacao-perfis">
                      {ehDestaque && (
                        <Badge variant="primary" size="sm">
                          Seu perfil
                        </Badge>
                      )}
                      {ori.perfis.map((p) => (
                        <Badge key={p} variant="dark" size="sm">
                          {PERFIS_LABELS[p]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <h3 className="central-ajuda__orientacao-titulo">
                    {ori.titulo}
                  </h3>
                  <p className="central-ajuda__orientacao-resumo">
                    {ori.resumo}
                  </p>

                  <div className="central-ajuda__orientacao-passos">
                    <h4 className="central-ajuda__passos-subtitulo">
                      Instruções:
                    </h4>
                    <ol className="central-ajuda__passos-lista">
                      {ori.passos.map((passo, idx) => (
                        <li key={idx} className="central-ajuda__passo-item">
                          {passo}
                        </li>
                      ))}
                    </ol>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* 7. Seção de Perguntas Frequentes (FAQ) */}
      {faqsFiltradas.length > 0 && (
        <section
          className="central-ajuda__faq-section"
          aria-label="Perguntas Frequentes"
        >
          <div className="central-ajuda__section-header">
            <div>
              <h2 className="central-ajuda__section-title">
                Perguntas Frequentes (FAQ)
              </h2>
              <p className="central-ajuda__section-subtitle">
                Respostas diretas e esclarecimentos para as principais dúvidas
              </p>
            </div>

            <div className="central-ajuda__faq-actions">
              <button
                type="button"
                className="central-ajuda__faq-toggle-btn"
                onClick={handleExpandirTodos}
              >
                Expandir todos
              </button>
              <span className="central-ajuda__faq-action-divider">|</span>
              <button
                type="button"
                className="central-ajuda__faq-toggle-btn"
                onClick={handleRecolherTodos}
              >
                Recolher todos
              </button>
            </div>
          </div>

          <Accordion
            items={accordionItems}
            openIds={openFaqIds}
            onToggle={handleToggleFaq}
          />
        </section>
      )}

      {/* 8. Card de Contato e Suporte Complementar */}
      <aside
        className="central-ajuda__suporte-card"
        aria-label="Canais de suporte adicionais"
      >
        <div className="central-ajuda__suporte-icon" aria-hidden="true">
          <HelpCircleIcon size={32} />
        </div>
        <div className="central-ajuda__suporte-content">
          <h2 className="central-ajuda__suporte-title">
            Não encontrou o que precisava?
          </h2>
          <p className="central-ajuda__suporte-desc">
            Nossa equipe de suporte acadêmico e a coordenação de curso estão à
            disposição para esclarecer dúvidas específicas sobre sua situação no
            EPIS.
          </p>
          <div className="central-ajuda__suporte-info-row">
            <span>
              <strong>Secretaria Acadêmica:</strong> secretaria@episteme.dev
            </span>
            <span className="central-ajuda__suporte-dot" aria-hidden="true">
              •
            </span>
            <span>
              <strong>Atendimento:</strong> Segunda a Sexta, das 08h às 20h
            </span>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default CentralAjuda
