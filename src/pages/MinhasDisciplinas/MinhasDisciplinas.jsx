import { useState, useMemo, useEffect } from 'react'
import { minhasDisciplinasMock } from '../../mocks/minhasDisciplinasMock'
import './MinhasDisciplinas.css'

function MinhasDisciplinas({ onNavigate }) {
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

  useEffect(() => {
    document.title = 'Minhas Disciplinas | Episteme'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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
    if (onNavigate) {
      onNavigate(discipline.route || 'turma-virtual')
    }
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
          <svg
            viewBox="0 0 20 20"
            className="minhas-disciplinas__toast-icon"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707l-4.5 4.5a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L8.5 10.586l3.793-3.793a1 1 0 011.414 1.414z"
              fill="currentColor"
            />
          </svg>
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
            <button
              type="button"
              className="minhas-disciplinas__breadcrumb-link"
              onClick={() => onNavigate && onNavigate('inicio')}
              title="Voltar para a Página Inicial"
            >
              Portal Acadêmico
            </button>
            <span
              className="minhas-disciplinas__breadcrumb-separator"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 6 10"
                width="6"
                height="10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L1 9"
                  stroke="#71717A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
          <svg
            className="minhas-disciplinas__search-icon"
            viewBox="0 0 13.5 13.5"
            width="14"
            height="14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12.45 13.5 L7.725 8.775 C7.35 9.075 6.919 9.313 6.431 9.488 C5.944 9.663 5.425 9.75 4.875 9.75 C3.513 9.75 2.359 9.278 1.416 8.334 C0.472 7.391 0 6.238 0 4.875 C0 3.513 0.472 2.359 1.416 1.416 C2.359 0.472 3.513 0 4.875 0 C6.238 0 7.391 0.472 8.334 1.416 C9.278 2.359 9.75 3.513 9.75 4.875 C9.75 5.425 9.663 5.944 9.488 6.431 C9.313 6.919 9.075 7.35 8.775 7.725 L13.5 12.45 L12.45 13.5 M4.875 8.25 C5.813 8.25 6.609 7.922 7.266 7.266 C7.922 6.609 8.25 5.813 8.25 4.875 C8.25 3.938 7.922 3.141 7.266 2.484 C6.609 1.828 5.813 1.5 4.875 1.5 C3.938 1.5 3.141 1.828 2.484 2.484 C1.828 3.141 1.5 3.938 1.5 4.875 C1.5 5.813 1.828 6.609 2.484 7.266 C3.141 7.922 3.938 8.25 4.875 8.25"
              fill="#71717A"
            />
          </svg>
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
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
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
                        <svg
                          viewBox="0 0 57.082 63.122"
                          className="minhas-disciplinas__banner-svg minhas-disciplinas__banner-svg--top"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.815 9.985 C4.541 -0.182 19.975 -3.059 35.287 3.559 C50.599 10.177 59.992 23.783 56.266 33.949 C54.504 38.76 50.119 41.936 44.367 43.249 C47.847 47.458 49.312 52.22 47.848 56.215 C45.27 63.248 34.592 65.239 23.999 60.66 C13.405 56.082 6.908 46.668 9.485 39.635 C10.139 37.852 11.312 36.394 12.873 35.284 C3.073 28.106 -2.115 17.982 0.815 9.985 Z"
                            fill="rgba(255, 255, 255, 0.4)"
                          />
                        </svg>
                        <svg
                          viewBox="0 0 57.082 63.122"
                          className="minhas-disciplinas__banner-svg minhas-disciplinas__banner-svg--bottom"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.815 9.985 C4.541 -0.182 19.975 -3.059 35.287 3.559 C50.599 10.177 59.992 23.783 56.266 33.949 C54.504 38.76 50.119 41.936 44.367 43.249 C47.847 47.458 49.312 52.22 47.848 56.215 C45.27 63.248 34.592 65.239 23.999 60.66 C13.405 56.082 6.908 46.668 9.485 39.635 C10.139 37.852 11.312 36.394 12.873 35.284 C3.073 28.106 -2.115 17.982 0.815 9.985 Z"
                            fill="rgba(255, 255, 255, 0.25)"
                          />
                        </svg>
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
                        <svg
                          viewBox="0 0 14 14"
                          width="14"
                          height="14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="minhas-disciplinas__info-icon"
                          aria-hidden="true"
                        >
                          <path
                            d="M2.567 10.067 C3.133 9.633 3.767 9.292 4.467 9.042 C5.167 8.792 5.9 8.667 6.667 8.667 C7.433 8.667 8.167 8.792 8.867 9.042 C9.567 9.292 10.2 9.633 10.767 10.067 C11.156 9.611 11.458 9.094 11.675 8.517 C11.892 7.939 12 7.322 12 6.667 C12 5.189 11.481 3.931 10.442 2.892 C9.403 1.853 8.144 1.333 6.667 1.333 C5.189 1.333 3.931 1.853 2.892 2.892 C1.853 3.931 1.333 5.189 1.333 6.667 C1.333 7.322 1.442 7.939 1.658 8.517 C1.875 9.094 2.178 9.611 2.567 10.067 M6.667 7.333 C6.011 7.333 5.458 7.108 5.008 6.658 C4.558 6.208 4.333 5.656 4.333 5 C4.333 4.344 4.558 3.792 5.008 3.342 C5.458 2.892 6.011 2.667 6.667 2.667 C7.322 2.667 7.875 2.892 8.325 3.342 C8.775 3.792 9 4.344 9 5 C9 5.656 8.775 6.208 8.325 6.658 C7.875 7.108 7.322 7.333 6.667 7.333"
                            fill="#71717A"
                          />
                        </svg>
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
                        <svg
                          viewBox="0 0 15 15"
                          width="14"
                          height="14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="minhas-disciplinas__info-icon"
                          aria-hidden="true"
                        >
                          <path
                            d="M9.975 11.025 L11.025 9.975 L8.25 7.2 L8.25 3.75 L6.75 3.75 L6.75 7.8 L9.975 11.025 M7.5 15 C3.364 15 0 11.636 0 7.5 C0 3.364 3.364 0 7.5 0 C11.636 0 15 3.364 15 7.5 C15 11.636 11.636 15 7.5 15 Z M7.5 13.5 C10.814 13.5 13.5 10.814 13.5 7.5 C13.5 4.186 10.814 1.5 7.5 1.5 C4.186 1.5 1.5 4.186 1.5 7.5 C1.5 10.814 4.186 13.5 7.5 13.5 Z"
                            fill="#71717A"
                          />
                        </svg>
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
                          <svg
                            viewBox="0 0 12 12"
                            width="12"
                            height="12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="minhas-disciplinas__btn-arrow"
                            aria-hidden="true"
                          >
                            <path
                              d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
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
                <svg
                  viewBox="0 0 14 17"
                  width="14"
                  height="17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5.458 13.5 L9.771 7.25 L6.229 7.25 L6.875 1.5 L2.563 7.75 L6.104 7.75 L5.458 13.5 Z"
                    stroke="#090D16"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
                  <svg
                    viewBox="0 0 17 14"
                    width="17"
                    height="14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.667 13.333 C1.208 13.333 0.816 13.17 0.49 12.844 C0.163 12.517 0 12.125 0 11.667 L0 1.667 C0 1.208 0.163 0.816 0.49 0.49 C0.816 0.163 1.208 0 1.667 0 L15 0 C15.458 0 15.851 0.163 16.177 0.49 C16.503 0.816 16.667 1.208 16.667 1.667 L16.667 11.667 C16.667 12.125 16.503 12.517 16.177 12.844 C15.851 13.17 15.458 13.333 15 13.333 L1.667 13.333 M9.167 11.667 L11.25 11.667 L11.25 1.667 L9.167 1.667 L9.167 11.667 M5.417 11.667 L7.5 11.667 L7.5 1.667 L5.417 1.667 L5.417 11.667 M1.667 11.667 L3.75 11.667 L3.75 1.667 L1.667 1.667 L1.667 11.667 M12.917 11.667 L15 11.667 L15 1.667 L12.917 1.667 L12.917 11.667"
                      fill="#090D16"
                    />
                  </svg>
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
                  <svg
                    viewBox="0 0 14 17"
                    width="14"
                    height="17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.333 13.333 L10 13.333 L10 11.667 L3.333 11.667 M3.333 10 L10 10 L10 8.333 L3.333 8.333 M1.667 16.667 C1.208 16.667 0.816 16.503 0.49 16.177 C0.163 15.851 0 15.458 0 15 L0 1.667 C0 1.208 0.163 0.816 0.49 0.49 C0.816 0.163 1.208 0 1.667 0 L8.333 0 L13.333 5 L13.333 15 C13.333 15.458 13.17 15.851 12.844 16.177 C12.517 16.503 12.125 16.667 11.667 16.667 L1.667 16.667 M7.5 5.833 L7.5 1.667 L1.667 1.667 L1.667 15 L11.667 15 L11.667 5.833 L7.5 5.833"
                      fill="#090D16"
                    />
                  </svg>
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
                  <svg
                    viewBox="0 0 17 14"
                    width="17"
                    height="14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.167 13.333 L0 9.167 L4.167 5 L5.333 6.188 L3.188 8.333 L9.167 8.333 L9.167 10 L3.188 10 L5.333 12.146 L4.167 13.333 M12.5 8.333 L11.333 7.146 L13.479 5 L7.5 5 L7.5 3.333 L13.479 3.333 L11.333 1.188 L12.5 0 L16.667 4.167 L12.5 8.333"
                      fill="#090D16"
                    />
                  </svg>
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
                  <svg
                    viewBox="0 0 17 14"
                    width="17"
                    height="14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M13.333 7.5 L13.333 5.833 L16.667 5.833 L16.667 7.5 L13.333 7.5 M14.333 13.333 L11.667 11.333 L12.667 10 L15.333 12 L14.333 13.333 M12.667 3.333 L11.667 2 L14.333 0 L15.333 1.333 L12.667 3.333 M2.5 12.5 L2.5 9.167 L1.667 9.167 C1.208 9.167 0.816 9.003 0.49 8.677 C0.163 8.351 0 7.958 0 7.5 L0 5.833 C0 5.375 0.163 4.983 0.49 4.656 C0.816 4.33 1.208 4.167 1.667 4.167 L5 4.167 L9.167 1.667 L9.167 11.667 L5 9.167 L4.167 9.167 L4.167 12.5 L2.5 12.5 M7.5 8.708 L7.5 4.625 L5.458 5.833 L1.667 5.833 L1.667 7.5 L5.458 7.5 L7.5 8.708 M10 9.458 L10 3.875 C10.375 4.208 10.677 4.615 10.906 5.094 C11.135 5.573 11.25 6.097 11.25 6.667 C11.25 7.236 11.135 7.76 10.906 8.24 C10.677 8.719 10.375 9.125 10 9.458"
                      fill="#1D4ED8"
                    />
                  </svg>
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
