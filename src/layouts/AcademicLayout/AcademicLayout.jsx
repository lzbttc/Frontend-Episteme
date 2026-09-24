import './AcademicLayout.css'

import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

function AcademicLayout({
  children,
  user,
  onNotificationsClick,
  onHelpClick,
  onProfileClick,
}) {
  return (
    <div className="academic-layout">
      <Header
        user={user}
        onNotificationsClick={onNotificationsClick}
        onHelpClick={onHelpClick}
        onProfileClick={onProfileClick}
      />

      <main className="academic-layout-content">{children}</main>

      <Footer />
    </div>
  )
}

export default AcademicLayout