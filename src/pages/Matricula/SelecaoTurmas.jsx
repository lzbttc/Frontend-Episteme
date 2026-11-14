import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useMatricula } from './context/MatriculaContext'
import {
  obterPeriodosMatricula,
  obterTurmasDisponiveis,
} from '../../services/matriculaService'
import MatriculaStepper from './components/MatriculaStepper'
import CardTurmaOfertada from './components/CardTurmaOfertada'
import CardResumoSolicitacao from './components/CardResumoSolicitacao'
import Button from '../../components/Button/Button'
import {
  ChevronDownIcon,
  ChevronRightSmallIcon,
  SearchIcon,
} from '../../components/icons'
import { TURMAS_DEMONSTRACAO } from './mocks/turmasMock'
import './SelecaoTurmas.css'

const DIAS_OPCOES = ['Todos', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']

export default function SelecaoTurmas() {
  usePageTitle('Solicitação de Matrícula')
  const navigate = useNavigate()

  const {
    periodoSelecionado,
    setPeriodoSelecionado,
    periodoInfo,
    setPeriodoInfo,
    turmasSelecionadas,
    alternarTurma,
    estaSelecionada,
    cargaHorariaTotal,
  } = useMatricula()

  // Estados locais
  const [periodos, setPeriodos] = useState([])
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  // Filtros
  const [filtroAberto, setFiltroAberto] = useState(false)
  const [buscaTexto, setBuscaTexto] = useState('')
  const [filtroDia, setFiltroDia] = useState('Todos')
  const [filtroHorarioInicio, setFiltroHorarioInicio] = useState('')
  const [filtroHorarioFim, setFiltroHorarioFim] = useState('')
  const [dropdownPeriodoAberto, setDropdownPeriodoAberto] = useState(false)
  const dropdownPeriodoRef = useRef(null)

  // Fecha o dropdown de período letivo ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownPeriodoRef.current && !dropdownPeriodoRef.current.contains(event.target)) {
        setDropdownPeriodoAberto(false)
      }
    }
    if (dropdownPeriodoAberto) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownPeriodoAberto])

  // 1. Carrega os períodos de matrícula
  useEffect(() => {
    let ativo = true
    async function carregarPeriodos() {
      try {
        const lista = await obterPeriodosMatricula()
        if (!ativo) return

        if (Array.isArray(lista) && lista.length > 0) {
          setPeriodos(lista)
          // Se não houver período selecionado ainda, define o primeiro aberto ou o mais recente
          const aberto = lista.find((p) => p.status === 'aberto') || lista[0]
          if (aberto) {
            setPeriodoSelecionado(aberto.periodo_letivo)
            setPeriodoInfo(aberto)
          }
        } else {
          // Período padrão do protótipo
          const mockPeriodo = {
            periodo_letivo: '2026.2',
            status: 'aberto',
          }
          setPeriodos([mockPeriodo])
          setPeriodoInfo(mockPeriodo)
        }
      } catch {
        if (!ativo) return
        const mockPeriodo = {
          periodo_letivo: '2026.2',
          status: 'aberto',
        }
        setPeriodos([mockPeriodo])
        setPeriodoInfo(mockPeriodo)
      }
    }
    carregarPeriodos()
    return () => {
      ativo = false
    }
  }, [setPeriodoSelecionado, setPeriodoInfo])

  // 2. Carrega as turmas disponíveis para o período selecionado
  const carregarTurmas = useCallback(async () => {
    if (!periodoSelecionado) return
    setLoading(true)
    setErro(null)

    try {
      const filtrosApi = {}
      if (buscaTexto.trim()) filtrosApi.disciplina = buscaTexto.trim()
      if (filtroDia && filtroDia !== 'Todos') filtrosApi.dia_semana = filtroDia
      if (filtroHorarioInicio) filtrosApi.horario_inicio = filtroHorarioInicio
      if (filtroHorarioFim) filtrosApi.horario_fim = filtroHorarioFim

      const resposta = await obterTurmasDisponiveis(periodoSelecionado, filtrosApi)
      if (Array.isArray(resposta?.turmas) && resposta.turmas.length > 0) {
        setTurmas(resposta.turmas)
      } else {
        // Se a API retornar lista vazia para o período, utiliza a demonstração das turmas do protótipo
        setTurmas(TURMAS_DEMONSTRACAO)
      }
    } catch {
      // Fallback gracioso com os dados demonstrados no protótipo Figma
      setTurmas(TURMAS_DEMONSTRACAO)
    } finally {
      setLoading(false)
    }
  }, [periodoSelecionado, buscaTexto, filtroDia, filtroHorarioInicio, filtroHorarioFim])

  useEffect(() => {
    carregarTurmas()
  }, [carregarTurmas])

  // Filtragem local adicional (para resposta imediata do usuário)
  const turmasFiltradas = useMemo(() => {
    return turmas.filter((item) => {
      // Filtro de texto (disciplina, código ou professor)
      if (buscaTexto.trim()) {
        const termo = buscaTexto.toLowerCase().trim()
        const disc = (item.disciplina || item.materia || '').toLowerCase()
        const cod = (item.codigo || '').toLowerCase()
        const prof = (item.professor?.nome || item.professor_nome || '').toLowerCase()
        if (!disc.includes(termo) && !cod.includes(termo) && !prof.includes(termo)) {
          return false
        }
      }

      // Filtro de dia da semana
      if (filtroDia && filtroDia !== 'Todos') {
        const temDia = (item.horarios || []).some((h) => {
          const diaSemana = (h.dia_semana || '').toLowerCase()
          return diaSemana.includes(filtroDia.toLowerCase())
        })
        if (!temDia) return false
      }

      return true
    })
  }, [turmas, buscaTexto, filtroDia])

  const periodoAberto = periodoInfo?.status === 'aberto' || !periodoInfo?.status

  function limparFiltros() {
    setBuscaTexto('')
    setFiltroDia('Todos')
    setFiltroHorarioInicio('')
    setFiltroHorarioFim('')
  }

  function handleAvancarParaRevisao() {
    if (turmasSelecionadas.length === 0) return
    navigate(PATHS.matriculaRevisao)
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
          <h1 className="matricula-page__title">Solicitação de Matrícula</h1>
          <p className="matricula-page__subtitle">
            Selecione as turmas que deseja cursar e envie sua solicitação para análise.
          </p>
        </div>
      </section>

      {/* ── 2. Stepper de Etapas + Botão Minhas Solicitações alinhado aos tabs ── */}
      <div className="matricula-stepper-row">
        <MatriculaStepper etapaAtual={1} />

        <Button
          variant="outline"
          size="md"
          to={PATHS.matriculaSolicitacoes}
          className="matricula-btn-minhas-solicitacoes"
        >
          Minhas Solicitações
        </Button>
      </div>

      {/* ── 3. Barra de Período e Status ── */}
      <div className="matricula-periodo-row">
        <div className="matricula-periodo-col" ref={dropdownPeriodoRef}>
          <span className="matricula-periodo-label">PERÍODO LETIVO</span>
          <div
            className={`matricula-periodo-select-wrap ${
              dropdownPeriodoAberto ? 'matricula-periodo-select-wrap--open' : ''
            }`}
            onClick={() => setDropdownPeriodoAberto((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setDropdownPeriodoAberto((prev) => !prev)
              }
            }}
            aria-haspopup="menu"
            aria-expanded={dropdownPeriodoAberto}
            aria-label="Selecionar período letivo"
          >
            <span className="matricula-periodo-select-value">{periodoSelecionado}</span>
            <span
              className={`header__profile-shortcut matricula-periodo-shortcut ${
                dropdownPeriodoAberto ? 'header__profile-shortcut--open' : ''
              }`}
              aria-hidden="true"
            >
              <ChevronDownIcon size={10} />
            </span>

            {dropdownPeriodoAberto && (
              <div
                className="matricula-periodo-dropdown"
                role="menu"
                aria-label="Opções de período letivo"
              >
                {periodos.map((p) => {
                  const val = p.periodo_letivo || p
                  const isSelected = val === periodoSelecionado
                  return (
                    <button
                      key={p.id || val}
                      type="button"
                      role="menuitem"
                      className={`matricula-periodo-dropdown-item ${
                        isSelected ? 'matricula-periodo-dropdown-item--selected' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setPeriodoSelecionado(val)
                        const info = periodos.find((item) => item.periodo_letivo === val)
                        if (info) setPeriodoInfo(info)
                        setDropdownPeriodoAberto(false)
                      }}
                    >
                      <span>{val}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="matricula-periodo-col">
          <span className="matricula-periodo-label">PERÍODO DE MATRÍCULA</span>
          <div
            className={`matricula-periodo-status ${
              periodoAberto
                ? 'matricula-periodo-status--open'
                : 'matricula-periodo-status--closed'
            }`}
          >
            <span className="matricula-periodo-status-dot" />
            <span>{periodoAberto ? 'Aberto' : 'Encerrado'}</span>
          </div>
        </div>
      </div>

      {/* ── 5. Barra de Filtro de Turmas ── */}
      <div className="matricula-filter-card">
        <button
          type="button"
          className="matricula-filter-toggle"
          onClick={() => setFiltroAberto((prev) => !prev)}
          aria-expanded={filtroAberto}
        >
          <div className="matricula-filter-toggle-left">
            <SearchIcon size={16} />
            <span className="matricula-filter-toggle-title">Filtrar turmas</span>
          </div>
          <span className="matricula-filter-toggle-placeholder">
            {buscaTexto || filtroDia !== 'Todos'
              ? 'Filtros aplicados'
              : 'Curso, disciplina, código, dia e horário'}
            <ChevronDownIcon
              size={12}
              className={`matricula-filter-chevron ${filtroAberto ? 'matricula-filter-chevron--open' : ''}`}
            />
          </span>
        </button>

        {filtroAberto && (
          <div className="matricula-filter-body">
            <div className="matricula-filter-group">
              <label htmlFor="filtro-busca-input" className="matricula-filter-label">
                Busca textual
              </label>
              <input
                id="filtro-busca-input"
                type="text"
                className="matricula-filter-input"
                placeholder="Ex.: Engenharia, ES014, Mariana..."
                value={buscaTexto}
                onChange={(e) => setBuscaTexto(e.target.value)}
              />
            </div>

            <div className="matricula-filter-group">
              <label className="matricula-filter-label">Dia da semana</label>
              <div className="matricula-filter-dias">
                {DIAS_OPCOES.map((dia) => (
                  <button
                    key={dia}
                    type="button"
                    className={`matricula-filter-dia-btn ${
                      filtroDia === dia ? 'matricula-filter-dia-btn--active' : ''
                    }`}
                    onClick={() => setFiltroDia(dia)}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>

            <div className="matricula-filter-actions">
              <button
                type="button"
                className="matricula-filter-btn-clear"
                onClick={limparFiltros}
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 6. Grid Principal: Ofertas à esquerda + Resumo à direita ── */}
      <div className="matricula-grid">
        {/* Coluna da Esquerda: Lista de turmas */}
        <section className="matricula-turmas-col" aria-label="Turmas ofertadas">
          <div className="matricula-turmas-header">
            <h2 className="matricula-turmas-title">Turmas ofertadas</h2>
            <span className="matricula-turmas-count">
              {turmasFiltradas.length}{' '}
              {turmasFiltradas.length === 1 ? 'turma' : 'turmas'} · Engenharia de Software
            </span>
          </div>

          {loading ? (
            <p className="matricula-loading">Carregando ofertas de turmas...</p>
          ) : erro ? (
            <div className="matricula-erro-box" role="alert">
              <p>{erro}</p>
            </div>
          ) : turmasFiltradas.length === 0 ? (
            <div className="matricula-empty-box">
              <p>Nenhuma turma encontrada com os filtros selecionados.</p>
              <button
                type="button"
                className="matricula-filter-btn-clear"
                onClick={limparFiltros}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            turmasFiltradas.map((item) => (
              <CardTurmaOfertada
                key={item.id}
                turma={item}
                selecionada={estaSelecionada(item.id)}
                onToggle={alternarTurma}
              />
            ))
          )}
        </section>

        {/* Coluna da Direita: Resumo da Solicitação */}
        <div className="matricula-sidebar-col">
          <CardResumoSolicitacao
            periodoLetivo={periodoSelecionado}
            periodoAberto={periodoAberto}
            turmas={turmasSelecionadas}
            cargaHorariaTotal={cargaHorariaTotal}
            etapa={1}
            onAvancar={handleAvancarParaRevisao}
          />
        </div>
      </div>
    </div>
  )
}
