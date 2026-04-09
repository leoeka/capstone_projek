import React from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  return (
    <div className="dashboard-content">
      <h2>Dashboard</h2>
      <div className="dashboard-summary">
        <div className="card-container">
          <h3>Ringkasan Anda</h3>
          <div className="summary-card">
            <h4>Skill Terdeteksi</h4>
            <p>Laravel, JavaScript</p>
          </div>
          <div className="summary-card match-status">
            <h4>Pekerjaan Cocok</h4>
            <p>12 Lowongan</p>
            <span className="match-tag">Match: 85%</span>
          </div>
        </div>
        <div className="button-group">
          <button className="primary-btn" onClick={() => navigate('/upload-cv')}>Upload CV</button>
          <button className="secondary-btn" onClick={() => navigate('/rekomendasi')}>Lihat Rekomendasi</button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
