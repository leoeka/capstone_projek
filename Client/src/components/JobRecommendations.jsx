import React from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/JobRecommendations.css'
import { useAuth } from '../context/useAuth'

const staticJobs = [
  { id: 1, company: 'PT. TechInnovate', role: 'Frontend Developer', location: 'Jakarta', match: 85 },
  { id: 2, company: 'Creative Solutions', role: 'UI-UX Designer', location: 'Bandung', match: 72 },
  { id: 3, company: 'Global Fintech', role: 'Data Analyst', location: 'Surabaya', match: 60 },
]

const JobRecommendations = () => {
  const navigate = useNavigate()
  const { cvResult } = useAuth()

  const fromCV = cvResult?.rekomendasi?.length > 0
  const jobs = fromCV
    ? cvResult.rekomendasi.map((item, i) => ({
        id: i + 1,
        role: item.role,
        match: item.match,
        company: item.company || null,
        location: item.location || null,
      }))
    : staticJobs

  return (
    <div className="job-recommendations-content">
      <div className="rec-header">
        <h2>Rekomendasi Pekerjaan</h2>
        {fromCV ? (
          <div className="rec-source-badge">
            <span className="badge-cv">Berdasarkan CV kamu</span>
            {cvResult.kategori && <span className="rec-kategori">Kategori: <strong>{cvResult.kategori}</strong></span>}
          </div>
        ) : (
          <p className="rec-hint">Upload CV kamu untuk mendapatkan rekomendasi yang lebih personal.</p>
        )}
      </div>

      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-info">
              <h3>{job.role}</h3>
              {job.company && <p className="job-company">{job.company}</p>}
              {job.location && <p className="job-location">📍 {job.location}</p>}
            </div>
            <div className="job-right">
              <div className="match-score">
                Match: <span className="match-value">{job.match}%</span>
              </div>
              <button className="secondary-btn details-btn" onClick={() => navigate(`/job/${job.id}`)}>
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobRecommendations
