import Button from '../../../components/Button/Button'
import { InfoCircleIcon } from '../../../components/icons'
import './CardResumoSolicitacao.css'

export default function CardResumoSolicitacao({
  periodoLetivo = '2026.2',
  periodoAberto = true,
  turmas = [],
  cargaHorariaTotal = 0,
  etapa = 1, // 1 = Seleção, 2 = Revisão
  onAvancar,
  onConfirmar,
  enviando = false,
}) {
  const quantidade = turmas.length

  return (
    <aside className="resumo-solicitacao" aria-labelledby="resumo-solicitacao-title">
      <div className="resumo-solicitacao__card">
        <h2 id="resumo-solicitacao-title" className="resumo-solicitacao__title">
          Resumo da solicitação
        </h2>

        <div className="resumo-solicitacao__row">
          <span className="resumo-solicitacao__label">Período letivo</span>
          <span className="resumo-solicitacao__value">{periodoLetivo}</span>
        </div>

        {etapa === 2 && (
          <div
            className={`resumo-solicitacao__status-badge ${
              periodoAberto
                ? 'resumo-solicitacao__status-badge--open'
                : 'resumo-solicitacao__status-badge--closed'
            }`}
          >
            <span className="resumo-solicitacao__status-dot" />
            <span>{periodoAberto ? 'Período aberto' : 'Período encerrado'}</span>
          </div>
        )}

        <hr className="resumo-solicitacao__divider" />

        {/* Lista de turmas selecionadas */}
        <div className="resumo-solicitacao__items">
          {quantidade === 0 ? (
            <p className="resumo-solicitacao__empty">Nenhuma turma selecionada ainda.</p>
          ) : (
            turmas.map((item) => (
              <div key={item.id} className="resumo-solicitacao__item">
                <span className="resumo-solicitacao__item-name">
                  {item.disciplina || item.materia || item.nome}
                </span>
                <span className="resumo-solicitacao__item-code">
                  {item.codigo ? `${item.codigo} · ` : ''}
                  {item.nome || 'Turma'} · {item.carga_horaria || 60}h
                </span>
              </div>
            ))
          )}
        </div>

        <hr className="resumo-solicitacao__divider" />

        {/* Totalizador */}
        <div className="resumo-solicitacao__total-row">
          <span className="resumo-solicitacao__total-label">
            {quantidade} {quantidade === 1 ? 'turma selecionada' : 'turmas selecionadas'}
          </span>
          <span className="resumo-solicitacao__total-hours">{cargaHorariaTotal}h</span>
        </div>

        {/* Ação da Etapa 1 */}
        {etapa === 1 && (
          <>
            <Button
              variant="dark"
              size="md"
              className="resumo-solicitacao__btn"
              disabled={quantidade === 0 || !periodoAberto}
              onClick={onAvancar}
            >
              <span>Revisar solicitação</span>
            </Button>

            <p className="resumo-solicitacao__help-text">
              {periodoAberto
                ? 'Selecione pelo menos uma turma para avançar. Suas escolhas serão conferidas na próxima etapa.'
                : 'O período de matrícula para este semestre não está aberto para solicitações.'}
            </p>
          </>
        )}
      </div>

      {/* Box complementar Etapa 1: A seleção ainda não é uma matrícula */}
      {etapa === 1 && (
        <div className="resumo-solicitacao__info-card">
          <InfoCircleIcon size={18} className="resumo-solicitacao__info-icon" />
          <div className="resumo-solicitacao__info-content">
            <h3 className="resumo-solicitacao__info-title">A seleção ainda não é uma matrícula</h3>
            <p className="resumo-solicitacao__info-desc">
              O envio será analisado pela instituição. A inclusão nas turmas depende da validação
              acadêmica e da disponibilidade de vagas.
            </p>
          </div>
        </div>
      )}

      {/* Conteúdo específico da Etapa 2: Antes de enviar */}
      {etapa === 2 && (
        <div className="resumo-solicitacao__review-card">
          <h3 className="resumo-solicitacao__review-title">Antes de enviar</h3>
          <p className="resumo-solicitacao__review-desc">
            Ao confirmar, sua solicitação será registrada com protocolo, data e horário automáticos.
          </p>

          <div className="resumo-solicitacao__alert-box">
            <InfoCircleIcon size={18} className="resumo-solicitacao__alert-icon" />
            <div className="resumo-solicitacao__alert-content">
              <strong>Sujeita à análise</strong>
              <p>
                O envio não efetiva a matrícula nem garante vagas nas turmas escolhidas. A situação
                inicial será Pendente.
              </p>
            </div>
          </div>

          <p className="resumo-solicitacao__review-sub">
            {periodoAberto ? 'Período aberto' : 'Período encerrado'} e {quantidade}{' '}
            {quantidade === 1 ? 'turma selecionada' : 'turmas selecionadas'}. Confira os dados antes
            de confirmar o envio.
          </p>

          <Button
            variant="dark"
            size="md"
            className="resumo-solicitacao__btn"
            disabled={quantidade === 0 || !periodoAberto || enviando}
            onClick={onConfirmar}
          >
            {enviando ? 'Enviando solicitação...' : <span>Confirmar e enviar solicitação</span>}
          </Button>
        </div>
      )}
    </aside>
  )
}
