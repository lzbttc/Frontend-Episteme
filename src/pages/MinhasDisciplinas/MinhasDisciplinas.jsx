import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PATHS, turmaPath } from '../../routes/paths'
import {
  CheckCircleIcon,
  ChevronRightSmallIcon,
  SearchIcon,
  SearchSlashIcon,
  ButterflyIcon,
  UserFilledIcon,
  ClockSolidIcon,
  ArrowRightLineIcon,
  ZapOutlineIcon,
  CalendarGridIcon,
  ReportCardIcon,
  SwapArrowsIcon,
  MegaphoneIcon,
} from '../../components/icons'
import { minhasDisciplinasMock } from '../../mocks/minhasDisciplinasMock'
import { usePageTitle } from '../../hooks/usePageTitle'
import './MinhasDisciplinas.css'

function MinhasDisciplinas() {
  const navigate = useNavigate()
  const {
    activeDisciplines,
    completedDisciplines,
    quickActions,
    recentNotices,
  } = minhasDisciplinasMock

  const [activeTab, setActiveTab] = useState('andamento') // 'andamento' | 'concluidas' | 'todas'
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [activeNoticeModal, setActiveNoticeModal] = useState(null)
  const [activeQuickActionModal, setActiveQuickActionModal] = useState(null)
  usePageTitle('Minhas Disciplinas')

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage('')
    }, 3800)
  }

  // Filter disciplines based on activeTab and searchTerm
  const filteredDisciplines = useMemo(() => {
    const list =
      activeTab === 'andamento'
        ? activeDisciplines
        : activeTab === 'concluidas'
          ? completedDisciplines
          : [...activeDisciplines, ...completedDisciplines]

    if (!searchTerm.trim()) return list

    const query = searchTerm.toLowerCase().trim()
    return list.filter(
      (disc) =>
        disc.name.toLowerCase().includes(query) ||
        disc.code.toLowerCase().includes(query) ||
        disc.professor.toLowerCase().includes(query) ||
        (disc.room && disc.room.toLowerCase().includes(query))
    )
  }, [activeTab, searchTerm, activeDisciplines, completedDisciplines])

  const handleAccessClass = (discipline) => {
    navigate(turmaPath(discipline.id))
  }

  const handleQuickAction = (action) => {
    setActiveQuickActionModal(action)
  }

  return (
    <div className="minhas-disciplinas-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="minhas-disciplinas__toast"
          role="status"
          aria-live="polite"
        >
          <CheckCircleIcon className="minhas-disciplinas__toast-icon" />
          <span>{toastMessage}</span>
          <button
            type="button"
            className="minhas-disciplinas__toast-close"
            onClick={() => setToastMessage('')}
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>
      )}

      {/* 1. Header Card (Breadcrumb + Title + Subtitle) */}
      <header className="minhas-disciplinas__header-card">
        <div className="minhas-disciplinas__header-content">
          <nav
            className="minhas-disciplinas__breadcrumbs"
            aria-label="Navegação estrutural"
          >
            <Link
              to={PATHS.inicio}
              className="minhas-disciplinas__breadcrumb-link"
              title="Voltar para a Página Inicial"
            >
              Portal Acadêmico
            </Link>
            <span
              className="minhas-disciplinas__breadcrumb-separator"
              aria-hidden="true"
            >
              <ChevronRightSmallIcon />
            </span>
            <span
              className="minhas-disciplinas__breadcrumb-current"
              aria-current="page"
            >
              Minhas disciplinas
            </span>
          </nav>

          <h1 className="minhas-disciplinas__page-title">Minhas Disciplinas</h1>
          <p className="minhas-disciplinas__page-subtitle">
            Acompanhe suas turmas matriculadas, frequência acumulada, cronograma
            de aulas e acesse o ambiente virtual de aprendizagem.
          </p>
        </div>
      </header>

      {/* 2. Filter & Switcher Bar */}
      <div className="minhas-disciplinas__filter-bar">
        {/* Status segmented pills */}
        <div
          className="minhas-disciplinas__status-pills"
          role="tablist"
          aria-label="Status das disciplinas"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'andamento'}
            className={`minhas-disciplinas__pill-btn ${
              activeTab === 'andamento'
                ? 'minhas-disciplinas__pill-btn--active'
                : ''
            }`}
            onClick={() => setActiveTab('andamento')}
          >
            <span>Em andamento ({activeDisciplines.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'concluidas'}
            className={`minhas-disciplinas__pill-btn ${
              activeTab === 'concluidas'
                ? 'minhas-disciplinas__pill-btn--active'
                : ''
            }`}
            onClick={() => setActiveTab('concluidas')}
          >
            <span>Concluídas ({completedDisciplines.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'todas'}
            className={`minhas-disciplinas__pill-btn ${
              activeTab === 'todas'
                ? 'minhas-disciplinas__pill-btn--active'
                : ''
            }`}
            onClick={() => setActiveTab('todas')}
          >
            <span>Todas as disciplinas</span>
          </button>
        </div>

        {/* Search input with live sensitivity */}
        <div className="minhas-disciplinas__search-box">
          <SearchIcon className="minhas-disciplinas__search-icon" />
          <input
            type="text"
            className="minhas-disciplinas__search-input"
            placeholder="Filtrar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Filtrar por nome ou código"
          />
          {searchTerm && (
            <button
              type="button"
              className="minhas-disciplinas__search-clear"
              onClick={() => setSearchTerm('')}
              title="Limpar busca"
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 3. Primary Workspace Grid (8-col Disciplines Track + 4-col Sidebar) */}
      <div className="minhas-disciplinas__workspace-grid">
        {/* 8-col Primary Track: Disciplines Cards */}
        <section
          className="minhas-disciplinas__primary-track"
          aria-label="Lista de Disciplinas"
        >
          {filteredDisciplines.length === 0 ? (
            <div className="minhas-disciplinas__empty-state">
              <div className="minhas-disciplinas__empty-icon">
                <SearchSlashIcon size={48} />
              </div>
              <h3 className="minhas-disciplinas__empty-title">
                Nenhuma disciplina encontrada
              </h3>
              <p className="minhas-disciplinas__empty-desc">
                Não encontramos disciplinas que correspondam à busca por &quot;
                {searchTerm}&quot;.
              </p>
              <button
                type="button"
                className="minhas-disciplinas__btn-reset"
                onClick={() => {
                  setSearchTerm('')
                  setActiveTab('andamento')
                }}
              >
                Limpar filtros de busca
              </button>
            </div>
          ) : (
            <div className="minhas-disciplinas__cards-list">
              {filteredDisciplines.map((disc) => {
                const isCompleted = disc.status === 'concluida'

                return (
                  <article
                    key={disc.id}
                    className={`minhas-disciplinas__card ${
                      isCompleted ? 'minhas-disciplinas__card--completed' : ''
                    }`}
                  >
                    {/* Left Banner Illustration with SVG subtract pattern */}
                    <div
                      className={`minhas-disciplinas__card-banner ${
                        isCompleted
                          ? 'minhas-disciplinas__card-banner--completed'
                          : ''
                      }`}
                      aria-hidden="true"
                    >
                      <div className="minhas-disciplinas__banner-shapes">
                        <ButterflyIcon className="minhas-disciplinas__banner-svg minhas-disciplinas__banner-svg--top" />
                        <ButterflyIcon className="minhas-disciplinas__banner-svg minhas-disciplinas__banner-svg--bottom" />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="minhas-disciplinas__card-body">
                      {/* Top Badges */}
                      <div className="minhas-disciplinas__card-top">
                        <div className="minhas-disciplinas__code-turma">
                          <span className="minhas-disciplinas__code-tag">
                            {disc.code}
                          </span>
                          <span className="minhas-disciplinas__turma-tag">
                            {disc.turma}
                          </span>
                        </div>
                        {isCompleted ? (
                          <div className="minhas-disciplinas__completed-badge">
                            <span className="minhas-disciplinas__completed-dot">
                              ✓
                            </span>
                            <span>Média: {disc.finalGrade}</span>
                          </div>
                        ) : (
                          <div className="minhas-disciplinas__progress-badge">
                            <span>Freq: {disc.frequencia}</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="minhas-disciplinas__card-title">
                        {disc.name}
                      </h2>

                      {/* Professor & Department info */}
                      <div className="minhas-disciplinas__info-row">
                        <UserFilledIcon className="minhas-disciplinas__info-icon" />
                        <span className="minhas-disciplinas__prof-name">
                          {disc.professor}
                        </span>
                        <span className="minhas-disciplinas__bullet">•</span>
                        <span className="minhas-disciplinas__dept-name">
                          {disc.department}
                        </span>
                      </div>

                      {/* Schedule & Location info */}
                      <div className="minhas-disciplinas__info-row">
                        <ClockSolidIcon className="minhas-disciplinas__info-icon" />
                        <span className="minhas-disciplinas__schedule-days">
                          {disc.scheduleDays}
                        </span>
                        <span className="minhas-disciplinas__bullet">•</span>
                        <span className="minhas-disciplinas__schedule-hours">
                          {disc.scheduleHours}
                        </span>
                        <span className="minhas-disciplinas__bullet">•</span>
                        <span className="minhas-disciplinas__schedule-room">
                          {disc.room}
                        </span>
                      </div>

                      {/* Bottom Action Button with enhanced sensitivity */}
                      <div className="minhas-disciplinas__card-actions">
                        <button
                          type="button"
                          className="minhas-disciplinas__action-btn"
                          onClick={() => handleAccessClass(disc)}
                          title={`Acessar turma virtual de ${disc.name}`}
                        >
                          <span>
                            {isCompleted
                              ? 'Acessar arquivo da turma'
                              : 'Acessar turma virtual'}
                          </span>
                          <ArrowRightLineIcon className="minhas-disciplinas__btn-arrow" />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* 4-col Secondary Track: Acesso Rápido + Avisos Recentes */}
        <aside
          className="minhas-disciplinas__secondary-track"
          aria-label="Acesso Rápido e Avisos"
        >
          {/* Module 1: Acesso Rápido Acadêmico */}
          <div className="minhas-disciplinas__quick-access-card">
            <div className="minhas-disciplinas__module-header">
              <div className="minhas-disciplinas__icon-container minhas-disciplinas__icon-container--sand">
                <ZapOutlineIcon />
              </div>
              <h2 className="minhas-disciplinas__module-title">
                Acesso Rápido
              </h2>
            </div>

            <div className="minhas-disciplinas__quick-action-tiles">
              {/* Tile 1: Grade de Horários */}
              <button
                type="button"
                className="minhas-disciplinas__tile-btn"
                onClick={() => handleQuickAction(quickActions[0])}
                title="Abrir Grade de Horários"
              >
                <div className="minhas-disciplinas__tile-icon-wrapper">
                  <CalendarGridIcon />
                </div>
                <div className="minhas-disciplinas__tile-texts">
                  <span className="minhas-disciplinas__tile-title">
                    {quickActions[0].title}
                  </span>
                  <span className="minhas-disciplinas__tile-sub">
                    {quickActions[0].subtitle}
                  </span>
                </div>
                <span className="minhas-disciplinas__tile-badge">
                  {quickActions[0].badge}
                </span>
              </button>

              {/* Tile 2: Boletim Escolar Oficial */}
              <button
                type="button"
                className="minhas-disciplinas__tile-btn"
                onClick={() => handleQuickAction(quickActions[1])}
                title="Emitir Boletim Escolar Oficial"
              >
                <div className="minhas-disciplinas__tile-icon-wrapper">
                  <ReportCardIcon />
                </div>
                <div className="minhas-disciplinas__tile-texts">
                  <span className="minhas-disciplinas__tile-title">
                    {quickActions[1].title}
                  </span>
                  <span className="minhas-disciplinas__tile-sub">
                    {quickActions[1].subtitle}
                  </span>
                </div>
                <span className="minhas-disciplinas__tile-badge">
                  {quickActions[1].badge}
                </span>
              </button>

              {/* Tile 3: Ajuste de Matrícula */}
              <button
                type="button"
                className="minhas-disciplinas__tile-btn"
                onClick={() => handleQuickAction(quickActions[2])}
                title="Acessar Ajuste de Matrícula"
              >
                <div className="minhas-disciplinas__tile-icon-wrapper">
                  <SwapArrowsIcon />
                </div>
                <div className="minhas-disciplinas__tile-texts">
                  <span className="minhas-disciplinas__tile-title">
                    {quickActions[2].title}
                  </span>
                  <span className="minhas-disciplinas__tile-sub">
                    {quickActions[2].subtitle}
                  </span>
                </div>
                <span className="minhas-disciplinas__tile-badge">
                  {quickActions[2].badge}
                </span>
              </button>
            </div>
          </div>

          {/* Module 2: Avisos Recentes (Blue Container) */}
          <div className="minhas-disciplinas__recent-notices-card">
            <div className="minhas-disciplinas__notices-header">
              <div className="minhas-disciplinas__notices-title-group">
                <div className="minhas-disciplinas__icon-container minhas-disciplinas__icon-container--white">
                  <MegaphoneIcon />
                </div>
                <h2 className="minhas-disciplinas__notices-title">
                  Avisos Recentes
                </h2>
              </div>
            </div>

            <div className="minhas-disciplinas__notices-list">
              {recentNotices.map((notice) => (
                <button
                  type="button"
                  key={notice.id}
                  className="minhas-disciplinas__notice-item-btn"
                  onClick={() => setActiveNoticeModal(notice)}
                  title="Clique para ler o aviso completo"
                >
                  <div className="minhas-disciplinas__notice-item-top">
                    <span className="minhas-disciplinas__notice-course">
                      {notice.discipline}
                    </span>
                    <span className="minhas-disciplinas__notice-time">
                      {notice.timestamp}
                    </span>
                  </div>
                  <h3 className="minhas-disciplinas__notice-item-title">
                    {notice.title}
                  </h3>
                  <p className="minhas-disciplinas__notice-item-desc">
                    {notice.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Modal for Notice Detail */}
      {activeNoticeModal && (
        <div
          className="minhas-disciplinas__modal-overlay"
          onClick={() => setActiveNoticeModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="minhas-disciplinas__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="minhas-disciplinas__modal-header">
              <div>
                <span className="minhas-disciplinas__modal-badge">
                  {activeNoticeModal.discipline} • {activeNoticeModal.timestamp}
                </span>
                <h3 className="minhas-disciplinas__modal-title">
                  {activeNoticeModal.title}
                </h3>
              </div>
              <button
                type="button"
                className="minhas-disciplinas__modal-close"
                onClick={() => setActiveNoticeModal(null)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            <div className="minhas-disciplinas__modal-body">
              <p>{activeNoticeModal.description}</p>
              <div className="minhas-disciplinas__modal-note">
                Esta mensagem foi comunicada pelo corpo docente da turma.
              </div>
            </div>
            <div className="minhas-disciplinas__modal-footer">
              <button
                type="button"
                className="minhas-disciplinas__modal-btn-primary"
                onClick={() => {
                  setActiveNoticeModal(null)
                  showToast('Aviso marcado como lido!')
                }}
              >
                Marcar como lido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Quick Action */}
      {activeQuickActionModal && (
        <div
          className="minhas-disciplinas__modal-overlay"
          onClick={() => setActiveQuickActionModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="minhas-disciplinas__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="minhas-disciplinas__modal-header">
              <div>
                <span className="minhas-disciplinas__modal-badge">
                  Acesso Rápido Acadêmico
                </span>
                <h3 className="minhas-disciplinas__modal-title">
                  {activeQuickActionModal.title}
                </h3>
              </div>
              <button
                type="button"
                className="minhas-disciplinas__modal-close"
                onClick={() => setActiveQuickActionModal(null)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            <div className="minhas-disciplinas__modal-body">
              <p>{activeQuickActionModal.subtitle}</p>
              <div className="minhas-disciplinas__modal-quick-info">
                <strong>Status:</strong> Disponível para solicitação no semestre
                letivo 2026.2.
              </div>
            </div>
            <div className="minhas-disciplinas__modal-footer">
              <button
                type="button"
                className="minhas-disciplinas__modal-btn-secondary"
                onClick={() => setActiveQuickActionModal(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="minhas-disciplinas__modal-btn-primary"
                onClick={() => {
                  const title = activeQuickActionModal.title
                  setActiveQuickActionModal(null)
                  showToast(`${title} processado com sucesso!`)
                }}
              >
                Confirmar Ação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MinhasDisciplinas
