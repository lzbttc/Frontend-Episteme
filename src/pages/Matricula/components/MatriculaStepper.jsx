import { Link } from 'react-router-dom'
import { PATHS } from '../../../routes/paths'
import { CheckIcon } from '../../../components/icons'
import './MatriculaStepper.css'

export default function MatriculaStepper({ etapaAtual = 1 }) {
  const passos = [
    { numero: 1, label: 'Selecionar turmas', rota: PATHS.matricula },
    { numero: 2, label: 'Revisar solicitação', rota: PATHS.matriculaRevisao },
    { numero: 3, label: 'Comprovante', rota: null },
  ]

  return (
    <nav className="matricula-stepper" aria-label="Etapas da solicitação de matrícula">
      <div className="matricula-stepper__pills">
        {passos.map((passo) => {
          const isAtivo = etapaAtual === passo.numero
          const isConcluido = etapaAtual > passo.numero

          const content = (
            <>
              {isConcluido ? (
                <CheckIcon size={13} className="matricula-stepper__pill-icon" />
              ) : (
                <span className="matricula-stepper__pill-num">{passo.numero}</span>
              )}
              <span>{passo.label}</span>
            </>
          )

          if (isConcluido && passo.rota) {
            return (
              <Link
                key={passo.numero}
                to={passo.rota}
                className="matricula-stepper__pill-btn matricula-stepper__pill-btn--completed"
              >
                {content}
              </Link>
            )
          }

          return (
            <div
              key={passo.numero}
              className={`matricula-stepper__pill-btn ${
                isAtivo
                  ? 'matricula-stepper__pill-btn--active'
                  : 'matricula-stepper__pill-btn--pending'
              }`}
            >
              {content}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
