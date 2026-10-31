import { Link } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <nav className="footer__links" aria-label="Links institucionais">
          <Link to={PATHS.emBreve} className="footer__link">
            Termos de Uso
          </Link>
          <span className="footer__dot" aria-hidden="true">
            •
          </span>
          <Link to={PATHS.emBreve} className="footer__link">
            Política de Privacidade
          </Link>
          <span className="footer__dot" aria-hidden="true">
            •
          </span>
          <Link to={PATHS.emBreve} className="footer__link">
            Central de Ajuda
          </Link>
        </nav>

        <div className="footer__info">
          <span className="footer__brand">Epis</span>
          <span className="footer__dot" aria-hidden="true">
            •
          </span>
          <span className="footer__version">v1.0.0</span>
          <span className="footer__dot" aria-hidden="true">
            •
          </span>
          <span className="footer__campus">Campus Universitário</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
