import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import axios from 'axios'
import './styles/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const { token, user } = useAuth()

  console.log('User:', user)
  console.log('Token:', token)

  const [loading, setLoading] = useState(true)
  const [cvData, setCvData] = useState(null)
  const [aiResult, setAiResult] = useState(null)

  useEffect(() => {
    const fetchLastCV = async () => {
      try {
        const res = await axios.get(/*'http://localhost:5000/api/auth/last-cv'*/`${import.meta.env.VITE_API_URL}/api/auth/last-cv`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (res.data?.cv) {
          setCvData(res.data.cv)

          if (res.data.cv.ai_result) {
            const aiData =
            typeof res.data.cv.ai_result === 'string'
              ? JSON.parse(res.data.cv.ai_result)
              : res.data.cv.ai_result;
            setAiResult(aiData)
          }
        }
      } catch (error) {
        console.log('Belum ada CV dianalisis', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLastCV()
  }, [token])

  const topRecommendation = aiResult?.rekomendasi?.[0]

  return (
    <div className="dashboard-content">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p className="dashboard-subtitle">
            Selamat datang {user?.name || 'User'} 🙌
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="dashboard-loading">
          <div className="loader"></div>
          <p>Memuat dashboard...</p>
        </div>
      ) : (
        <>
          {/* BELUM ADA CV*/}
          {!aiResult ? (
            <div className="empty-dashboard-card">
              <div className="empty-icon">📄</div>
              <h3>Belum Ada CV yang Dianalisis</h3>
              <p>Silakan unggah CV Anda untuk dianalisis oleh AI kami.</p>

              <button className="primary-btn" onClick={() => navigate('/upload-cv')}>
                Unggah CV
              </button>
            </div>
          ) : (
            <>
              {/* GRID */}
              <div className="dashboard-grid">

                {/* SKILL */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Skill Terdeteksi</h3>
                  </div>

                  <div className="skill-tags">
                    {aiResult.skills?.map((skill, i) => (
                      <span key={i} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* KATEGORI */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Kategori Utama</h3>
                  </div>

                  <div className="kategori-box">
                    <span>{aiResult.kategori}</span>
                  </div>
                </div>

                {/* JOB MATCH */}
                <div className="dashboard-card dashboard-card-full">
                  <div className="card-header">
                    <h3>Rekomendasi Pekerjaan</h3>
                  </div>

                  <div className="job-summary">
                    <div>
                      <p className="job-role">
                        {topRecommendation?.job_title || 'Tidak ada rekomendasi'}
                      </p>
                      <p className="job-desc">
                        Berdasarkan hasil analisis CV Anda yang terbaru
                      </p>
                    </div>

                    {topRecommendation && (
                      <div className="match-badge">
                        Match: <span>{topRecommendation.match}%</span>
                      </div>
                    )}
                  </div>

                  <button className="secondary-btn dashboard-btn"
                    onClick={() => navigate('/rekomendasi')} >
                    Lihat Rekomendasi
                  </button>
                </div>

                {/* GAP SKILL */}
                <div className="dashboard-card dashboard-card-full">
                  <div className="card-header">
                    <h3>Skill yang Perlu Ditingkatkan</h3>
                  </div>

                  <div className="skill-tags">
                    {aiResult.gap_skills?.map((skill, i) => (
                      <span key={i} className="skill-tag gap-skill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* STATUS CV */}
                <div className="dashboard-card dashboard-card-full">
                  <div className="card-header">
                    <h3>Status CV</h3>
                  </div>

                  <div className="cv-status-box">
                    <div>
                      <p className="cv-status-title">Analisis CV Terakhir</p>
                      <span className={`cv-status ${cvData?.status_analisis}`}>
                        {cvData?.status_analisis}
                      </span>
                    </div>

                    <button className="primary-btn"
                      onClick={() => navigate('/upload-cv')}>
                      Upload CV Baru
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
