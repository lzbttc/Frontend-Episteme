import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { studentMock } from '../../mocks/studentMock'
import './MainLayout.css'

/**
 * Layout estrutural compartilhado para as páginas internas da aplicação.
 * Renderiza Header superior, conteúdo das rotas via Outlet e Footer inferior.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.children] - Conteúdo alternativo (se não usar Outlet)
 * @param {Function} [props.onNavigate] - Callback de navegação legado opcional
 */
function MainLayout({ children, onNavigate }) {
  return (
    <div className="main-layout">
      <Header student={studentMock.student} onNavigate={onNavigate} />
      <main className="main-layout__content">{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
