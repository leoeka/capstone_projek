import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import './styles/JobDetail.css'

const allJobs = [
  {
    id: 1,
    company: 'PT.TechInnovate',
    role: 'Frontend Developer',
    location: 'Jakarta',
    description: [
      'Mengembangkan dan memelihara aplikasi web',
    'Bekerja dengan tim UI/UX',
    'Mengoptimalkan performa situs',
  ],
  skills: [
    'HTML',
    'CSS',
    'JavaScript',
    'React'
  ],
  match: 85,
},
{
  id: 2,
  company: 'Creative Solutions',
  role: 'Backend Developer',
  location: 'Bandung',
  description: [
    'Mengembangkan dan memelihara server aplikasi',
    'Bekerja dengan tim teknologi',
    'Mengoptimalkan performa server'
  ],
  skills: [
    'Python',
    'Node.js',
    'PostgreSQL',
    'Docker'
  ],
  match: 90,
},
{
  id: 3,
  company: 'Global Fintech',
  role: 'Data Analyst',
  location: 'Surabaya',
  description: [
    'Menganalisis data untuk memberikan wawasan bisnis',
    'Membuat laporan dan presentasi data',
    'Bekerja dengan tim data science'
  ],
  skills: [
    'Python',
    'SQL',
    'Tableau',
    'Power BI'
  ],
  match: 80
},
]

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [sudahDisimpan, setSudahDisimpan] = useState(false)

  const jobDetail = allJobs.find((job) => job.id === parseInt(id))

  if (!jobDetail) {
    return <div className="job-detail-content">Pekerjaan tidak ditemukan.</div>
  }

  const handleSimpan = () => {
    const riwayatLama = JSON.parse(localStorage.getItem('riwayat') || '[]')

    const sudahAda = riwayatLama.find(
      (item) => item.company === jobDetail.company && item.role === jobDetail.role
    )

    if (sudahAda) {
      alert('Pekerjaan ini sudah disimpan.')
      setShowModal(false)
      return
    }

    const simpan = {
      simpanid: crypto.randomUUID(),
      company: jobDetail.company,
      role: jobDetail.role,
      location: jobDetail.location,
      match: `${jobDetail.match}%`,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    }

    localStorage.setItem('riwayat', JSON.stringify([simpan, ...riwayatLama]))
    setSudahDisimpan(true)
    setShowModal(false)
    navigate('/riwayat')
  }

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

      <button className="primary-btn apply-btn" onClick={() => setShowModal(true)} disabled={sudahDisimpan}>
        {sudahDisimpan ? 'Sudah Disimpan' : 'Simpan Pekerjaan Ini'}
      </button>

      {/* Modal konfirmasi */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-title">Simpan pekerjaan ini</p>
            <p className="modal-sub">{jobDetail.role} . {jobDetail.company}</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-primary" onClick={handleSimpan}> Ya, Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobDetail