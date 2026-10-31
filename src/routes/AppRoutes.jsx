import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout/MainLayout'
import Login from '../pages/Login/Login'
import PaginaInicial from '../pages/PaginaInicial/PaginaInicial'
import TurmaVirtual from '../pages/TurmaVirtual/TurmaVirtual'
import MinhasDisciplinas from '../pages/MinhasDisciplinas/MinhasDisciplinas'
import { PATHS } from './paths'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PATHS.login} replace />} />

      {/* Páginas sem layout: o Login possui header e footer próprios */}
      <Route path={PATHS.login} element={<Login />} />

      {/* Páginas internas: usam o MainLayout via Outlet */}
      <Route element={<MainLayout />}>
        <Route path={PATHS.inicio} element={<PaginaInicial />} />
        <Route path={PATHS.minhasDisciplinas} element={<MinhasDisciplinas />} />
        <Route path="/turma-virtual" element={<TurmaVirtual />} />
        <Route path="/turma-virtual/:disciplinaId" element={<TurmaVirtual />} />
      </Route>

      <Route path="*" element={<Navigate to={PATHS.login} replace />} />
    </Routes>
  )
}

export default AppRoutes
