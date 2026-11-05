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

  // Perfil autenticado exclusivo do usuário logado (cada perfil tem sua própria central)
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

  // Orientações estritamente contextualizadas para o perfil do usuário logado
  const orientacoesFiltradas = useMemo(() => {
    let lista = ORIENTACOES_AJUDA.filter((ori) =>
      ori.perfis.includes(perfilAutenticado)
    )

    if (categoriaAtiva !== 'todas') {
      lista = lista.filter((ori) => ori.categoriaId === categoriaAtiva)
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
  }, [categoriaAtiva, perfilAutenticado, termoBusca])

  // FAQs estritamente contextualizadas para o perfil do usuário logado
  const faqsFiltradas = useMemo(() => {
    let lista = FAQS_AJUDA.filter((faq) =>
      faq.perfis.includes(perfilAutenticado)
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

  // Ações de expandir e recolher todos os FAQs
  const handleExpandirTodos = useCallback(() => {
    setOpenFaqIds(faqsFiltradas.map((f) => f.id))
  }, [faqsFiltradas])

  const handleRecolherTodos = useCallback(() => {
    setOpenFaqIds([])
  }, [])

  // Categoria ativa
  const categoriaAtualObj = useMemo(() => {
    return CATEGORIAS_AJUDA.find((c) => c.id === categoriaAtiva) || null
  }, [categoriaAtiva])

  // Itens do acordeão limpos e objetivos
  const accordionItems = useMemo(() => {
    return faqsFiltradas.map((faq) => {
      const categoria = CATEGORIAS_AJUDA.find((c) => c.id === faq.categoriaId)

      return {
        id: faq.id,
        title: faq.pergunta,
        highlighted: false,
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
  }, [faqsFiltradas, categoriaAtiva])

  const totalResultados = faqsFiltradas.length + orientacoesFiltradas.length

  return (
    <div className="central-ajuda">
      {/* 1. Header Card Limpo com Título, Perfil e Campo de Busca */}
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
            <div className="central-ajuda__title-row">
              <h1 className="central-ajuda__title">Central de Ajuda</h1>
              <Badge variant="primary" size="sm">
                {PERFIS_LABELS[perfilAutenticado]}
              </Badge>
            </div>
            <p className="central-ajuda__subtitle">
              {SUBTITULOS_POR_PERFIL[perfilAutenticado] ||
                'Orientações e respostas para as principais dúvidas do EPIS.'}
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

      {/* 3. Barra de Ações Rápidas do Conteúdo */}
      <section
        className="central-ajuda__toolbar"
        aria-label="Controle de visualização"
      >
        <div className="central-ajuda__toolbar-info">
          <span className="central-ajuda__toolbar-text">
            {categoriaAtualObj ? (
              <strong>{categoriaAtualObj.nome}</strong>
            ) : (
              <span>Todas as Categorias</span>
            )}
            &nbsp;&bull; {faqsFiltradas.length}{' '}
            {faqsFiltradas.length === 1 ? 'pergunta' : 'perguntas'}
          </span>
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
            Não encontramos resultados para a busca atual no seu perfil. Tente
            palavras-chave mais gerais ou redefina os filtros.
          </p>
          <Button variant="primary" size="md" onClick={handleResetFiltros}>
            Redefinir filtros
          </Button>
        </section>
      )}

      {/* 6. Orientações de Uso da Categoria Ativa */}
      {orientacoesFiltradas.length > 0 && (
        <section
          className="central-ajuda__orientacoes-block"
          aria-label="Orientações de Uso"
        >
          {orientacoesFiltradas.map((ori) => {
            const cat = CATEGORIAS_AJUDA.find((c) => c.id === ori.categoriaId)
            return (
              <div key={ori.id} className="central-ajuda__guia-card">
                <div className="central-ajuda__guia-header">
                  <div className="central-ajuda__guia-title-box">
                    <span className="central-ajuda__guia-badge">
                      Orientações &bull; {cat?.nome || 'Geral'}
                    </span>
                    <h2 className="central-ajuda__guia-titulo">{ori.titulo}</h2>
                  </div>
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
                ? `Dúvidas Frequentes sobre ${categoriaAtualObj.nome}`
                : 'Dúvidas Frequentes'}
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
