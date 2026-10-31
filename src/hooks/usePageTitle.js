import { useEffect } from 'react'

const BASE_TITLE = 'Episteme'

/**
 * Hook para atualizar o título da aba do navegador (document.title)
 * de forma declarativa e padronizada.
 *
 * @param {string} title - Título específico da página
 */
export function usePageTitle(title) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${BASE_TITLE}`
    } else {
      document.title = BASE_TITLE
    }
  }, [title])
}

export default usePageTitle
