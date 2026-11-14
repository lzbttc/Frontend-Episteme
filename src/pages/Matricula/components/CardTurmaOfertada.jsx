import { UserIcon, ClockIcon, CheckIcon } from '../../../components/icons'
import './CardTurmaOfertada.css'

const DIAS_ABREV = {
  Segunda: 'Seg',
  'Segunda-feira': 'Seg',
  Terça: 'Ter',
  'Terça-feira': 'Ter',
  Quarta: 'Qua',
  'Quarta-feira': 'Qua',
  Quinta: 'Qui',
  'Quinta-feira': 'Qui',
  Sexta: 'Sex',
  'Sexta-feira': 'Sex',
  Sábado: 'Sáb',
}

function formatarHora(horaStr) {
  if (!horaStr) return ''
  const partes = String(horaStr).split(':')
  return `${partes[0]}:${partes[1]}`
}

export function formatarHorarios(horarios = []) {
  if (!Array.isArray(horarios) || horarios.length === 0) {
    return 'Horário e local a definir'
  }

  // Se já for uma string formatada (mock ou fallback)
  if (typeof horarios === 'string') return horarios

  const formatados = horarios.map((h) => {
    const dia = DIAS_ABREV[h.dia_semana] || h.dia_semana || ''
    const inicio = formatarHora(h.horario_inicio)
    const fim = formatarHora(h.horario_fim)
    const faixa = inicio && fim ? `${inicio}–${fim}` : ''
    const local = h.local || ''
    return { dia, faixa, local }
  })

  // Agrupa se os horários e locais forem idênticos
  if (formatados.length === 2 && formatados[0].faixa === formatados[1].faixa && formatados[0].local === formatados[1].local) {
    const dias = `${formatados[0].dia} e ${formatados[1].dia}`
    return `${dias} · ${formatados[0].faixa}${formatados[0].local ? ` · ${formatados[0].local}` : ''}`
  }

  return formatados
    .map((item) => `${item.dia} · ${item.faixa}${item.local ? ` · ${item.local}` : ''}`)
    .join(' | ')
}

export default function CardTurmaOfertada({
  turma,
  selecionada = false,
  onToggle,
  modoVisualizacao = false,
}) {
  const codigo = turma.codigo || '—'
  const nomeTurma = turma.nome || `Turma ${codigo}-T01`
  const cargaHoraria = turma.carga_horaria || 60
  const disciplina = turma.disciplina || turma.materia || 'Disciplina'
  const professor = turma.professor?.nome || turma.professor_nome || 'Docente a definir'
  const horariosFormatados = formatarHorarios(turma.horarios)
  const campus = turma.campus || 'Campus II'
  const capacidade = turma.capacidade != null ? turma.capacidade : 40
  const vagas = turma.vagas_disponiveis != null ? turma.vagas_disponiveis : 18

  return (
    <article
      className={`turma-card ${selecionada ? 'turma-card--selected' : ''}`}
      aria-label={`Turma ${nomeTurma} de ${disciplina}`}
    >
      <div className="turma-card__header">
        <span className="turma-card__meta">
          {codigo} · {nomeTurma} · {cargaHoraria}h
        </span>

        {modoVisualizacao ? (
          <span className="turma-card__badge-periodo">
            {turma.periodo_letivo || '2026.2'}
          </span>
        ) : (
          <button
            type="button"
            className={`turma-card__select-btn ${
              selecionada ? 'turma-card__select-btn--active' : ''
            }`}
            onClick={() => onToggle && onToggle(turma)}
            aria-pressed={selecionada}
          >
            {selecionada ? (
              <>
                <CheckIcon size={14} />
                <span>Selecionada</span>
              </>
            ) : (
              <>
                <span className="turma-card__checkbox-empty" />
                <span>Selecionar</span>
              </>
            )}
          </button>
        )}
      </div>

      <h3 className="turma-card__title">{disciplina}</h3>

      <div className="turma-card__teacher">
        <UserIcon size={15} className="turma-card__teacher-icon" />
        <span>{professor}</span>
      </div>

      <div className="turma-card__schedule-pill">
        <ClockIcon size={14} className="turma-card__schedule-icon" />
        <span>{horariosFormatados}</span>
      </div>

      <div className="turma-card__footer">
        <span className="turma-card__modality">Presencial · {campus}</span>
        <span className="turma-card__vacancies">
          <strong>{vagas} vagas disponíveis</strong>
          {!modoVisualizacao && ` · Capacidade: ${capacidade}`}
        </span>
      </div>
    </article>
  )
}
