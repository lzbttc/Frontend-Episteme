import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import GaugeCard from '../../components/GaugeCard/GaugeCard'
import EventCard from '../../components/EventCard/EventCard'
import QuickActionCard from '../../components/QuickActionCard/QuickActionCard'
import NewsCard from '../../components/NewsCard/NewsCard'
import Button from '../../components/Button/Button'
import DisciplineCard from '../../components/DisciplineCard/DisciplineCard'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import { ArrowRightIcon, CalendarIcon, ZapIcon } from '../../components/icons'
import { PATHS } from '../../routes/paths'
import { getGreeting } from '../../utils/greeting'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  obterAluno,
  obterProximoCompromisso,
  listarAcessoRapidoDestaque,
  listarNoticiasRecentes,
} from '../../services/alunoService'
import { listarDisciplinas } from '../../services/disciplinaService'
import './PaginaInicial.css'

function PaginaInicial() {
  usePageTitle('Portal Acadêmico')

  const carregarHome = useCallback(async () => {
    const [alunoData, disciplines, event, actions, news] = await Promise.all([
      obterAluno(),
      listarDisciplinas('em-andamento'),
      obterProximoCompromisso(),
      listarAcessoRapidoDestaque(),
      listarNoticiasRecentes(),
    ])

    return {
      student: alunoData.student,
      metrics: alunoData.metrics,
      disciplines,
      event,
      actions,
      news,
    }
  }, [])

  const { data, loading, error } = useAsyncData(carregarHome)

  if (loading) {
    return (
      <div className="pagina-inicial">
        <p>Carregando dados acadêmicos...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="pagina-inicial">
        <p>Não foi possível carregar os dados acadêmicos.</p>
      </div>
    )
  }

  const { student, metrics, disciplines, event, actions, news } = data

  return (
    <div className="pagina-inicial">
      {/* 1. Greeting & Academic Status Banner */}
      <section className="pagina-inicial__banner">
        <div className="pagina-inicial__greeting">
          <span className="pagina-inicial__badge">Portal Acadêmico</span>
          <h1 className="pagina-inicial__title">
            {getGreeting()}, {student.name.split(' ')[0]}!
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
      <section className="pagina-inicial__disciplines-card">
        <SectionHeading
          title="Minhas Disciplinas"
          subtitle="Acompanhamento e acesso ao conteúdo das turmas virtuais"
          action={
            <Link
              to={PATHS.minhasDisciplinas}
              className="pagina-inicial__ver-todas-link"
            >
              <span>Ver todas</span>
              <ArrowRightIcon size={11} />
            </Link>
          }
          className="pagina-inicial__disciplines-header"
        />

        <div className="pagina-inicial__disciplines-grid">
          {disciplines.map((discipline) => (
            <DisciplineCard key={discipline.id} discipline={discipline} />
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
              <Button variant="ghost-light" size="sm" to={PATHS.emBreve}>
                <span>Ver agenda</span>
                <ArrowRightIcon size={12} className="arrow-shift" />
              </Button>
            }
            className="pagina-inicial__compromissos-header"
          />

          <div className="pagina-inicial__events-list">
            {event && <EventCard event={event} />}
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
            {actions.map((action) => (
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
            <Link to={PATHS.emBreve} className="pagina-inicial__ver-todos-link">
              <span>Ver todos</span>
              <ArrowRightIcon size={11} />
            </Link>
          }
          className="pagina-inicial__noticias-header"
        />

        <div className="pagina-inicial__news-list">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default PaginaInicial
