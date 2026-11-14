import { useAuth } from '../../../hooks/useAuth'
import './CardIdentificacaoAluno.css'

export default function CardIdentificacaoAluno({ dadosCustomizados }) {
  const { aluno, eAdmin } = useAuth()

  const nome = dadosCustomizados?.nome || aluno?.name || 'Lucas Costa'
  const matricula = dadosCustomizados?.matricula || aluno?.matricula || '2023108420'
  const curso = dadosCustomizados?.curso || aluno?.course || (eAdmin ? 'Coordenação Acadêmica' : 'Engenharia de Software')
  const campus = dadosCustomizados?.campus || 'Campus II'

  return (
    <section className="matricula-identificacao" aria-labelledby="matricula-identificacao-title">
      <h2 id="matricula-identificacao-title" className="matricula-identificacao__title">
        Identificação do aluno
      </h2>

      <div className="matricula-identificacao__grid">
        <div className="matricula-identificacao__item">
          <span className="matricula-identificacao__label">ALUNO</span>
          <span className="matricula-identificacao__value">{nome}</span>
        </div>

        <div className="matricula-identificacao__item">
          <span className="matricula-identificacao__label">MATRÍCULA</span>
          <span className="matricula-identificacao__value">{matricula}</span>
        </div>

        <div className="matricula-identificacao__item">
          <span className="matricula-identificacao__label">CURSO</span>
          <span className="matricula-identificacao__value">{curso}</span>
        </div>

        <div className="matricula-identificacao__item">
          <span className="matricula-identificacao__label">CAMPUS</span>
          <span className="matricula-identificacao__value">{campus}</span>
        </div>
      </div>
    </section>
  )
}
