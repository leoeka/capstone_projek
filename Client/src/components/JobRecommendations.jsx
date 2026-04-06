import React from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/JobRecommendations.css'

const jobs = [
  { id: 1, company: 'PT. TechInnovate', role: 'Frontend Developer', location: 'Jakarta', match: '85%' },
  { id: 2, company: 'Creative Solutions', role: 'UI-UX Designer', location: 'Bandung', match: '72%' },
  { id: 3, company: 'Global Fintech', role: 'Data Analyst', location: 'Surabaya', match: '60%' },
]

const JobRecommendations = () => {
  const navigate = useNavigate()

  return (
    <div className="job-recommendations-content">
      <h2>Rekomendasi Pekerjaan</h2>
      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-info">
              <h3>{job.company}</h3>
              <p>{job.role}</p>
              <p>{job.location}</p>
            </div>
            <div className="match-score">
              Match: <span className="match-value">{job.match}</span>
            </div>
            <button className="secondary-btn details-btn" onClick={() => navigate(`/job/${job.id}`)}>
              Lihat Detail
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobRecommendations
