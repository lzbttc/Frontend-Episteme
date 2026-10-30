import { useCallback, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout/MainLayout'
import Login from '../pages/Login/Login'
import PaginaInicial from '../pages/PaginaInicial/PaginaInicial'
import TurmaVirtual from '../pages/TurmaVirtual/TurmaVirtual'
import MinhasDisciplinas from '../pages/MinhasDisciplinas/MinhasDisciplinas'

function AppRoutes() {
  const navigate = useNavigate()

  const navigateToRoute = useCallback(
    (route = 'inicio') => {
      const r = String(route).toLowerCase()
      if (r.includes('turma') || r.includes('2026') || r.includes('bd002')) {
        navigate('/turma-virtual')
      } else if (r.includes('disciplina')) {
        navigate('/minhas-disciplinas')
      } else if (r.includes('login')) {
        navigate('/login')
      } else {
        navigate('/inicio')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [navigate]
  )

  useEffect(() => {
    const handleCustomNavigate = (e) => {
      const target = e.detail?.route || 'inicio'
      navigateToRoute(target)
    }

    window.addEventListener('navigate', handleCustomNavigate)
    return () => {
      window.removeEventListener('navigate', handleCustomNavigate)
    }
  }, [navigateToRoute])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Páginas sem layout: o Login possui header e footer próprios */}
      <Route path="/login" element={<Login />} />

      {/* Páginas internas: usam o MainLayout (Header + Footer) */}
      <Route
        path="/inicio"
        element={
          <MainLayout onNavigate={navigateToRoute}>
            <PaginaInicial onNavigate={navigateToRoute} />
          </MainLayout>
        }
      />

      <Route
        path="/minhas-disciplinas"
        element={
          <MainLayout onNavigate={navigateToRoute}>
            <MinhasDisciplinas onNavigate={navigateToRoute} />
          </MainLayout>
        }
      />

      <Route
        path="/turma-virtual"
        element={
          <MainLayout onNavigate={navigateToRoute}>
            <TurmaVirtual onNavigate={navigateToRoute} />
          </MainLayout>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
