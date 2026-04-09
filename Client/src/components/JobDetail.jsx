import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import './styles/JobDetail.css'

const jobDetail = {
  company: 'PT. TechInnovate',
  role: 'Frontend Developer',
  location: 'Jakarta',
  description: [
    'Mengembangkan dan memelihara aplikasi web',
    'Bekerja dengan tim UI/UX',
    'Mengoptimalkan performa situs',
  ],
  skills: ['HTML', 'CSS', 'JavaScript', 'React'],
  match: 85,
}

const JobDetail = () => {
  return (
    <div className="job-detail-content">
      <div className="header-bar">
        <span>{jobDetail.company} / {jobDetail.role}</span>
        <span>{jobDetail.location}</span>
      </div>
      <h2>Detail Pekerjaan</h2>
      <div className="detail-section">
        <div className="job-description">
          <h3>Deskripsi Pekerjaan</h3>
          <ul>
            {jobDetail.description.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="match-circle-container">
          <p className="match-label">Kecocokan Anda</p>
          <CircularProgressbar
            value={jobDetail.match}
            text={`${jobDetail.match}%`}
            styles={buildStyles({
              pathColor: '#28A745',
              textColor: '#28A745',
              trailColor: '#eee',
              textSize: '18px',
            })}
          />
          <p className="match-sublabel">Match</p>
        </div>
      </div>
      <div className="skill-section">
        <h3>Skill Dibutuhkan</h3>
        <ul>
          {jobDetail.skills.map((skill, i) => <li key={i}>{skill}</li>)}
        </ul>
      </div>
      <button className="primary-btn apply-btn">Lamar Sekarang</button>
    </div>
  )
}

export default JobDetail
