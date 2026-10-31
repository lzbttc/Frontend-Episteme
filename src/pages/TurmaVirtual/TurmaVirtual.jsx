import { useState } from 'react'

import Button from '../../components/Button/Button'
import GaugeCard from '../../components/GaugeCard/GaugeCard'
import ActivityCard from '../../components/ActivityCard/ActivityCard'
import ModuleCard from '../../components/ModuleCard/ModuleCard'
import NoticeCard from '../../components/NoticeCard/NoticeCard'
import ResourceItem from '../../components/ResourceItem/ResourceItem'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import {
  UserFilledIcon,
  ClockSolidIcon,
  BuildingIcon,
  PdfIcon,
  MessageLinesIcon,
  MegaphoneIcon,
  LinkIcon,
  HelpChatIcon,
} from '../../components/icons'

import { studentMock } from '../../mocks/studentMock'
import { turmaVirtualMock } from '../../mocks/turmaVirtualMock'

import './TurmaVirtual.css'

function TurmaVirtual() {
  // Provisório até a Fase 2 (rota por id): abre sempre a primeira disciplina.
  // Leitura dos dados concentrada aqui: na integração com o backend, este
  // bloco vira uma chamada à API (com estados de carregando e erro).
  const discipline = studentMock.disciplines[0]
  const { metrics, modules, activities, notices, resources } =
    turmaVirtualMock[discipline.id]

  const totalContentItems = modules.reduce((sum, m) => sum + m.items.length, 0)

  const pendingActivities = activities.filter(
    (activity) => activity.status !== 'completed'
  ).length

  const gauges = [
    {
      id: 'average',
      value: metrics.average.toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
      }),
      label: 'MÉDIA GERAL',
      percentage: Math.round(metrics.average * 10),
    },
    {
      id: 'attendance',
      value: `${metrics.attendance}%`,
      label: 'FREQUÊNCIA',
      percentage: metrics.attendance,
    },
    {
      id: 'pending',
      value: String(pendingActivities),
      label: 'PENDÊNCIAS',
      percentage: activities.length
        ? Math.round((pendingActivities / activities.length) * 100)
        : 0,
    },
  ]

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
          <span>{discipline.name}</span>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Turma {discipline.semester}</span>
        </nav>

        <div className="turma-virtual__course-main">
          <div className="turma-virtual__course-info">
            <h1 className="turma-virtual__course-title">{discipline.name}</h1>

            <p className="turma-virtual__detail">
              <UserFilledIcon size={11} />
              {discipline.professor} ({discipline.department} /{' '}
              {discipline.campus})
            </p>

            <p className="turma-virtual__detail">
              <ClockSolidIcon size={14} />
              {discipline.schedule}
            </p>

            <p className="turma-virtual__detail">
              <BuildingIcon size={12} />
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
                <PdfIcon size={15} />
                Plano de Ensino (PDF)
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  showPendingIntegration('O contato com o professor')
                }
              >
                <MessageLinesIcon size={15} />
                Falar com Professor
              </Button>
            </div>

            <div className="turma-virtual__gauges">
              {gauges.map((gauge) => (
                <GaugeCard
                  key={gauge.id}
                  value={gauge.value}
                  label={gauge.label}
                  percentage={gauge.percentage}
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
                {(activeTab === 'overview' ? modules.slice(0, 2) : modules).map(
                  (module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      defaultExpanded={
                        activeTab === 'overview'
                          ? module.status !== 'completed'
                          : false
                      }
                      onMaterialAction={handleMaterialAction}
                    />
                  )
                )}
              </div>
            </section>
          )}

          {(activeTab === 'overview' || activeTab === 'activities') && (
            <section className="turma-virtual__content-panel">
              <SectionHeading
                title="Atividades da Disciplina"
                subtitle="Quadro unificado de tarefas avaliativas e estudos autônomos"
                actionLabel={activeTab === 'overview' ? 'Ver todas' : undefined}
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
                <MegaphoneIcon size={17} />
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
              onClick={() => showPendingIntegration('O fórum da disciplina')}
            >
              Acessar Fórum da Disciplina
            </Button>
          </section>

          {/* Resources & links */}
          <section className="turma-virtual__resource-panel">
            <header className="turma-virtual__resource-heading">
              <LinkIcon size={17} />

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
            <HelpChatIcon size={20} />

            <div>
              <h2>Dúvidas acadêmicas ou de matrícula?</h2>

              <button
                type="button"
                onClick={() =>
                  showPendingIntegration(
                    `O contato com a Secretaria do ${discipline.department}`
                  )
                }
              >
                Contatar Secretaria do {discipline.department}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default TurmaVirtual
