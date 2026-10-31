import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import './MainLayout.css'

/**
 * Layout estrutural compartilhado para as páginas internas da aplicação.
 * Renderiza Header com dados do aluno lidos do AuthContext, Outlet para as rotas filhas e Footer.
 * Não realiza requisições próprias: o dado do aluno vem direto do contexto de autenticação.
 */
function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
