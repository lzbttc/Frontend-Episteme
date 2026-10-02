import { Navigate, Route, Routes } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout/MainLayout'
import Login from '../pages/Login/Login'
import PaginaInicial from '../pages/PaginaInicial/PaginaInicial'

function AppRoutes() {
  return (
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
  )
}

export default AppRoutes
