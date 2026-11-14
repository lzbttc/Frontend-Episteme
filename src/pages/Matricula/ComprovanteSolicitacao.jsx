import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useMatricula } from './context/MatriculaContext'
import { obterSolicitacaoPorProtocolo } from '../../services/matriculaService'
import MatriculaStepper from './components/MatriculaStepper'
import CardTurmaOfertada from './components/CardTurmaOfertada'
import Button from '../../components/Button/Button'
import {
  ClockIcon,
  CheckCircleFilledIcon,
  ChevronRightSmallIcon,
} from '../../components/icons'
import { TURMAS_DEMONSTRACAO } from './mocks/turmasMock'
import './ComprovanteSolicitacao.css'

function formatarDataHora(dataIso) {
  if (!dataIso) return { dataCompleta: '16/09/2026 às 10:42', dataCurta: '16/09/2026 · 10:42' }
  try {
    const data = new Date(dataIso)
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()
    const hora = String(data.getHours()).padStart(2, '0')
    const min = String(data.getMinutes()).padStart(2, '0')
    return {
      dataCompleta: `${dia}/${mes}/${ano} às ${hora}:${min}`,
      dataCurta: `${dia}/${mes}/${ano} · ${hora}:${min}`,
    }
  } catch {
    return { dataCompleta: dataIso, dataCurta: dataIso }
  }
}

