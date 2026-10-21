<<<<<<< HEAD
import { Navigate, Route, Routes } from 'react-router-dom'

=======
import { useState, useEffect } from 'react'
>>>>>>> a10411a (feat: integra tela de turma virtual e ajusta navegacao das turmas)
import MainLayout from '../layouts/MainLayout/MainLayout'
import Login from '../pages/Login/Login'
import PaginaInicial from '../pages/PaginaInicial/PaginaInicial'
import TurmaVirtual from '../pages/TurmaVirtual/TurmaVirtual'

function AppRoutes() {
  const getRouteFromUrl = () => {
    const path = window.location.pathname.toLowerCase()
    const hash = window.location.hash.toLowerCase()
    if (
      path.includes('turma') ||
      path.includes('2026') ||
      path.includes('bd002') ||
      hash.includes('turma') ||
      hash.includes('2026') ||
      hash.includes('bd002')
    ) {
      return 'turma-virtual'
    }
    return 'inicio'
  }

  const [currentRoute, setCurrentRoute] = useState(getRouteFromUrl)

  const navigateToRoute = (route) => {
    setCurrentRoute(route)
    const newPath = route === 'inicio' ? '/' : `/${route}`
    if (window.location.pathname !== newPath) {
      window.history.pushState({ route }, '', newPath)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromUrl())
    }

    const handleCustomNavigate = (e) => {
      const target = e.detail?.route || 'inicio'
      navigateToRoute(target)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handlePopState)
    window.addEventListener('navigate', handleCustomNavigate)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handlePopState)
      window.removeEventListener('navigate', handleCustomNavigate)
    }
  }, [])

  return (
<<<<<<< HEAD
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Páginas sem layout: o Login possui header e footer próprios */}
      <Route path="/login" element={<Login />} />

      {/* Páginas internas: usam o MainLayout (Header + Footer) */}
      <Route
        path="/inicio"
        element={
          <MainLayout>
            <PaginaInicial />
          </MainLayout>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
=======
    <MainLayout onNavigate={navigateToRoute}>
      {currentRoute === 'turma-virtual' ? (
        <TurmaVirtual onNavigate={navigateToRoute} />
      ) : (
        <PaginaInicial onNavigate={navigateToRoute} />
      )}
    </MainLayout>
>>>>>>> a10411a (feat: integra tela de turma virtual e ajusta navegacao das turmas)
  )
}

export default AppRoutes
