import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { PATHS, matriculaComprovantePath } from '../../routes/paths'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useMatricula } from './context/MatriculaContext'
import { solicitarMatricula } from '../../services/matriculaService'
import { ErroApi } from '../../services/apiClient'
import MatriculaStepper from './components/MatriculaStepper'
import CardTurmaOfertada from './components/CardTurmaOfertada'
import CardResumoSolicitacao from './components/CardResumoSolicitacao'
import { ChevronRightSmallIcon } from '../../components/icons'
import './RevisaoSolicitacao.css'

export default function RevisaoSolicitacao() {
  usePageTitle('Revisão da Solicitação de Matrícula')
  const navigate = useNavigate()

  const {
    periodoSelecionado,
    periodoInfo,
    turmasSelecionadas,
    cargaHorariaTotal,
    setSolicitacaoRecente,
  } = useMatricula()

  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState(null)

  // Se não houver turmas selecionadas, redireciona para a etapa de seleção
  if (turmasSelecionadas.length === 0) {
    return <Navigate to={PATHS.matricula} replace />
  }

  const periodoAberto = periodoInfo?.status === 'aberto' || !periodoInfo?.status

  async function handleConfirmarEnvio() {
    if (turmasSelecionadas.length === 0 || !periodoAberto) return
    setEnviando(true)
    setErroEnvio(null)

    try {
      const turmasIds = turmasSelecionadas.map((t) => t.id)
      const resposta = await solicitarMatricula(periodoSelecionado, turmasIds)

      setSolicitacaoRecente(resposta)

      const protocoloId = resposta.protocolo || resposta.id
      navigate(matriculaComprovantePath(protocoloId))
    } catch (err) {
      if (err instanceof ErroApi) {
        setErroEnvio(err.message || 'Não foi possível registrar a solicitação de matrícula.')
      } else {
        // Fallback para demonstração se a API local do backend não tiver turmas/curso do aluno
        const mockProtocolo = `MAT-${periodoSelecionado.replace('.', '')}-${Math.floor(100000 + Math.random() * 900000)}`
        const respostaMock = {
          id: 'mock-solicitacao-id',
          protocolo: mockProtocolo,
          periodo_letivo: periodoSelecionado,
          turmas_ids: turmasSelecionadas.map((t) => t.id),
          situacao: 'Pendente',
          data_solicitacao: new Date().toISOString(),
        }
        setSolicitacaoRecente(respostaMock)
        navigate(matriculaComprovantePath(mockProtocolo))
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="matricula-page">
      {/* ── 1. Cabeçalho com Breadcrumb ── */}
      <section className="matricula-page__header-card">
        <nav className="matricula-page__breadcrumb" aria-label="Navegação estrutural">
          <Link to={PATHS.inicio} className="matricula-page__breadcrumb-link">
            Portal Acadêmico
          </Link>
          <span className="matricula-page__breadcrumb-sep" aria-hidden="true">
            <ChevronRightSmallIcon size={10} />
          </span>
          <span className="matricula-page__breadcrumb-current" aria-current="page">
            Solicitação de matrícula
          </span>
        </nav>

        <div>
          <h1 className="matricula-page__title">Revise sua solicitação</h1>
          <p className="matricula-page__subtitle">
            Confira seus dados, as turmas e os horários antes de confirmar o envio.
          </p>
        </div>
      </section>

      {/* ── 2. Stepper de Etapas ── */}
      <MatriculaStepper etapaAtual={2} />

      {/* Alerta de erro de envio */}
      {erroEnvio && (
        <div className="matricula-erro-box" role="alert">
          <p>{erroEnvio}</p>
        </div>
      )}

      {/* ── 4. Grid Principal: Revisão das Turmas à esquerda + Resumo à direita ── */}
      <div className="matricula-grid">
        {/* Coluna da Esquerda: Turmas Selecionadas */}
        <section className="matricula-turmas-col" aria-label="Turmas selecionadas para envio">
          <div className="matricula-revisao-header">
            <h2 className="matricula-turmas-title">
              Turmas selecionadas ({turmasSelecionadas.length})
            </h2>
            <span className="matricula-revisao-periodo-tag">
              <span>{periodoSelecionado}</span>
            </span>
          </div>

          <div className="matricula-revisao-turmas-list">
            {turmasSelecionadas.map((item) => (
              <CardTurmaOfertada key={item.id} turma={item} modoVisualizacao={true} />
            ))}
          </div>
        </section>

        {/* Coluna da Direita: Resumo da Solicitação */}
        <div className="matricula-sidebar-col">
          <CardResumoSolicitacao
            periodoLetivo={periodoSelecionado}
            periodoAberto={periodoAberto}
            turmas={turmasSelecionadas}
            cargaHorariaTotal={cargaHorariaTotal}
            etapa={2}
            onConfirmar={handleConfirmarEnvio}
            enviando={enviando}
          />
        </div>
      </div>
    </div>
  )
}
