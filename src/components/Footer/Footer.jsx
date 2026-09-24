import './Footer.css'

function Footer({
  version = '1.0.0',
  campus = 'Campus Universitário',
}) {
  return (
    <footer className="footer">
      <nav className="footer-links" aria-label="Links institucionais">
        <a href="/termos-de-uso">Termos de Uso</a>
        <a href="/politica-de-privacidade">Política de Privacidade</a>
        <a href="/central-de-ajuda">Central de Ajuda</a>
      </nav>

      <div className="footer-info">
        <span>Epis</span>
        <span aria-hidden="true">•</span>
        <span>{version}</span>
        <span aria-hidden="true">•</span>
        <span>{campus}</span>
      </div>
    </footer>
  )
}

export default Footer