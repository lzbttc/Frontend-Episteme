import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { useAsyncData } from '../../hooks/useAsyncData'
import { obterAluno } from '../../services/alunoService'
import './MainLayout.css'

/**
 * Layout estrutural compartilhado para as páginas internas da aplicação.
 * Renderiza Header superior com dados do aluno via serviço, Outlet para as rotas filhas e Footer.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.children] - Conteúdo alternativo (se não usar Outlet)
 */
function MainLayout({ children }) {
  const { data } = useAsyncData(obterAluno)
  const student = data?.student || { name: 'Aluno', matricula: '' }

  return (
    <div className="main-layout">
      <Header student={student} />
      <main className="main-layout__content">{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
