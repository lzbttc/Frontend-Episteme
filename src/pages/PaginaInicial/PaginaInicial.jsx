import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import GaugeCard from '../../components/GaugeCard/GaugeCard'
import EventCard from '../../components/EventCard/EventCard'
import QuickActionCard from '../../components/QuickActionCard/QuickActionCard'
import NewsCard from '../../components/NewsCard/NewsCard'
import Button from '../../components/Button/Button'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import {
  ArrowRightIcon,
  CalendarIcon,
  ZapIcon,
  MegaphoneIcon,
} from '../../components/icons'
import { PATHS } from '../../routes/paths'
import { getGreeting } from '../../utils/greeting'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../hooks/useAuth'
import {
  obterAluno,
  obterProximoCompromisso,
  listarAcessoRapidoDestaque,
  listarNoticiasRecentes,
} from '../../services/alunoService'
import './PaginaInicial.css'

function PaginaInicial() {
  usePageTitle('Portal Acadêmico')
  const { eAdmin } = useAuth()

  const carregarHome = useCallback(async () => {
    const [alunoData, event, actions, news] = await Promise.all([
      obterAluno(),
      obterProximoCompromisso(),
      listarAcessoRapidoDestaque(),
      listarNoticiasRecentes(),
    ])

    return {
      student: alunoData.student,
      metrics: alunoData.metrics,
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

  const { student, metrics, event, actions, news } = data

  return (
    <div className="pagina-inicial">
      {/* 1. Greeting & Academic Status Banner */}
      <section className="pagina-inicial__banner">
        <div className="pagina-inicial__greeting">
          <span className="pagina-inicial__badge">Portal Acadêmico</span>
          <h1 className="pagina-inicial__title">
            {getGreeting()}, {student.name.split(' ')[0]}!
          </h1>
          {student.course && (
            <p className="pagina-inicial__course">{student.course}</p>
          )}
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
          <article className="pagina-inicial__discipline-slot pagina-inicial__discipline-slot--empty">
            <p className="pagina-inicial__empty-text">
              Nenhuma disciplina em andamento encontrada.
            </p>
            <Button
              variant="outline"
              size="sm"
              to={PATHS.minhasDisciplinas}
              className="pagina-inicial__browse-btn"
            >
              Explorar Minhas Disciplinas
            </Button>
          </article>
        </div>
      </section>

      {/* 3. Middle Section: Next Event + Quick Actions */}
      <div className="pagina-inicial__two-col">
        {/* Next Event Card */}
        <section className="pagina-inicial__event-card">
          <SectionHeading
            icon={
              <div className="pagina-inicial__event-icon-tile">
                <CalendarIcon size={20} />
              </div>
            }
            title="Próximo evento"
            subtitle="Aulas, provas e entregas de trabalhos"
            className="pagina-inicial__event-header"
          />

          {event ? (
            <EventCard event={event} />
          ) : (
            <div className="pagina-inicial__empty-event">
              <p>Nenhum compromisso agendado para os próximos dias.</p>
            </div>
          )}
        </section>

        {/* Quick Actions Card */}
        <section className="pagina-inicial__quick-actions-card">
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
            <div className="pagina-inicial__noticias-actions-group">
              {eAdmin && (
                <Link
                  to={PATHS.gerenciamentoNoticias}
                  className="pagina-inicial__admin-gerenciar-link"
                >
                  <MegaphoneIcon size={12} />
                  <span>Gerenciar comunicados</span>
                </Link>
              )}
              <Link
                to={PATHS.emBreve}
                className="pagina-inicial__ver-todos-link"
              >
                <span>Ver todos</span>
                <ArrowRightIcon size={11} />
              </Link>
            </div>
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
