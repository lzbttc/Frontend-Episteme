import { useEffect } from 'react'
import GaugeCard from '../../components/GaugeCard/GaugeCard'
import EventCard from '../../components/EventCard/EventCard'
import QuickActionCard from '../../components/QuickActionCard/QuickActionCard'
import NewsCard from '../../components/NewsCard/NewsCard'
import Button from '../../components/Button/Button'
import DisciplineCard from '../../components/DisciplineCard/DisciplineCard'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import { ArrowRightIcon, CalendarIcon, ZapIcon } from '../../components/icons'
import { studentMock } from '../../mocks/studentMock'
import './PaginaInicial.css'

function PaginaInicial({ onNavigate }) {
  const {
    student,
    metrics,
    disciplines,
    upcomingEvents,
    quickActions,
    latestNews,
  } = studentMock

  useEffect(() => {
    document.title = 'Portal Acadêmico | Episteme'
  }, [])

  return (
    <div className="pagina-inicial">
      {/* 1. Greeting & Academic Status Banner */}
      <section className="pagina-inicial__banner">
        <div className="pagina-inicial__greeting">
          <span className="pagina-inicial__badge">Portal Acadêmico</span>
          <h1 className="pagina-inicial__title">
            Boa tarde, {student.name.split(' ')[0]}!
          </h1>
          <p className="pagina-inicial__subtitle">
            Acompanhe suas disciplinas, notas, prazos e mantenha sua jornada
            acadêmica sempre em dia.
          </p>
        </div>

        <div className="pagina-inicial__gauges">
          {metrics.map((metric) => (
            <GaugeCard
              key={metric.id}
              value={metric.value}
              label={metric.label}
              percentage={metric.percentage}
            />
          ))}
        </div>
      </section>

      {/* 2. Minhas Disciplinas Section */}
      <section className="pagina-inicial__section">
        <SectionHeading
          title="Minhas Disciplinas"
          subtitle="Acompanhamento e acesso ao conteúdo das turmas virtuais"
          actionLabel="Ver todas"
          onAction={() => onNavigate && onNavigate('minhas-disciplinas')}
          className="pagina-inicial__disciplines-header"
        />

        <div className="pagina-inicial__disciplines-grid">
          {disciplines.map((discipline) => (
            <DisciplineCard
              key={discipline.id}
              discipline={discipline}
              onAccess={() => onNavigate && onNavigate('turma-virtual')}
            />
          ))}
        </div>
      </section>

      {/* 3. Compromissos & Acesso Rápido (2-Column Grid) */}
      <div className="pagina-inicial__two-col">
        {/* Left Column: Próximos compromissos (7 cols) */}
        <section className="pagina-inicial__section pagina-inicial__col-left pagina-inicial__compromissos-card">
          <SectionHeading
            icon={
              <div className="pagina-inicial__compromissos-icon-tile">
                <CalendarIcon size={20} />
              </div>
            }
            title="Próximos compromissos"
            subtitle="Atividades avaliativas e sessões presenciais"
            action={
              <Button variant="ghost-light" size="sm">
                Ver agenda
              </Button>
            }
            className="pagina-inicial__compromissos-header"
          />

          <div className="pagina-inicial__events-list">
            {upcomingEvents.slice(0, 1).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Right Column: Acesso rápido (5 cols) */}
        <section className="pagina-inicial__section pagina-inicial__col-right pagina-inicial__acesso-rapido-card">
          <SectionHeading
            icon={
              <div className="pagina-inicial__acesso-rapido-icon-tile">
                <ZapIcon size={20} />
              </div>
            }
            title="Acesso rápido"
            subtitle="Serviços acadêmicos mais requisitados"
            className="pagina-inicial__acesso-rapido-header"
          />

          <div className="pagina-inicial__actions-grid">
            {quickActions
              .filter(
                (action) =>
                  action.title === 'Solicitar matrícula' ||
                  action.title === 'Coordenação'
              )
              .map((action) => (
                <QuickActionCard key={action.id} action={action} />
              ))}
          </div>
        </section>
      </div>

      {/* 4. Últimas Notícias Section */}
      <section className="pagina-inicial__noticias-card">
        <SectionHeading
          title="Últimas notícias"
          subtitle="Comunicados da coordenação e pró-reitoria"
          action={
            <a href="#" className="pagina-inicial__ver-todos-link">
              <span>Ver todos</span>
              <ArrowRightIcon size={11} />
            </a>
          }
          className="pagina-inicial__noticias-header"
        />

        <div className="pagina-inicial__news-list">
          {latestNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default PaginaInicial
