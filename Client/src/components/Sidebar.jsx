import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThLarge, faPlusSquare, faFileUpload, faHistory, faUserCircle, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/useAuth'
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
  const { user } = useAuth()

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <div className="logo-container">
          <span className="logo">KarirKu</span>AI
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
          <span className="logo">KarirKu</span><span>AI</span>
        </div>
        {user && (
          <div className="sidebar-user">
            <div className="profil-avatar">
              {user?.photo ? (
                <img src={`http://localhost:5000${user.photo}`} alt="profile" className="avatar-img" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user.name}</span>
              <span className="sidebar-user-role">{user.role}</span>
            </div>
          </div>
        )}
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
