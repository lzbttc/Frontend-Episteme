import { useState, useEffect } from 'react'

/**
 * Hook utilitário para consumo assíncrono de dados com controle
 * de estados de carregamento, erro e dados retornados.
 *
 * @template T
 * @param {() => Promise<T>} asyncFn - Função assíncrona que busca os dados
 * @param {Array} [deps=[]] - Lista de dependências que disparam nova busca
 * @returns {{ data: T | null, loading: boolean, error: Error | null }}
 */
export function useAsyncData(asyncFn, deps = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isCancelled = false

    asyncFn()
      .then((data) => {
        if (!isCancelled) {
          setState({ data, loading: false, error: null })
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          })
        }
      })

    return () => {
      isCancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

export default useAsyncData
