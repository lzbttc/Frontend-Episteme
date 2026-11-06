import { useState, useEffect, useRef, useMemo } from 'react'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CheckIcon,
} from '../icons'
import {
  obterDiasNoMes,
  analisarDataHora,
  formatarParaInputLocal,
} from '../../utils/dateValidation'
import './MiniCalendarPicker.css'

const NOMES_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

/**
 * Componente de seleção de data e hora com mini calendário interativo em popover.
 * Garante que o usuário possa tanto digitar quanto escolher visualmente uma data e horário válidos.
 */
function MiniCalendarPicker({
  id,
  name,
  value = '',
  onChange,
  min,
  max,
  error,
  disabled = false,
  placeholder = 'AAAA-MM-DDTHH:mm',
  required = false,
  'aria-describedby': ariaDescribedBy,
}) {
  const [aberto, setAberto] = useState(false)
  const [navData, setNavData] = useState(null)
  const containerRef = useRef(null)

  // Extrai data e hora atual do valor ou usa agora como padrão
  const dataParsed = useMemo(() => {
    if (!value) return null
    const res = analisarDataHora(value)
    return res.valido ? res.dataObj : null
  }, [value])

  const agora = useMemo(() => new Date(), [])

  // Referência visual de mês e ano (se o usuário navegou, usa navData; senão valor ou agora)
  const dataReferencia = navData || dataParsed || agora
  const anoVisualizacao = dataReferencia.getFullYear()
  const mesVisualizacao = dataReferencia.getMonth() + 1

  // Horário corrente derivado
  const hora = dataParsed
    ? String(dataParsed.getHours()).padStart(2, '0')
    : '08'
  const minuto = dataParsed
    ? String(dataParsed.getMinutes()).padStart(2, '0')
    : '00'

  // Garante que o minuto selecionado sempre conste nas opções, mesmo se não for múltiplo de 5 (ex: 33 min)
  const opcoesMinutos = useMemo(() => {
    const lista = Array.from({ length: 12 }).map((_, i) =>
      String(i * 5).padStart(2, '0')
    )
    if (!lista.includes(minuto)) {
      lista.push(minuto)
      lista.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    }
    return lista
  }, [minuto])

  // Fecha o popover ao clicar fora ou apertar Escape
  useEffect(() => {
    if (!aberto) return

    function handleMouseDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAberto(false)
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setAberto(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [aberto])

  // Parse do valor mínimo permitido
  const dataMinima = useMemo(() => {
    if (!min) return null
    const res = analisarDataHora(min)
    return res.valido ? res.dataObj : null
  }, [min])

  // Navegação entre meses
  function handleMesAnterior() {
    setNavData(new Date(anoVisualizacao, mesVisualizacao - 2, 1))
  }

  function handleProximoMes() {
    setNavData(new Date(anoVisualizacao, mesVisualizacao, 1))
  }

  // Verifica se o mês anterior deve ser desabilitado
  const mesAnteriorDesabilitado = useMemo(() => {
    if (!dataMinima) return false
    const primeiroDiaMesAtual = new Date(anoVisualizacao, mesVisualizacao - 1, 1)
    return primeiroDiaMesAtual <= dataMinima
  }, [anoVisualizacao, mesVisualizacao, dataMinima])

  // Dias do mês
  const diasDoMes = useMemo(() => {
    const totalDias = obterDiasNoMes(anoVisualizacao, mesVisualizacao)
    const primeiroDiaSemana = new Date(anoVisualizacao, mesVisualizacao - 1, 1).getDay()

    const dias = []

    // Células vazias de offset antes do dia 1
    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push({ offset: true, id: `offset-${i}` })
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const dataDoDia = new Date(anoVisualizacao, mesVisualizacao - 1, dia, 23, 59, 59)
      const ehPassado = dataMinima ? dataDoDia < dataMinima : dataDoDia < agora

      const ehHoje =
        agora.getDate() === dia &&
        agora.getMonth() + 1 === mesVisualizacao &&
        agora.getFullYear() === anoVisualizacao

      const ehSelecionado =
        dataParsed &&
        dataParsed.getDate() === dia &&
        dataParsed.getMonth() + 1 === mesVisualizacao &&
        dataParsed.getFullYear() === anoVisualizacao

      dias.push({
        offset: false,
        dia,
        ehPassado,
        ehHoje,
        ehSelecionado,
      })
    }

    return dias
  }, [anoVisualizacao, mesVisualizacao, dataMinima, agora, dataParsed])

  // Ao clicar em um dia no calendário
  function handleSelecionarDia(dia) {
    const anoStr = String(anoVisualizacao)
    const mesStr = String(mesVisualizacao).padStart(2, '0')
    const diaStr = String(dia).padStart(2, '0')
    const horaVal = String(hora).padStart(2, '0')
    const minVal = String(minuto).padStart(2, '0')

    const novaString = `${anoStr}-${mesStr}-${diaStr}T${horaVal}:${minVal}`
    onChange?.(novaString)
    setNavData(null)
  }

  // Ao alterar horas ou minutos
  function handleAtualizarHorario(novaHora, novoMinuto) {
    const anoStr = String(anoVisualizacao)
    const mesStr = String(mesVisualizacao).padStart(2, '0')
    const diaStr = dataParsed
      ? String(dataParsed.getDate()).padStart(2, '0')
      : String(agora.getDate()).padStart(2, '0')

    const novaString = `${anoStr}-${mesStr}-${diaStr}T${novaHora}:${novoMinuto}`
    onChange?.(novaString)
  }

  // Atalhos rápidos
  function aplicarAtalho(diasAdicionais, horaPadrao = '08:00') {
    const base = new Date()
    base.setDate(base.getDate() + diasAdicionais)
    const [h, m] = horaPadrao.split(':')
    base.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0)

    const novaString = formatarParaInputLocal(base)
    onChange?.(novaString)
    setNavData(null)
  }

  return (
    <div
      className={`mini-calendar-picker ${disabled ? 'mini-calendar-picker--disabled' : ''}`}
      ref={containerRef}
    >
      <div className="mini-calendar-picker__input-wrapper">
        <input
          type="datetime-local"
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          className={`mini-calendar-picker__input ${
            error ? 'mini-calendar-picker__input--error' : ''
          }`}
        />

        <button
          type="button"
          className={`mini-calendar-picker__trigger-btn ${
            aberto ? 'mini-calendar-picker__trigger-btn--active' : ''
          }`}
          onClick={() => !disabled && setAberto(!aberto)}
          disabled={disabled}
          aria-label={aberto ? 'Fechar calendário' : 'Abrir mini calendário interativo'}
          title="Abrir mini calendário para selecionar data e horário"
          aria-haspopup="dialog"
          aria-expanded={aberto}
        >
          <CalendarIcon size={18} />
        </button>
      </div>

      {/* Popover do Mini Calendário */}
      {aberto && (
        <div
          className="mini-calendar-picker__popover"
          role="dialog"
          aria-label="Seletor de data e horário"
        >
          {/* Cabeçalho do Mês */}
          <div className="mini-calendar-picker__header">
            <button
              type="button"
              className="mini-calendar-picker__nav-btn"
              onClick={handleMesAnterior}
              disabled={mesAnteriorDesabilitado}
              title="Mês anterior"
              aria-label="Mês anterior"
            >
              <ChevronLeftIcon size={16} />
            </button>

            <span className="mini-calendar-picker__month-label">
              {NOMES_MESES[mesVisualizacao - 1]} de {anoVisualizacao}
            </span>

            <button
              type="button"
              className="mini-calendar-picker__nav-btn"
              onClick={handleProximoMes}
              title="Próximo mês"
              aria-label="Próximo mês"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>

          {/* Cabeçalho dos dias da semana */}
          <div className="mini-calendar-picker__weekdays">
            {DIAS_SEMANA.map((diaSemana) => (
              <span key={diaSemana} className="mini-calendar-picker__weekday">
                {diaSemana}
              </span>
            ))}
          </div>

          {/* Grade de Dias */}
          <div className="mini-calendar-picker__days-grid">
            {diasDoMes.map((item, idx) => {
              if (item.offset) {
                return (
                  <span
                    key={`offset-${idx}`}
                    className="mini-calendar-picker__day mini-calendar-picker__day--empty"
                  />
                )
              }

              return (
                <button
                  key={`dia-${item.dia}`}
                  type="button"
                  className={`mini-calendar-picker__day ${
                    item.ehSelecionado ? 'mini-calendar-picker__day--selected' : ''
                  } ${item.ehHoje ? 'mini-calendar-picker__day--today' : ''} ${
                    item.ehPassado ? 'mini-calendar-picker__day--disabled' : ''
                  }`}
                  onClick={() => !item.ehPassado && handleSelecionarDia(item.dia)}
                  disabled={item.ehPassado}
                  aria-label={`${item.dia} de ${NOMES_MESES[mesVisualizacao - 1]} de ${anoVisualizacao}${
                    item.ehPassado ? ' (indisponível - data anterior ao permitido)' : ''
                  }`}
                >
                  {item.dia}
                </button>
              )
            })}
          </div>

          {/* Seletor de Horário */}
          <div className="mini-calendar-picker__time-section">
            <div className="mini-calendar-picker__time-label-row">
              <ClockIcon size={14} aria-hidden="true" />
              <span>Horário (Horas : Minutos)</span>
            </div>

            <div className="mini-calendar-picker__time-inputs">
              <select
                className="mini-calendar-picker__time-select"
                value={hora}
                onChange={(e) => handleAtualizarHorario(e.target.value, minuto)}
                aria-label="Selecionar hora"
              >
                {Array.from({ length: 24 }).map((_, i) => {
                  const hStr = String(i).padStart(2, '0')
                  return (
                    <option key={`h-${hStr}`} value={hStr}>
                      {hStr} h
                    </option>
                  )
                })}
              </select>

              <span className="mini-calendar-picker__time-separator">:</span>

              <select
                className="mini-calendar-picker__time-select"
                value={minuto}
                onChange={(e) => handleAtualizarHorario(hora, e.target.value)}
                aria-label="Selecionar minutos"
              >
                {opcoesMinutos.map((mStr) => (
                  <option key={`m-${mStr}`} value={mStr}>
                    {mStr} min
                  </option>
                ))}
              </select>
            </div>

            {/* Atalhos de horários rápidos */}
            <div className="mini-calendar-picker__quick-hours">
              {['08:00', '12:00', '18:00', '23:59'].map((hStr) => {
                const [h, m] = hStr.split(':')
                const ativo = hora === h && minuto === m
                return (
                  <button
                    key={`quick-${hStr}`}
                    type="button"
                    className={`mini-calendar-picker__quick-hour-btn ${
                      ativo ? 'mini-calendar-picker__quick-hour-btn--active' : ''
                    }`}
                    onClick={() => handleAtualizarHorario(h, m)}
                  >
                    {hStr}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Atalhos Rápidos de Datas */}
          <div className="mini-calendar-picker__shortcuts">
            <span className="mini-calendar-picker__shortcuts-title">Atalhos rápidos:</span>
            <div className="mini-calendar-picker__shortcuts-grid">
              <button
                type="button"
                className="mini-calendar-picker__shortcut-btn"
                onClick={() => aplicarAtalho(1, '08:00')}
              >
                Amanhã 08h
              </button>
              <button
                type="button"
                className="mini-calendar-picker__shortcut-btn"
                onClick={() => aplicarAtalho(7, '18:00')}
              >
                Em 7 dias
              </button>
              <button
                type="button"
                className="mini-calendar-picker__shortcut-btn"
                onClick={() => aplicarAtalho(15, '18:00')}
              >
                Em 15 dias
              </button>
              <button
                type="button"
                className="mini-calendar-picker__shortcut-btn"
                onClick={() => aplicarAtalho(30, '23:59')}
              >
                Em 30 dias
              </button>
            </div>
          </div>

          {/* Rodapé com Confirmação */}
          <div className="mini-calendar-picker__footer">
            <button
              type="button"
              className="mini-calendar-picker__apply-btn"
              onClick={() => setAberto(false)}
            >
              <CheckIcon size={14} aria-hidden="true" />
              <span>Confirmar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiniCalendarPicker
