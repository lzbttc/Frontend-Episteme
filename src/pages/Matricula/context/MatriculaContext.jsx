import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

const CHAVE_STORAGE = 'episteme_matricula_estado'

const MatriculaContext = createContext(null)

export function MatriculaProvider({ children }) {
  const [estadoLocal, setEstadoLocal] = useState(() => {
    try {
      const salvo = sessionStorage.getItem(CHAVE_STORAGE)
      return salvo ? JSON.parse(salvo) : null
    } catch {
      return null
    }
  })

  const [periodoSelecionado, setPeriodoSelecionado] = useState(
    () => estadoLocal?.periodoSelecionado || '2026.2'
  )
  const [periodoInfo, setPeriodoInfo] = useState(
    () => estadoLocal?.periodoInfo || null
  )
  const [turmasSelecionadas, setTurmasSelecionadas] = useState(
    () => estadoLocal?.turmasSelecionadas || []
  )
  const [solicitacaoRecente, setSolicitacaoRecente] = useState(
    () => estadoLocal?.solicitacaoRecente || null
  )

  // Sincroniza com sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify({
          periodoSelecionado,
          periodoInfo,
          turmasSelecionadas,
          solicitacaoRecente,
        })
      )
    } catch {
      // Ignora falhas de storage
    }
  }, [periodoSelecionado, periodoInfo, turmasSelecionadas, solicitacaoRecente])

  const selecionarTurma = useCallback((turma) => {
    setTurmasSelecionadas((prev) => {
      if (prev.some((t) => t.id === turma.id)) return prev
      return [...prev, turma]
    })
  }, [])

  const desmarcarTurma = useCallback((turmaId) => {
    setTurmasSelecionadas((prev) => prev.filter((t) => t.id !== turmaId))
  }, [])

  const alternarTurma = useCallback((turma) => {
    setTurmasSelecionadas((prev) => {
      const existe = prev.some((t) => t.id === turma.id)
      if (existe) {
        return prev.filter((t) => t.id !== turma.id)
      }
      return [...prev, turma]
    })
  }, [])

  const estaSelecionada = useCallback(
    (turmaId) => turmasSelecionadas.some((t) => t.id === turmaId),
    [turmasSelecionadas]
  )

  const limparSelecao = useCallback(() => {
    setTurmasSelecionadas([])
  }, [])

  // Carga horária total (padrão de 60h por turma conforme o protótipo, ou carga horária específica)
  const cargaHorariaTotal = useMemo(() => {
    return turmasSelecionadas.reduce((total, t) => {
      const ch = Number(t.carga_horaria) || 60
      return total + ch
    }, 0)
  }, [turmasSelecionadas])

  const valor = useMemo(
    () => ({
      periodoSelecionado,
      setPeriodoSelecionado,
      periodoInfo,
      setPeriodoInfo,
      turmasSelecionadas,
      setTurmasSelecionadas,
      selecionarTurma,
      desmarcarTurma,
      alternarTurma,
      estaSelecionada,
      limparSelecao,
      cargaHorariaTotal,
      quantidadeTurmas: turmasSelecionadas.length,
      solicitacaoRecente,
      setSolicitacaoRecente,
    }),
    [
      periodoSelecionado,
      periodoInfo,
      turmasSelecionadas,
      selecionarTurma,
      desmarcarTurma,
      alternarTurma,
      estaSelecionada,
      limparSelecao,
      cargaHorariaTotal,
      solicitacaoRecente,
    ]
  )

  return (
    <MatriculaContext.Provider value={valor}>
      {children}
    </MatriculaContext.Provider>
  )
}

export function useMatricula() {
  const contexto = useContext(MatriculaContext)
  if (!contexto) {
    throw new Error('useMatricula deve ser utilizado dentro de um MatriculaProvider')
  }
  return contexto
}