export default function ComprovanteSolicitacao() {
  usePageTitle('Comprovante de Solicitação de Matrícula')
  const { protocolo: protocoloParam } = useParams()

  const {
    periodoSelecionado,
    turmasSelecionadas,
    cargaHorariaTotal,
    solicitacaoRecente,
  } = useMatricula()

  const [solicitacao, setSolicitacao] = useState(() => solicitacaoRecente || null)
  const [atualizando, setAtualizando] = useState(false)
  const [mensagemAtualizacao, setMensagemAtualizacao] = useState('')

  const carregarDadosSolicitacao = useCallback(async () => {
    const protocoloAlvo = protocoloParam || solicitacaoRecente?.protocolo || solicitacaoRecente?.id
    if (!protocoloAlvo) return

    setAtualizando(true)
    setMensagemAtualizacao('')

    try {
      const dados = await obterSolicitacaoPorProtocolo(protocoloAlvo)
      if (dados) {
        setSolicitacao(dados)
        setMensagemAtualizacao('Andamento atualizado com sucesso.')
      }
    } catch {
      // Se a rota falhar (ex: protocolo mock), mantém a solicitação recente
      setMensagemAtualizacao('Andamento consultado. Nenhuma alteração de status.')
    } finally {
      setAtualizando(false)
    }
  }, [protocoloParam, solicitacaoRecente])

  useEffect(() => {
    carregarDadosSolicitacao()
  }, [carregarDadosSolicitacao])

  // Dados formatados
  const protocoloExibicao =
    protocoloParam ||
    solicitacao?.protocolo ||
    solicitacao?.id ||
    'MAT-2026-001842'

  const dataIso = solicitacao?.data_solicitacao || new Date().toISOString()
  const { dataCompleta, dataCurta } = formatarDataHora(dataIso)

  const periodo = solicitacao?.periodo_letivo || periodoSelecionado || '2026.2'
  const situacao = solicitacao?.situacao || 'Pendente'

  // Lista de turmas a exibir: se houver turmas selecionadas no contexto, usa-as; caso contrário, usa turmas do mock
  const turmasExibidas =
    turmasSelecionadas.length > 0 ? turmasSelecionadas : TURMAS_DEMONSTRACAO.slice(0, 3)

  const cargaHoraria =
    cargaHorariaTotal > 0
      ? cargaHorariaTotal
      : turmasExibidas.reduce((acc, t) => acc + (t.carga_horaria || 60), 0)

  // Função para baixar comprovante textual formatado
  function handleBaixarComprovante() {
    const conteudo = `
=====================================================
         EPISTEME - SISTEMA ACADÊMICO
     COMPROVANTE DE SOLICITAÇÃO DE MATRÍCULA
=====================================================

PROTOCOLO: ${protocoloExibicao}
DATA E HORA DO REGISTRO: ${dataCompleta} (Horário de Brasília)
PERÍODO LETIVO: ${periodo}
SITUAÇÃO ATUAL: ${situacao}

IDENTIFICAÇÃO DO ALUNO:
Aluno: Lucas Costa
Matrícula: 2023108420
Curso: Engenharia de Software
Campus: Campus II

TURMAS SOLICITADAS (${turmasExibidas.length}):
${turmasExibidas
  .map(
    (t, idx) =>
      `${idx + 1}. [${t.codigo}] ${t.disciplina || t.nome} (${t.carga_horaria || 60}h)
   Docente: ${t.professor?.nome || 'A definir'}
   Horário/Local: ${Array.isArray(t.horarios) ? t.horarios.map((h) => `${h.dia_semana} ${h.horario_inicio}-${h.horario_fim} (${h.local})`).join(', ') : 'Conforme grade'}`
  )
  .join('\n\n')}

Carga Horária Total: ${cargaHoraria}h

AVISO LEGAL:
A solicitação de matrícula confirma apenas o recebimento da solicitação.
A matrícula ainda não foi efetivada. A inclusão definitiva nas turmas
depende da análise acadêmica e disponibilidade de vagas.
=====================================================
    `.trim()

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `comprovante-matricula-${protocoloExibicao}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
          <h1 className="matricula-page__title">Solicitação registrada</h1>
          <p className="matricula-page__subtitle">
            Guarde seu protocolo e acompanhe o andamento da análise nesta página.
          </p>
        </div>
      </section>

      {/* ── 2. Stepper de Etapas ── */}
      <MatriculaStepper etapaAtual={3} />

      {/* ── 3. Card Destaque do Comprovante ── */}
      <section className="comprovante-hero-card" aria-label="Dados do comprovante">
        <div className="comprovante-hero-header">
          <div className="comprovante-hero-title-wrap">
            <div>
              <h2 className="comprovante-hero-title">Recebemos sua solicitação de matrícula</h2>
              <p className="comprovante-hero-subtitle">
                Envio realizado. A matrícula ainda não foi efetivada.
              </p>
            </div>
          </div>

          <div className="comprovante-status-badge">
            <ClockIcon size={13} />
            <span>{situacao}</span>
          </div>
        </div>

        <div className="comprovante-hero-grid">
          <div className="comprovante-hero-item">
            <span className="comprovante-hero-label">PROTOCOLO</span>
            <span className="comprovante-hero-value comprovante-hero-value--protocolo">
              {protocoloExibicao}
            </span>
          </div>

          <div className="comprovante-hero-item">
            <span className="comprovante-hero-label">DATA E HORÁRIO DO REGISTRO</span>
            <span className="comprovante-hero-value">{dataCompleta}</span>
          </div>

          <div className="comprovante-hero-item">
            <span className="comprovante-hero-label">PERÍODO LETIVO · TOTAL</span>
            <span className="comprovante-hero-value">
              {periodo} · {turmasExibidas.length}{' '}
              {turmasExibidas.length === 1 ? 'turma' : 'turmas'} · {cargaHoraria}h
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. Grid Principal: Turmas à esquerda + Acompanhamento à direita ── */}
      <div className="matricula-grid">
        {/* Coluna da Esquerda: Turmas solicitadas e Ações */}
        <section className="matricula-turmas-col" aria-label="Turmas solicitadas">
          <div className="comprovante-turmas-header">
            <h2 className="matricula-turmas-title">
              Turmas solicitadas ({turmasExibidas.length})
            </h2>
            <span className="comprovante-carga-total">
              Carga horária total: <strong>{cargaHoraria}h</strong>
            </span>
          </div>

          <div className="comprovante-turmas-list">
            {turmasExibidas.map((item) => (
              <CardTurmaOfertada key={item.id} turma={item} modoVisualizacao={true} />
            ))}
          </div>

          <div className="comprovante-actions-row">
            <Button
              variant="dark"
              size="md"
              className="comprovante-btn-download"
              onClick={handleBaixarComprovante}
            >
              <span>Baixar comprovante</span>
            </Button>
          </div>
        </section>

        {/* Coluna da Direita: Painel de Acompanhamento */}
        <aside className="comprovante-sidebar" aria-label="Painel de acompanhamento">
          <div className="comprovante-sidebar-card">
            <div className="comprovante-sidebar-header">
              <h3 className="comprovante-sidebar-title">Acompanhamento</h3>
            </div>

            <p className="comprovante-sidebar-desc">
              Sua solicitação aguarda análise da Secretaria Acadêmica.
            </p>

            {/* Linha do Tempo / Timeline */}
            <div className="comprovante-timeline">
              <div className="comprovante-timeline-step comprovante-timeline-step--done">
                <div className="comprovante-timeline-marker">
                  <div className="comprovante-timeline-icon-wrap" aria-hidden="true">
                    <CheckCircleFilledIcon size={18} className="comprovante-timeline-check" />
                  </div>
                  <div className="comprovante-timeline-line" />
                </div>
                <div className="comprovante-timeline-content">
                  <h4 className="comprovante-timeline-step-title">Solicitação registrada</h4>
                  <span className="comprovante-timeline-date">{dataCurta}</span>
                  <p className="comprovante-timeline-note">Recebida com situação {situacao}.</p>
                </div>
              </div>

              <div className="comprovante-timeline-step comprovante-timeline-step--pending">
                <div className="comprovante-timeline-marker">
                  <div className="comprovante-timeline-icon-wrap" aria-hidden="true">
                    <ClockIcon size={16} className="comprovante-timeline-clock" />
                  </div>
                </div>
                <div className="comprovante-timeline-content">
                  <h4 className="comprovante-timeline-step-title">Análise acadêmica</h4>
                  <span className="comprovante-timeline-date">Aguardando início</span>
                </div>
              </div>
            </div>

            {mensagemAtualizacao && (
              <p className="comprovante-sidebar-msg-sync">{mensagemAtualizacao}</p>
            )}

            <Button
              variant="dark"
              size="md"
              className="comprovante-btn-sync"
              onClick={carregarDadosSolicitacao}
              disabled={atualizando}
            >
              <span>{atualizando ? 'Atualizando...' : 'Atualizar andamento'}</span>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
