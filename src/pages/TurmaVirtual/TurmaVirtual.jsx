import { useState } from 'react'

import Button from '../../components/Button/Button'
import GaugeCard from '../../components/GaugeCard/GaugeCard'
import ActivityCard from '../../components/ActivityCard/ActivityCard'
import ModuleCard from '../../components/ModuleCard/ModuleCard'
import NoticeCard from '../../components/NoticeCard/NoticeCard'
import ResourceItem from '../../components/ResourceItem/ResourceItem'
import SectionHeading from '../../components/SectionHeading/SectionHeading'

import { turmaVirtualMock } from '../../mocks/turmaVirtualMock'

import './TurmaVirtual.css'

function TurmaVirtual() {
  const { discipline, metrics, modules, activities, notices, resources } =
    turmaVirtualMock

  const totalContentItems = modules.reduce((sum, m) => sum + m.items.length, 0)

  const tabs = [
    { id: 'overview', label: 'Visão geral' },
    { id: 'content', label: `Conteúdos & Aulas (${totalContentItems})` },
    { id: 'activities', label: `Atividades & Tarefas (${activities.length})` },
    { id: 'notices', label: `Avisos & Fórum (${notices.length})` },
  ]

  const [activeTab, setActiveTab] = useState('overview')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  function showPendingIntegration(message) {
    setFeedbackMessage(
      `${message} ainda não está integrado nesta versão do frontend.`
    )
  }

  function handleMaterialAction(item) {
    showPendingIntegration(`O acesso ao material "${item.title}"`)
  }

  function handleActivityAction(activity) {
    showPendingIntegration(
      `A ação "${activity.action}" da atividade "${activity.title}"`
    )
  }

  function handleResourceAction(resource) {
    showPendingIntegration(`O acesso ao recurso "${resource.title}"`)
  }

  function handleTabChange(tabId) {
    setActiveTab(tabId)
    setFeedbackMessage('')
  }

  return (
    <div className="turma-virtual">
      {/* 1. Course header card */}
      <section className="turma-virtual__course-card">
        <nav className="turma-virtual__breadcrumb" aria-label="Navegação">
          <a href="/inicio">Portal Acadêmico</a>
          <span aria-hidden="true">›</span>
          <a href="/inicio">Minhas disciplinas</a>
          <span aria-hidden="true">›</span>
          <span>{discipline.name.split(':')[0].trim()}</span>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Turma {discipline.semester}</span>
        </nav>

        <div className="turma-virtual__course-main">
          <div className="turma-virtual__course-info">
            <h1 className="turma-virtual__course-title">
              {discipline.name}
            </h1>

            <p className="turma-virtual__detail">
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5.33333 5.33333C4.6 5.33333 3.97222 5.07222 3.45 4.55C2.92778 4.02778 2.66667 3.4 2.66667 2.66667C2.66667 1.93333 2.92778 1.30556 3.45 0.783333C3.97222 0.261111 4.6 0 5.33333 0C6.06667 0 6.69444 0.261111 7.21667 0.783333C7.73889 1.30556 8 1.93333 8 2.66667C8 3.4 7.73889 4.02778 7.21667 4.55C6.69444 5.07222 6.06667 5.33333 5.33333 5.33333V5.33333M0 10.6667V8.8C0 8.42222 0.0972222 8.075 0.291667 7.75833C0.486111 7.44167 0.744444 7.2 1.06667 7.03333C1.75556 6.68889 2.45556 6.43056 3.16667 6.25833C3.87778 6.08611 4.6 6 5.33333 6C6.06667 6 6.78889 6.08611 7.5 6.25833C8.21111 6.43056 8.91111 6.68889 9.6 7.03333C9.92222 7.2 10.1806 7.44167 10.375 7.75833C10.5694 8.075 10.6667 8.42222 10.6667 8.8V10.6667H0V10.6667M1.33333 9.33333H9.33333V8.8C9.33333 8.67778 9.30278 8.56667 9.24167 8.46667C9.18056 8.36667 9.1 8.28889 9 8.23333C8.4 7.93333 7.79444 7.70833 7.18333 7.55833C6.57222 7.40833 5.95556 7.33333 5.33333 7.33333C4.71111 7.33333 4.09444 7.40833 3.48333 7.55833C2.87222 7.70833 2.26667 7.93333 1.66667 8.23333C1.56667 8.28889 1.48611 8.36667 1.425 8.46667C1.36389 8.56667 1.33333 8.67778 1.33333 8.8V9.33333V9.33333M5.33333 4C5.7 4 6.01389 3.86944 6.275 3.60833C6.53611 3.34722 6.66667 3.03333 6.66667 2.66667C6.66667 2.3 6.53611 1.98611 6.275 1.725C6.01389 1.46389 5.7 1.33333 5.33333 1.33333C4.96667 1.33333 4.65278 1.46389 4.39167 1.725C4.13056 1.98611 4 2.3 4 2.66667C4 3.03333 4.13056 3.34722 4.39167 3.60833C4.65278 3.86944 4.96667 4 5.33333 4V4"
                  fill="#71717A"
                />
              </svg>

              {discipline.professor} ({discipline.department} /{' '}
              {discipline.campus})
            </p>

            <p className="turma-virtual__detail">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8.86667 9.8L9.8 8.86667L7.33333 6.4V3.33333H6V6.93333L8.86667 9.8V9.8M6.66667 13.3333C5.74444 13.3333 4.87778 13.1583 4.06667 12.8083C3.25556 12.4583 2.55 11.9833 1.95 11.3833C1.35 10.7833 0.875 10.0778 0.525 9.26667C0.175 8.45555 0 7.58889 0 6.66667C0 5.74444 0.175 4.87778 0.525 4.06667C0.875 3.25556 1.35 2.55 1.95 1.95C2.55 1.35 3.25556 0.875 4.06667 0.525C4.87778 0.175 5.74444 0 6.66667 0C7.58889 0 8.45555 0.175 9.26667 0.525C10.0778 0.875 10.7833 1.35 11.3833 1.95C11.9833 2.55 12.4583 3.25556 12.8083 4.06667C13.1583 4.87778 13.3333 5.74444 13.3333 6.66667C13.3333 7.58889 13.1583 8.45555 12.8083 9.26667C12.4583 10.0778 11.9833 10.7833 11.3833 11.3833C10.7833 11.9833 10.0778 12.4583 9.26667 12.8083C8.45555 13.1583 7.58889 13.3333 6.66667 13.3333V13.3333M6.66667 12C8.14444 12 9.40278 11.4806 10.4417 10.4417C11.4806 9.40278 12 8.14444 12 6.66667C12 5.18889 11.4806 3.93056 10.4417 2.89167C9.40278 1.85278 8.14444 1.33333 6.66667 1.33333C5.18889 1.33333 3.93056 1.85278 2.89167 2.89167C1.85278 3.93056 1.33333 5.18889 1.33333 6.66667C1.33333 8.14444 1.85278 9.40278 2.89167 10.4417C3.93056 10.7833 5.18889 12 6.66667 12V12"
                  fill="#71717A"
                />
              </svg>

              {discipline.schedule}
            </p>

            <p className="turma-virtual__detail">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M0 12V10.6667H1.33333V0H8V0.666667H10.6667V10.6667H12V12H9.33333V2H8V12H0V12M2.66667 1.33333V1.33333V10.6667V10.6667V1.33333V1.33333M5.33333 6.66667C5.52222 6.66667 5.68056 6.60278 5.80833 6.475C5.93611 6.34722 6 6.18889 6 6C6 5.81111 5.93611 5.65278 5.80833 5.525C5.68056 5.39722 5.52222 5.33333 5.33333 5.33333C5.14444 5.33333 4.98611 5.39722 4.85833 5.525C4.73056 5.65278 4.66667 5.81111 4.66667 6C4.66667 6.18889 4.73056 6.34722 4.85833 6.475C4.98611 6.60278 5.14444 6.66667 5.33333 6.66667V6.66667M2.66667 10.6667H6.66667V1.33333H2.66667V10.6667V10.6667"
                  fill="#71717A"
                />
              </svg>

              {discipline.room}
            </p>

            <p className="turma-virtual__course-code">
              Código: {discipline.code}
            </p>
          </div>

          <div className="turma-virtual__course-side">
            <div className="turma-virtual__course-actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  showPendingIntegration('O download do plano de ensino')
                }
              >
                <svg
                  width="12"
                  height="15"
                  viewBox="0 0 12 15"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 12H9V10.5H3V12V12M3 9H9V7.5H3V9V9M1.5 15C1.0875 15 0.734375 14.8531 0.440625 14.5594C0.146875 14.2656 0 13.9125 0 13.5V1.5C0 1.0875 0.146875 0.734375 0.440625 0.440625C0.734375 0.146875 1.0875 0 1.5 0H7.5L12 4.5V13.5C12 13.9125 11.8531 14.2656 11.5594 14.5594C11.2656 14.8531 10.9125 15 10.5 15H1.5V15M6.75 5.25V1.5H1.5V13.5H10.5V5.25H6.75V5.25"
                    fill="#090D16"
                  />
                </svg>

                Plano de Ensino (PDF)
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  showPendingIntegration('O contato com o professor')
                }
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9H9V7.5H3V9V9M3 6.75H12V5.25H3V6.75V6.75M3 4.5H12V3H3V4.5V4.5M0 15V1.5C0 1.0875 0.146875 0.734375 0.440625 0.440625C0.734375 0.146875 1.0875 0 1.5 0H13.5C13.9125 0 14.2656 0.146875 14.5594 0.440625C14.8531 0.734375 15 1.0875 15 1.5V10.5C15 10.9125 14.8531 11.2656 14.5594 11.5594C14.2656 11.8531 13.9125 12 13.5 12H3L0 15V15M2.3625 10.5H13.5V10.5V10.5V1.5H1.5V11.3438L2.3625 10.5V10.5"
                    fill="#090D16"
                  />
                </svg>

                Falar com Professor
              </Button>
            </div>

            <div className="turma-virtual__gauges">
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
      </section>

      {/* 2. Feedback message */}
      {feedbackMessage && (
        <div
          className="turma-virtual__feedback"
          role="status"
          aria-live="polite"
        >
          <p>{feedbackMessage}</p>

          <button
            type="button"
            onClick={() => setFeedbackMessage('')}
            aria-label="Fechar mensagem"
          >
            ×
          </button>
        </div>
      )}

      {/* 3. Navigation tabs */}
      <div
        className="turma-virtual__tabs"
        role="tablist"
        aria-label="Seções da turma"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`turma-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`turma-panel-${tab.id}`}
            className={`turma-virtual__tab ${
              activeTab === tab.id ? 'turma-virtual__tab--active' : ''
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Content grid */}
      <div
        id={`turma-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`turma-tab-${activeTab}`}
        className="turma-virtual__content-grid"
      >
        {/* Main column */}
        <div className="turma-virtual__main-column">
          {(activeTab === 'overview' || activeTab === 'content') && (
            <section className="turma-virtual__content-panel">
              <SectionHeading
                title={
                  activeTab === 'overview'
                    ? 'Conteúdos Recentes'
                    : 'Conteúdos & Aulas'
                }
                subtitle="Cronograma e materiais disponibilizados pelo docente"
                actionLabel={
                  activeTab === 'overview' ? 'Ver todas as aulas' : undefined
                }
                onAction={() => handleTabChange('content')}
              />

              <div className="turma-virtual__module-list">
              {(activeTab === 'overview'
                  ? modules.slice(0, 2)
                  : modules
                ).map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    defaultExpanded={
                      activeTab === 'overview'
                        ? module.status !== 'Concluído'
                        : false
                    }
                    onMaterialAction={handleMaterialAction}
                  />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'overview' || activeTab === 'activities') && (
            <section className="turma-virtual__content-panel">
              <SectionHeading
                title="Atividades da Disciplina"
                subtitle="Quadro unificado de tarefas avaliativas e estudos autônomos"
                actionLabel={
                  activeTab === 'overview' ? 'Ver todas' : undefined
                }
                onAction={() => handleTabChange('activities')}
              />

              <div className="turma-virtual__activity-list">
                {(activeTab === 'overview'
                  ? activities.slice(0, 2)
                  : activities
                ).map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onAction={handleActivityAction}
                  />
                ))}
              </div>
            </section>
          )}

          {activeTab === 'notices' && (
            <section className="turma-virtual__content-panel">
              <SectionHeading
                title="Avisos & Fórum"
                subtitle="Comunicados da disciplina"
              />

              <div className="turma-virtual__notice-list">
                {notices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Side column */}
        <aside className="turma-virtual__side-column">
          {/* Notice board */}
          <section className="turma-virtual__notice-board">
            <header className="turma-virtual__notice-heading">
              <span className="turma-virtual__notice-heading-icon">
                <svg
                  width="17"
                  height="14"
                  viewBox="0 0 17 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M13.3333 7.5V5.83333H16.6667V7.5H13.3333V7.5M14.3333 13.3333L11.6667 11.3333L12.6667 10L15.3333 12L14.3333 13.3333V13.3333M12.6667 3.33333L11.6667 2L14.3333 0L15.3333 1.33333L12.6667 3.33333V3.33333M2.5 12.5V9.16667H1.66667C1.20833 9.16667 0.815972 9.00347 0.489583 8.67708C0.163194 8.35069 0 7.95833 0 7.5V5.83333C0 5.375 0.163194 4.98264 0.489583 4.65625C0.815972 4.32986 1.20833 4.16667 1.66667 4.16667H5L9.16667 1.66667V11.6667L5 9.16667H4.16667V12.5H2.5V12.5M7.5 8.70833V4.625L5.45833 5.83333H1.66667V7.5H5.45833L7.5 8.70833V8.70833M10 9.45833V3.875C10.375 4.20833 10.6771 4.61458 10.9062 5.09375C11.1354 5.57292 11.25 6.09722 11.25 6.66667C11.25 7.23611 11.1354 7.76042 10.9062 8.23958C10.6771 8.71875 10.375 9.125 10 9.45833V9.45833"
                    fill="#1D4ED8"
                  />
                </svg>
              </span>

              <h2>Mural de Avisos</h2>
            </header>

            <div className="turma-virtual__side-notices">
              {notices.slice(0, 2).map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="turma-virtual__forum-button"
              onClick={() =>
                showPendingIntegration('O fórum da disciplina')
              }
            >
              Acessar Fórum da Disciplina
            </Button>
          </section>

          {/* Resources & links */}
          <section className="turma-virtual__resource-panel">
            <header className="turma-virtual__resource-heading">
              <svg
                width="17"
                height="9"
                viewBox="0 0 17 9"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7.5 8.33333H4.16667C3.01389 8.33333 2.03125 7.92708 1.21875 7.11458C0.40625 6.30208 0 5.31944 0 4.16667C0 3.01389 0.40625 2.03125 1.21875 1.21875C2.03125 0.40625 3.01389 0 4.16667 0H7.5V1.66667H4.16667C3.47222 1.66667 2.88194 1.90972 2.39583 2.39583C1.90972 2.88194 1.66667 3.47222 1.66667 4.16667C1.66667 4.86111 1.90972 5.45139 2.39583 5.9375C2.88194 6.42361 3.47222 6.66667 4.16667 6.66667H7.5V8.33333V8.33333M5 5V3.33333H11.6667V5H5V5M9.16667 8.33333V6.66667H12.5C13.1944 6.66667 13.7847 6.42361 14.2708 5.9375C14.7569 5.45139 15 4.86111 15 4.16667C15 3.47222 14.7569 2.88194 14.2708 2.39583C13.7847 1.90972 13.1944 1.66667 12.5 1.66667H9.16667V0H12.5C13.6528 0 14.6354 0.40625 15.4479 1.21875C16.2604 2.03125 16.6667 3.01389 16.6667 4.16667C16.6667 5.31944 16.2604 6.30208 15.4479 7.11458C14.6354 7.92708 13.6528 8.33333 12.5 8.33333H9.16667V8.33333"
                  fill="#090D16"
                />
              </svg>

              <h2>Recursos & Links Úteis</h2>
            </header>

            <div className="turma-virtual__resource-list">
              {resources.map((resource) => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  onAction={handleResourceAction}
                />
              ))}
            </div>
          </section>

          {/* Help panel */}
          <section className="turma-virtual__help-panel">
            <svg
              width="17"
              height="20"
              viewBox="0 0 17 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 20L8.75 17H8.5C6.13333 17 4.125 16.175 2.475 14.525C0.825 12.875 0 10.8667 0 8.5C0 6.13333 0.825 4.125 2.475 2.475C4.125 0.825 6.13333 0 8.5 0C9.68333 0 10.7875 0.220833 11.8125 0.6625C12.8375 1.10417 13.7375 1.7125 14.5125 2.4875C15.2875 3.2625 15.8958 4.1625 16.3375 5.1875C16.7792 6.2125 17 7.31667 17 8.5C17 9.75 16.7958 10.95 16.3875 12.1C15.9792 13.25 15.4208 14.3167 14.7125 15.3C14.0042 16.2833 13.1625 17.175 12.1875 17.975C11.2125 18.775 10.15 19.45 9 20V20M11 16.35C12.1833 15.35 13.1458 14.1792 13.8875 12.8375C14.6292 11.4958 15 10.05 15 8.5C15 6.68333 14.3708 5.14583 13.1125 3.8875C11.8542 2.62917 10.3167 2 8.5 2C6.68333 2 5.14583 2.62917 3.8875 3.8875C2.62917 5.14583 2 6.68333 2 8.5C2 10.3167 2.62917 11.8542 3.8875 13.1125C5.14583 14.3708 6.68333 15 8.5 15H11V16.35V16.35M8.475 13.975C8.75833 13.975 9 13.875 9.2 13.675C9.4 13.475 9.5 13.2333 9.5 12.95C9.5 12.6667 9.4 12.425 9.2 12.225C9 12.025 8.75833 11.925 8.475 11.925C8.19167 11.925 7.95 12.025 7.75 12.225C7.55 12.425 7.45 12.6667 7.45 12.95C7.45 13.2333 7.55 13.475 7.75 13.675C7.95 13.875 8.19167 13.975 8.475 13.975V13.975M7.75 10.8H9.25C9.25 10.3 9.3 9.95 9.4 9.75C9.5 9.55 9.81667 9.18333 10.35 8.65C10.65 8.35 10.9 8.025 11.1 7.675C11.3 7.325 11.4 6.95 11.4 6.55C11.4 5.7 11.1125 5.0625 10.5375 4.6375C9.9625 4.2125 9.28333 4 8.5 4C7.76667 4 7.15 4.20417 6.65 4.6125C6.15 5.02083 5.8 5.51667 5.6 6.1L7 6.65C7.08333 6.36667 7.24167 6.0875 7.475 5.8125C7.70833 5.5375 8.05 5.4 8.5 5.4C8.95 5.4 9.2875 5.525 9.5125 5.775C9.7375 6.025 9.85 6.3 9.85 6.6C9.85 6.88333 9.76667 7.1375 9.6 7.3625C9.43333 7.5875 9.23333 7.81667 9 8.05C8.41667 8.55 8.0625 8.94583 7.9375 9.2375C7.8125 9.52917 7.75 10.05 7.75 10.8V10.8"
                fill="white"
              />
            </svg>

            <div>
              <h2>Dúvidas acadêmicas ou de matrícula?</h2>

              <button
                type="button"
                onClick={() =>
                  showPendingIntegration('O contato com a Secretaria do DCC')
                }
              >
                Contatar Secretaria do DCC
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default TurmaVirtual