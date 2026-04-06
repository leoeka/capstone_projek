import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThLarge, faPlusSquare, faFileUpload, faHistory, faUserCircle, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import './styles/Sidebar.css'

const navItems = [
  { to: '/dashboard', icon: faThLarge, label: 'Dashboard' },
  { to: '/rekomendasi', icon: faPlusSquare, label: 'Rekomendasi' },
  { to: '/upload-cv', icon: faFileUpload, label: 'Upload CV' },
  { to: '/riwayat', icon: faHistory, label: 'Riwayat' },
  { to: '/profil', icon: faUserCircle, label: 'Profil' },
]

const Sidebar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <div className="logo-container">
          <span className="logo">3</span> Jobs
        </div>
        <button className="hamburger" onClick={() => setOpen(!open)}>
          <FontAwesomeIcon icon={open ? faTimes : faBars} />
        </button>
      </div>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="logo-container desktop-logo">
          <span className="logo">3</span> Jobs
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map(({ to, icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setOpen(false)}
                >
                  <FontAwesomeIcon icon={icon} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
