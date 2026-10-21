import { useState, useEffect } from 'react'
import GaugeCard from '../../components/GaugeCard/GaugeCard'
import { turmaVirtualMock } from '../../mocks/turmaVirtualMock'
import './TurmaVirtual.css'

function TurmaVirtual({ onNavigate }) {
  const {
    title,
    code,
    semester,
    professor,
    schedule,
    room,
    breadcrumbs,
    metrics,
    tabs,
    modules,
    activities,
    notices,
    resources,
    support,
  } = turmaVirtualMock

  const [activeTab, setActiveTab] = useState('visao-geral')
  const [isModule1Expanded, setIsModule1Expanded] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [activeActivityModal, setActiveActivityModal] = useState(null)

  useEffect(() => {
    document.title = 'Turma 2026.2 — Turma Virtual | Episteme'
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageText.trim()) return
    setContactModalOpen(false)
    setMessageText('')
    showToast('Mensagem enviada com sucesso para o Prof. Dr. Rafael Oliveira!')
  }

  const handleBreadcrumbClick = (item) => {
    if (item.route && onNavigate) {
      onNavigate(item.route)
    }
  }

  return (
    <div className="turma-virtual">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="turma-virtual__toast" role="status">
          <svg
            viewBox="0 0 16.667 16.667"
            className="turma-virtual__toast-icon"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.167 12.167 L13.042 6.292 L11.875 5.125 L7.167 9.833 L4.792 7.458 L3.625 8.625 L7.167 12.167 Z M8.333 16.667 C3.731 16.667 0 12.936 0 8.333 C0 3.731 3.731 0 8.333 0 C12.936 0 16.667 3.731 16.667 8.333 C16.667 12.936 12.936 16.667 8.333 16.667 Z"
              fill="#10b981"
            />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Card da Turma Virtual */}
      <header className="turma-virtual__header-card">
        {/* Breadcrumb Navigation */}
        <nav className="turma-virtual__nav" aria-label="Navegação estrutural">
          {breadcrumbs.map((crumb, idx) => {
            const isCurrent =
              crumb.current ||
              crumb.route === 'turma-virtual' ||
              idx === breadcrumbs.length - 1
            return (
              <span
                key={crumb.label}
                className="turma-virtual__breadcrumb-wrapper"
              >
                {crumb.route && !isCurrent ? (
                  <button
                    type="button"
                    className="turma-virtual__breadcrumb-link"
                    onClick={() => handleBreadcrumbClick(crumb)}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className={`turma-virtual__breadcrumb-tag ${isCurrent ? 'turma-virtual__breadcrumb-tag--active' : ''}`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
                {idx < breadcrumbs.length - 1 && (
                  <svg
                    viewBox="0 0 4.317 7"
                    className="turma-virtual__breadcrumb-icon"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.683 3.5 L0 0.817 L0.817 0 L4.317 3.5 L0.817 7 L0 6.183 L2.683 3.5 Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </span>
            )
          })}
        </nav>

        {/* Informações Principais da Disciplina */}
        <div className="turma-virtual__header-main">
          {/* Lado Esquerdo: Título, Metadados e Código */}
          <div className="turma-virtual__header-info">
            <h1 className="turma-virtual__title">{title}</h1>

            <div className="turma-virtual__metadata-row">
              {/* Professor */}
              <div className="turma-virtual__metadata-item">
                <svg
                  viewBox="0 0 10.667 10.667"
                  className="turma-virtual__meta-icon"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5.333 5.333 C4.6 5.333 3.972 5.072 3.45 4.55 C2.928 4.028 2.667 3.4 2.667 2.667 C2.667 1.933 2.928 1.306 3.45 0.783 C3.972 0.261 4.6 0 5.333 0 C6.067 0 6.694 0.261 7.217 0.783 C7.739 1.306 8 1.933 8 2.667 C8 3.4 7.739 4.028 7.217 4.55 C6.694 5.072 6.067 5.333 5.333 5.333 M0 10.667 L0 8.8 C0 8.422 0.097 8.075 0.292 7.758 C0.486 7.442 0.744 7.2 1.067 7.033 C1.756 6.689 2.456 6.431 3.167 6.258 C3.878 6.086 4.6 6 5.333 6 C6.067 6 6.789 6.086 7.5 6.258 C8.211 6.431 8.911 6.689 9.6 7.033 C9.922 7.2 10.181 7.442 10.375 7.758 C10.569 8.075 10.667 8.422 10.667 8.8 L10.667 10.667 Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="turma-virtual__meta-highlight">
                  {professor.name}
                </span>
                <span className="turma-virtual__meta-sub">
                  ({professor.department})
                </span>
              </div>

              {/* Horário */}
              <div className="turma-virtual__metadata-item">
                <svg
                  viewBox="0 0 13.333 13.333"
                  className="turma-virtual__meta-icon"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M8.867 9.8 L9.8 8.867 L7.333 6.4 L7.333 3.333 L6 3.333 L6 6.933 L8.867 9.8 Z M6.667 13.333 C2.989 13.333 0 10.344 0 6.667 C0 2.989 2.989 0 6.667 0 C10.344 0 13.333 2.989 13.333 6.667 C13.333 10.344 10.344 13.333 6.667 13.333 Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="turma-virtual__meta-sub">{schedule}</span>
              </div>

              {/* Local / Sala */}
              <div className="turma-virtual__metadata-item">
                <svg
                  viewBox="0 0 12 12"
                  className="turma-virtual__meta-icon"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M0 12 L0 10.667 L1.333 10.667 L1.333 0 L8 0 L8 0.667 L10.667 0.667 L10.667 10.667 L12 10.667 L12 12 L9.333 12 L9.333 2 L8 2 L8 12 Z M5.333 6.667 C5.7 6.667 6 6.367 6 6 C6 5.633 5.7 5.333 5.333 5.333 C4.967 5.333 4.667 5.633 4.667 6 C4.667 6.367 4.967 6.667 5.333 6.667 Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="turma-virtual__meta-sub">{room}</span>
              </div>
            </div>

            <div className="turma-virtual__code-badge">
              <span>Código: {code}</span>
              <span className="turma-virtual__code-dot">•</span>
              <span>{semester}</span>
            </div>
          </div>

          {/* Lado Direito: Ações Rápidas e Indicadores Circulares */}
          <div className="turma-virtual__header-actions">
            <div className="turma-virtual__quick-buttons">
              <button
                type="button"
                className="turma-virtual__action-btn"
                onClick={() =>
                  showToast('Download do Plano de Ensino (PDF) iniciado.')
                }
              >
                <svg
                  viewBox="0 0 12 15"
                  className="turma-virtual__action-icon"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 12 L9 12 L9 10.5 L3 10.5 L3 12 Z M3 9 L9 9 L9 7.5 L3 7.5 L3 9 Z M1.5 15 C0.675 15 0 14.325 0 13.5 L0 1.5 C0 0.675 0.675 0 1.5 0 L7.5 0 L12 4.5 L12 13.5 C12 14.325 11.325 15 10.5 15 Z M6.75 5.25 L6.75 1.5 L1.5 1.5 L1.5 13.5 L10.5 13.5 L10.5 5.25 Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Plano de Ensino (PDF)</span>
              </button>

              <button
                type="button"
                className="turma-virtual__action-btn"
                onClick={() => setContactModalOpen(true)}
              >
                <svg
                  viewBox="0 0 15 15"
                  className="turma-virtual__action-icon"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9 L9 9 L9 7.5 L3 7.5 L3 9 Z M3 6.75 L12 6.75 L12 5.25 L3 5.25 L3 6.75 Z M3 4.5 L12 4.5 L12 3 L3 3 L3 4.5 Z M0 15 L0 1.5 C0 0.675 0.675 0 1.5 0 L13.5 0 C14.325 0 15 0.675 15 1.5 L15 10.5 C15 11.325 14.325 12 13.5 12 L3 12 Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Falar com Professor</span>
              </button>
            </div>

            {/* Três Indicadores Circulares */}
            <div className="turma-virtual__gauges-group">
              {metrics.map((metric) => (
                <GaugeCard
                  key={metric.id}
                  value={metric.value}
                  label={metric.label}
                  percentage={metric.percentage}
                  color={metric.color}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Barra de Abas (Pill Style) */}
      <nav className="turma-virtual__tabs-nav" aria-label="Abas da disciplina">
        <div className="turma-virtual__tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`turma-virtual__tab-pill ${activeTab === tab.id ? 'turma-virtual__tab-pill--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 3. Grid Assimétrico de 2 Colunas */}
      <div className="turma-virtual__grid">
        {/* Coluna Principal (Esquerda - 8 colunas) */}
        <div className="turma-virtual__col-main">
          {/* Seção 1: Conteúdos Recentes */}
          {(activeTab === 'visao-geral' || activeTab === 'conteudos') && (
            <section className="turma-virtual__section-card">
              <div className="turma-virtual__card-header">
                <div>
                  <h2 className="turma-virtual__card-title">
                    Conteúdos Recentes
                  </h2>
                  <p className="turma-virtual__card-subtitle">
                    Cronograma e materiais disponibilizados pelo docente
                  </p>
                </div>
                <button
                  type="button"
                  className="turma-virtual__see-all-link"
                  onClick={() => setActiveTab('conteudos')}
                >
                  <span>Ver todas as aulas</span>
                  <svg
                    viewBox="0 0 10.667 10.667"
                    className="turma-virtual__arrow-icon"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M8.117 6 L0 6 L0 4.667 L8.117 4.667 L4.383 0.933 L5.333 0 L10.667 5.333 L5.333 10.667 L4.383 9.733 L8.117 6 Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>

              {/* Módulo 01: Concluído e Expansível */}
              <div
                className={`turma-virtual__module-completed ${isModule1Expanded ? 'turma-virtual__module-completed--open' : ''}`}
              >
                <button
                  type="button"
                  className="turma-virtual__module-trigger"
                  onClick={() => setIsModule1Expanded(!isModule1Expanded)}
                  aria-expanded={isModule1Expanded}
                >
                  <div className="turma-virtual__module-trigger-info">
                    <div
                      className="turma-virtual__check-circle"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 16.667 16.667"
                        className="turma-virtual__check-svg"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.167 12.167 L13.042 6.292 L11.875 5.125 L7.167 9.833 L4.792 7.458 L3.625 8.625 L7.167 12.167 Z M8.333 16.667 C7.181 16.667 6.097 16.448 5.083 16.01 C4.069 15.573 3.188 14.979 2.438 14.229 C1.688 13.479 1.094 12.597 0.656 11.583 C0.219 10.569 0 9.486 0 8.333 C0 7.181 0.219 6.097 0.656 5.083 C1.094 4.069 1.688 3.188 2.438 2.438 C3.188 1.688 4.069 1.094 5.083 0.656 C6.097 0.219 7.181 0 8.333 0 C9.486 0 10.569 0.219 11.583 0.656 C12.597 1.094 13.479 1.688 14.229 2.438 C14.979 3.188 15.573 4.069 16.01 5.083 C16.448 6.097 16.667 7.181 16.667 8.333 C16.667 9.486 16.448 10.569 16.01 11.583 C15.573 12.597 14.979 13.479 14.229 14.229 C13.479 14.979 12.597 15.573 11.583 16.01 C10.569 16.448 9.486 16.667 8.333 16.667 Z"
                          fill="#3b82f6"
                        />
                      </svg>
                    </div>
                    <div className="turma-virtual__module-text-group">
                      <h3 className="turma-virtual__module-title">
                        {modules[0].title}
                      </h3>
                      <p className="turma-virtual__module-desc">
                        {modules[0].statusText}
                      </p>
                    </div>
                  </div>

                  <div className="turma-virtual__module-trigger-icon">
                    <svg
                      viewBox="0 0 10 6.167"
                      className={`turma-virtual__chevron-down ${isModule1Expanded ? 'turma-virtual__chevron-down--rotate' : ''}`}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 6.167 L0 1.167 L1.167 0 L5 3.833 L8.833 0 L10 1.167 L5 6.167 Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </button>

                {/* Conteúdo Expansível do Módulo 01 */}
                {isModule1Expanded && (
                  <div className="turma-virtual__module-files-list">
                    {modules[0].files.map((file) => (
                      <div
                        key={file.id}
                        className="turma-virtual__module-file-item"
                      >
                        <div className="turma-virtual__file-info">
                          <span
                            className={`turma-virtual__file-badge turma-virtual__file-badge--${file.type.toLowerCase()}`}
                          >
                            {file.type}
                          </span>
                          <span className="turma-virtual__file-name">
                            {file.name}
                          </span>
                          <span className="turma-virtual__file-size">
                            ({file.size})
                          </span>
                        </div>
                        <button
                          type="button"
                          className="turma-virtual__icon-action-btn"
                          title={`Baixar ${file.name}`}
                          onClick={() => showToast(`Baixando ${file.name}...`)}
                        >
                          <svg
                            viewBox="0 0 13.333 13.333"
                            width="14"
                            height="14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.667 10 L2.5 5.833 L3.667 4.625 L5.833 6.792 L5.833 0 L7.5 0 L7.5 6.792 L9.667 4.625 L10.833 5.833 L6.667 10 Z M1.667 13.333 C0.742 13.333 0 12.591 0 11.667 L0 9.167 L1.667 9.167 L1.667 11.667 L11.667 11.667 L11.667 9.167 L13.333 9.167 L13.333 11.667 C13.333 12.591 12.591 13.333 11.667 13.333 Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Módulo 02: Em Andamento */}
              <div className="turma-virtual__module-active">
                <h3 className="turma-virtual__module-active-title">
                  {modules[1].title}
                </h3>

                <div className="turma-virtual__module-items-list">
                  {/* Item 1: Script SQL */}
                  <div className="turma-virtual__sub-item">
                    <div className="turma-virtual__sub-item-info">
                      <h4 className="turma-virtual__sub-item-title">
                        {modules[1].items[0].title}
                      </h4>
                      <p className="turma-virtual__sub-item-meta">
                        {modules[1].items[0].subtitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="turma-virtual__item-action-btn"
                      title="Baixar arquivo SQL"
                      onClick={() =>
                        showToast(
                          'Download do arquivo benchmark_indices.sql iniciado.'
                        )
                      }
                    >
                      <svg
                        viewBox="0 0 13.333 13.333"
                        className="turma-virtual__sub-item-svg"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M6.667 10 L2.5 5.833 L3.667 4.625 L5.833 6.792 L5.833 0 L7.5 0 L7.5 6.792 L9.667 4.625 L10.833 5.833 L6.667 10 Z M1.667 13.333 C1.208 13.333 0.816 13.17 0.49 12.844 C0.163 12.517 0 12.125 0 11.667 L0 9.167 L1.667 9.167 L1.667 11.667 L11.667 11.667 L11.667 9.167 L13.333 9.167 L13.333 11.667 C13.333 12.125 13.17 12.517 12.844 12.844 C12.517 13.17 12.125 13.333 11.667 13.333 Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Item 2: Video Aula */}
                  <div className="turma-virtual__sub-item">
                    <div className="turma-virtual__sub-item-info">
                      <h4 className="turma-virtual__sub-item-title">
                        {modules[1].items[1].title}
                      </h4>
                      <p className="turma-virtual__sub-item-meta">
                        {modules[1].items[1].subtitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="turma-virtual__item-action-btn"
                      title="Assistir gravação"
                      onClick={() =>
                        showToast(
                          'Carregando gravação síncrona da aula (52 min)...'
                        )
                      }
                    >
                      <svg
                        viewBox="0 0 15 15"
                        className="turma-virtual__sub-item-svg"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M1.667 15 C1.208 15 0.816 14.837 0.49 14.51 C0.163 14.184 0 13.792 0 13.333 L0 1.667 C0 1.208 0.163 0.816 0.49 0.49 C0.816 0.163 1.208 0 1.667 0 L7.5 0 L7.5 1.667 L1.667 1.667 L1.667 13.333 L13.333 13.333 L13.333 7.5 L15 7.5 L15 13.333 C15 13.792 14.837 14.184 14.51 14.51 C14.184 14.837 13.792 15 13.333 15 Z M5.583 10.583 L4.417 9.417 L12.167 1.667 L9.167 1.667 L9.167 0 L15 0 L15 5.833 L13.333 5.833 L13.333 2.833 L5.583 10.583 Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Seção 2: Atividades da Disciplina */}
          {(activeTab === 'visao-geral' || activeTab === 'atividades') && (
            <section className="turma-virtual__section-card">
              <div className="turma-virtual__card-header">
                <div>
                  <h2 className="turma-virtual__card-title">
                    Atividades da Disciplina
                  </h2>
                  <p className="turma-virtual__card-subtitle">
                    Quadro unificado de tarefas avaliativas e estudos autônomos
                  </p>
                </div>
              </div>

              <div className="turma-virtual__activities-list">
                {/* Atividade 1: Leitura Complementar */}
                <div className="turma-virtual__activity-card">
                  <div className="turma-virtual__activity-info">
                    <span className="turma-virtual__activity-badge-top">
                      {activities[0].badge}
                    </span>
                    <h3 className="turma-virtual__activity-title">
                      {activities[0].title}
                    </h3>
                    <div className="turma-virtual__activity-meta">
                      <div className="turma-virtual__meta-inline">
                        <svg
                          viewBox="0 0 10.5 11.667"
                          className="turma-virtual__calendar-icon"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M6.708 9.333 C6.3 9.333 5.955 9.192 5.673 8.91 C5.391 8.628 5.25 8.283 5.25 7.875 C5.25 7.467 5.391 7.122 5.673 6.84 C5.955 6.558 6.3 6.417 6.708 6.417 C7.117 6.417 7.462 6.558 7.744 6.84 C8.026 7.122 8.167 7.467 8.167 7.875 C8.167 8.283 8.026 8.628 7.744 8.91 C7.462 9.192 7.117 9.333 6.708 9.333 Z M1.167 11.667 C0.846 11.667 0.571 11.552 0.343 11.324 C0.114 11.095 0 10.821 0 10.5 L0 2.333 C0 2.012 0.114 1.738 0.343 1.509 C0.571 1.281 0.846 1.167 1.167 1.167 L1.75 1.167 L1.75 0 L2.917 0 L2.917 1.167 L7.583 1.167 L7.583 0 L8.75 0 L8.75 1.167 L9.333 1.167 C9.654 1.167 9.929 1.281 10.157 1.509 C10.386 1.738 10.5 2.012 10.5 2.333 L10.5 10.5 C10.5 10.821 10.386 11.095 10.157 11.324 C9.929 11.552 9.654 11.667 9.333 11.667 Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>{activities[0].deadline}</span>
                      </div>
                      <span className="turma-virtual__meta-bullet">•</span>
                      <span>{activities[0].meta}</span>
                    </div>
                  </div>

                  <div className="turma-virtual__activity-status-group">
                    <span className="turma-virtual__status-pill turma-virtual__status-pill--completed">
                      <svg
                        viewBox="0 0 9.508 7.015"
                        width="10"
                        height="8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.325 7.015 L0 3.69 L0.831 2.858 L3.325 5.352 L8.677 0 L9.508 0.831 L3.325 7.015 Z"
                          fill="#ffffff"
                        />
                      </svg>
                      <span>{activities[0].statusLabel}</span>
                    </span>

                    <button
                      type="button"
                      className="turma-virtual__activity-btn"
                      onClick={() => setActiveActivityModal(activities[0])}
                    >
                      {activities[0].actionLabel}
                    </button>
                  </div>
                </div>

                {/* Atividade 2: Avaliativa */}
                <div className="turma-virtual__activity-card">
                  <div className="turma-virtual__activity-info">
                    <span className="turma-virtual__activity-badge-top">
                      {activities[1].badge}
                    </span>
                    <h3 className="turma-virtual__activity-title">
                      {activities[1].title}
                    </h3>
                    <div className="turma-virtual__activity-meta">
                      <div className="turma-virtual__meta-inline">
                        <svg
                          viewBox="0 0 10.5 11.667"
                          className="turma-virtual__calendar-icon"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M6.708 9.333 C6.3 9.333 5.955 9.192 5.673 8.91 C5.391 8.628 5.25 8.283 5.25 7.875 C5.25 7.467 5.391 7.122 5.673 6.84 C5.955 6.558 6.3 6.417 6.708 6.417 C7.117 6.417 7.462 6.558 7.744 6.84 C8.026 7.122 8.167 7.467 8.167 7.875 C8.167 8.283 8.026 8.628 7.744 8.91 C7.462 9.192 7.117 9.333 6.708 9.333 Z M1.167 11.667 C0.846 11.667 0.571 11.552 0.343 11.324 C0.114 11.095 0 10.821 0 10.5 L0 2.333 C0 2.012 0.114 1.738 0.343 1.509 C0.571 1.281 0.846 1.167 1.167 1.167 L1.75 1.167 L1.75 0 L2.917 0 L2.917 1.167 L7.583 1.167 L7.583 0 L8.75 0 L8.75 1.167 L9.333 1.167 C9.654 1.167 9.929 1.281 10.157 1.509 C10.386 1.738 10.5 2.012 10.5 2.333 L10.5 10.5 C10.5 10.821 10.386 11.095 10.157 11.324 C9.929 11.552 9.654 11.667 9.333 11.667 Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>{activities[1].deadline}</span>
                      </div>
                      <span className="turma-virtual__meta-bullet">•</span>
                      <span>{activities[1].meta}</span>
                    </div>
                  </div>

                  <div className="turma-virtual__activity-status-group">
                    <span className="turma-virtual__status-pill turma-virtual__status-pill--pending">
                      <span>{activities[1].statusLabel}</span>
                    </span>

                    <button
                      type="button"
                      className="turma-virtual__activity-btn"
                      onClick={() => setActiveActivityModal(activities[1])}
                    >
                      {activities[1].actionLabel}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Coluna Lateral (Direita - 4 colunas) */}
        <aside className="turma-virtual__col-sidebar">
          {/* Card 1: Mural de Avisos da Turma */}
          {(activeTab === 'visao-geral' || activeTab === 'avisos') && (
            <section className="turma-virtual__notices-card">
              <header className="turma-virtual__notices-header">
                <div
                  className="turma-virtual__notices-icon-box"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 16.667 13.333"
                    className="turma-virtual__megaphone-icon"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.333 7.5 L13.333 5.833 L16.667 5.833 L16.667 7.5 Z M14.333 13.333 L11.667 11.333 L12.667 10 L15.333 12 Z M12.667 3.333 L11.667 2 L14.333 0 L15.333 1.333 Z M2.5 12.5 L2.5 9.167 L1.667 9.167 C0.75 9.167 0 8.417 0 7.5 L0 5.833 C0 4.917 0.75 4.167 1.667 4.167 L5 4.167 L9.167 1.667 L9.167 11.667 L5 9.167 L4.167 9.167 L4.167 12.5 Z M7.5 8.708 L7.5 4.625 L5.458 5.833 L1.667 5.833 L1.667 7.5 L5.458 7.5 Z"
                      fill="#1d4ed8"
                    />
                  </svg>
                </div>
                <h2 className="turma-virtual__notices-title">
                  Mural de Avisos
                </h2>
              </header>

              <div className="turma-virtual__notices-list">
                {notices.map((notice) => (
                  <article
                    key={notice.id}
                    className="turma-virtual__notice-item"
                  >
                    <div className="turma-virtual__notice-meta-row">
                      <span className="turma-virtual__notice-author">
                        {notice.author}
                      </span>
                      <span className="turma-virtual__notice-date">
                        {notice.date}
                      </span>
                    </div>
                    <p className="turma-virtual__notice-message">
                      {notice.message}
                    </p>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="turma-virtual__forum-btn"
                onClick={() =>
                  showToast('Acessando o Fórum de Discussões da disciplina...')
                }
              >
                Acessar Fórum da Disciplina
              </button>
            </section>
          )}

          {/* Card 2: Recursos & Links Úteis */}
          <section className="turma-virtual__section-card">
            <header className="turma-virtual__resources-header">
              <svg
                viewBox="0 0 16.667 8.333"
                className="turma-virtual__resources-head-icon"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M7.5 8.333 L4.167 8.333 C1.867 8.333 0 6.467 0 4.167 C0 1.867 1.867 0 4.167 0 L7.5 0 L7.5 1.667 L4.167 1.667 C2.792 1.667 1.667 2.792 1.667 4.167 C1.667 5.542 2.792 6.667 4.167 6.667 L7.5 6.667 Z M5 5 L5 3.333 L11.667 3.333 L11.667 5 Z M9.167 8.333 L9.167 6.667 L12.5 6.667 C13.875 6.667 15 5.542 15 4.167 C15 2.792 13.875 1.667 12.5 1.667 L9.167 1.667 L9.167 0 L12.5 0 C14.8 0 16.667 1.867 16.667 4.167 C16.667 6.467 14.8 8.333 12.5 8.333 Z"
                  fill="currentColor"
                />
              </svg>
              <h2 className="turma-virtual__resources-title">
                Recursos & Links Úteis
              </h2>
            </header>

            <div className="turma-virtual__resources-list">
              {/* Ementa */}
              <button
                type="button"
                className="turma-virtual__resource-item"
                onClick={() =>
                  showToast('Abrindo Ementa e Bibliografia da disciplina.')
                }
              >
                <div className="turma-virtual__resource-info-group">
                  <svg
                    viewBox="0 0 16.5 12"
                    className="turma-virtual__resource-svg"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M9.75 4.425 L9.75 3.15 C10.584 2.844 11.447 2.669 12.375 2.625 C13.019 2.65 13.95 2.813 14.25 2.888 L14.25 4.088 C13.647 3.891 12.712 3.75 12.375 3.75 C11.444 3.75 10.569 4.047 9.75 4.425 Z M4.125 9 C5.284 9 6.95 9.525 7.5 9.788 L7.5 2.4 C6.444 1.875 5.294 1.575 4.125 1.5 C3.228 1.544 1.913 1.85 1.5 2.025 L1.5 9.45 C2.372 9.188 3.234 9.038 4.125 9 Z M9 9.788 C10.103 9.328 11.788 9 12.375 9 C13.266 9.038 14.563 9.3 15 9.45 L15 2.025 C14.159 1.719 12.825 1.5 12.375 1.5 C11.206 1.575 9.512 2.1 9 2.4 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <div className="turma-virtual__resource-texts">
                    <span className="turma-virtual__resource-name">
                      {resources[0].title}
                    </span>
                    <span className="turma-virtual__resource-desc">
                      {resources[0].description}
                    </span>
                  </div>
                </div>
                <svg
                  viewBox="0 0 4.933 8"
                  className="turma-virtual__chevron-right"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3.067 4 L0 0.933 L0.933 0 L4.933 4 L0.933 8 L0 7.067 L3.067 4 Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              {/* Repositório Git */}
              <a
                href={resources[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="turma-virtual__resource-item"
              >
                <div className="turma-virtual__resource-info-group">
                  <svg
                    viewBox="0 0 15 12"
                    className="turma-virtual__resource-svg"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.5 12 C0.675 12 0 11.325 0 10.5 L0 1.5 C0 0.675 0.675 0 1.5 0 L13.5 0 C14.325 0 15 0.675 15 1.5 L15 10.5 C15 11.325 14.325 12 13.5 12 Z M4.125 9.75 L3.075 8.7 L5.006 6.75 L3.056 4.8 L4.125 3.75 L7.125 6.75 Z M7.5 9.75 L7.5 8.25 L12 8.25 L12 9.75 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <div className="turma-virtual__resource-texts">
                    <span className="turma-virtual__resource-name">
                      {resources[1].title}
                    </span>
                    <span className="turma-virtual__resource-desc turma-virtual__resource-desc--break">
                      {resources[1].description}
                    </span>
                  </div>
                </div>
                <svg
                  viewBox="0 0 12 12"
                  className="turma-virtual__external-icon"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M1.333 12 C0.6 12 0 11.4 0 10.667 L0 1.333 C0 0.6 0.6 0 1.333 0 L6 0 L6 1.333 L1.333 1.333 L1.333 10.667 L10.667 10.667 L10.667 6 L12 6 L12 10.667 C12 11.4 11.4 12 10.667 12 Z M4.467 8.467 L3.533 7.533 L9.733 1.333 L7.333 1.333 L7.333 0 L12 0 L12 4.667 L10.667 4.667 L10.667 2.267 Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              {/* Calendário */}
              <button
                type="button"
                className="turma-virtual__resource-item"
                onClick={() =>
                  showToast('Sincronizando provas com Google Agenda...')
                }
              >
                <div className="turma-virtual__resource-info-group">
                  <svg
                    viewBox="0 0 13.5 15"
                    className="turma-virtual__resource-svg"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.5 15 C0.675 15 0 14.325 0 13.5 L0 3 C0 2.175 0.675 1.5 1.5 1.5 L2.25 1.5 L2.25 0 L3.75 0 L3.75 1.5 L9.75 1.5 L9.75 0 L11.25 0 L11.25 1.5 L12 1.5 C12.825 1.5 13.5 2.175 13.5 3 L13.5 13.5 C13.5 14.325 12.825 15 12 15 Z M1.5 13.5 L12 13.5 L12 6 L1.5 6 Z M6.75 9 C6.336 9 6 8.664 6 8.25 C6 7.836 6.336 7.5 6.75 7.5 C7.164 7.5 7.5 7.836 7.5 8.25 C7.5 8.664 7.164 9 6.75 9 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <div className="turma-virtual__resource-texts">
                    <span className="turma-virtual__resource-name">
                      {resources[2].title}
                    </span>
                    <span className="turma-virtual__resource-desc">
                      {resources[2].description}
                    </span>
                  </div>
                </div>
                <svg
                  viewBox="0 0 4.933 8"
                  className="turma-virtual__chevron-right"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3.067 4 L0 0.933 L0.933 0 L4.933 4 L0.933 8 L0 7.067 L3.067 4 Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Card 3: Suporte Acadêmico Integrado */}
          <div className="turma-virtual__support-card">
            <div className="turma-virtual__support-icon" aria-hidden="true">
              <svg
                viewBox="0 0 17 20"
                width="20"
                height="20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 20 L8.75 17 L8.5 17 C3.8 17 0 13.2 0 8.5 C0 3.8 3.8 0 8.5 0 C13.2 0 17 3.8 17 8.5 C17 12.8 13.5 16.3 9 20 Z M8.5 15 C12.1 15 15 12.1 15 8.5 C15 4.9 12.1 2 8.5 2 C4.9 2 2 4.9 2 8.5 C2 12.1 4.9 15 8.5 15 Z M8.5 13.975 C8.192 13.975 7.95 13.733 7.95 13.45 C7.95 13.167 8.192 12.925 8.5 12.925 C8.808 12.925 9.05 13.167 9.05 13.45 C9.05 13.733 8.808 13.975 8.5 13.975 Z M7.75 10.8 L9.25 10.8 C9.25 9.8 10.35 9.2 10.35 8.65 C10.9 8.1 11.4 7.4 11.4 6.55 C11.4 4.9 10.1 4 8.5 4 C6.9 4 5.6 5.2 5.6 6.1 L7 6.65 C7.2 5.9 7.7 5.4 8.5 5.4 C9.3 5.4 9.85 5.9 9.85 6.6 C9.85 7.3 9.2 7.7 8.5 8.3 C7.9 8.9 7.75 9.6 7.75 10.8 Z"
                  fill="#ffffff"
                />
              </svg>
            </div>
            <div className="turma-virtual__support-body">
              <p className="turma-virtual__support-title">{support.question}</p>
              <a
                href={`mailto:${support.contactEmail}`}
                className="turma-virtual__support-link"
                onClick={(e) => {
                  e.preventDefault()
                  showToast(`Contato DCC: ${support.contactEmail}`)
                }}
              >
                {support.actionText}
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal: Contato com Professor */}
      {contactModalOpen && (
        <div
          className="turma-virtual__modal-backdrop"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="turma-virtual__modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-contact-title"
          >
            <div className="turma-virtual__modal-header">
              <h3
                id="modal-contact-title"
                className="turma-virtual__modal-title"
              >
                Falar com Professor
              </h3>
              <button
                type="button"
                className="turma-virtual__modal-close-btn"
                onClick={() => setContactModalOpen(false)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className="turma-virtual__modal-info">
              Destinatário: <strong>{professor.name}</strong> (
              {professor.department})
            </p>

            <form onSubmit={handleSendMessage}>
              <div className="turma-virtual__form-group">
                <label
                  htmlFor="contact-message"
                  className="turma-virtual__form-label"
                >
                  Mensagem:
                </label>
                <textarea
                  id="contact-message"
                  className="turma-virtual__textarea"
                  rows="4"
                  required
                  placeholder="Escreva sua dúvida sobre conteúdos, exercícios ou avaliações..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>

              <div className="turma-virtual__modal-actions">
                <button
                  type="button"
                  className="turma-virtual__btn-secondary"
                  onClick={() => setContactModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="turma-virtual__btn-primary">
                  Enviar Mensagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Atividade */}
      {activeActivityModal && (
        <div
          className="turma-virtual__modal-backdrop"
          onClick={() => setActiveActivityModal(null)}
        >
          <div
            className="turma-virtual__modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-act-title"
          >
            <div className="turma-virtual__modal-header">
              <span className="turma-virtual__activity-badge-top">
                {activeActivityModal.badge}
              </span>
              <button
                type="button"
                className="turma-virtual__modal-close-btn"
                onClick={() => setActiveActivityModal(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <h3 id="modal-act-title" className="turma-virtual__modal-title">
              {activeActivityModal.title}
            </h3>

            <div className="turma-virtual__modal-meta-box">
              <p>
                <strong>Prazo de entrega:</strong>{' '}
                {activeActivityModal.deadline}
              </p>
              <p>
                <strong>Formato / Detalhes:</strong> {activeActivityModal.meta}
              </p>
              <p>
                <strong>Situação atual:</strong>{' '}
                <span
                  className={`turma-virtual__status-inline ${activeActivityModal.status === 'concluido' ? 'turma-virtual__status-inline--success' : 'turma-virtual__status-inline--warning'}`}
                >
                  {activeActivityModal.statusLabel}
                </span>
              </p>
            </div>

            <div className="turma-virtual__modal-actions">
              <button
                type="button"
                className="turma-virtual__btn-secondary"
                onClick={() => setActiveActivityModal(null)}
              >
                Fechar
              </button>
              <button
                type="button"
                className="turma-virtual__btn-primary"
                onClick={() => {
                  const act = activeActivityModal
                  setActiveActivityModal(null)
                  showToast(
                    act.status === 'concluido'
                      ? 'Abrindo visualizador do artigo VLDB...'
                      : 'Iniciando tentativa da Lista de Exercícios 02...'
                  )
                }}
              >
                {activeActivityModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TurmaVirtual
