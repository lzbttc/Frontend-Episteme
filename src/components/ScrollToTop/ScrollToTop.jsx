import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTop } from '../../utils/scroll'

/**
 * Componente utilitário que rola a janela suavemente ao topo
 * a cada transição de rota (pathname).
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    scrollToTop()
  }, [pathname])

  return null
}

export default ScrollToTop
