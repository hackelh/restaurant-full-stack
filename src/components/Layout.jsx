import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`content ${!sidebarOpen ? 'expanded' : ''}`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
