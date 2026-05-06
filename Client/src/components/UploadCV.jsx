import React, { useState, useRef, useEffect } from 'react'
import './styles/UploadCV.css'
import axios from 'axios'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'

const UploadCV = () => {
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { token, setCvResult } = useAuth()
  const navigate = useNavigate()
  const [analysisResult, setAnalysisResult] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')

  const pollingIntervalRef = useRef(null)

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    }
  }, [])

  const handleFileChange = (e) => handleFileValidation(e.target.files[0])

  const handleFileValidation = (selectedFile) => {
    if (!selectedFile) return
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Silakan pilih file PDF atau DOCX')
      return
    }
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true)
    setStatusMessage('Mengupload file...')
    setAnalysisResult(null)

    const formData = new FormData()
    formData.append('cv', file)

    try {
      const response = await axios.post('http://localhost:5000/api/auth/upload-cv', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setStatusMessage('File berhasil diunggah. Menunggu analisis...')
      pollJobStatus(response.data.jobId)
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Terjadi kesalahan saat mengunggah file CV')
      setIsUploading(false)
      setStatusMessage('')
    }
  }

  const pollJobStatus = (jobId) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/check-cv-status/${jobId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.data.status === 'completed') {
          clearInterval(pollingIntervalRef.current)
          setIsUploading(false)
          setStatusMessage('Analisis selesai.')
          console.log('Result:', res.data.result)
          setAnalysisResult(res.data.result)
          setCvResult(res.data.result)
          setFile(null)
        } else if (res.data.status === 'failed') {
          clearInterval(pollingIntervalRef.current)
          setIsUploading(false)
          setStatusMessage('')
          alert('Analisis CV gagal: ' + res.data.error)
        }
      } catch (error) {
        console.error(error)
        clearInterval(pollingIntervalRef.current)
        setIsUploading(false)
        console.log('Gagal mengecek status pekerjaan', error)
      }
    }, 2000)
  }

  return (
    <div className="upload-cv-content">

      {/* PAGE HEADER */}
      <div className="cv-page-header">
        <div>
          <h2>Upload CV</h2>
          <p className="cv-page-subtitle">Unggah CV kamu untuk mendapatkan analisis dan rekomendasi pekerjaan</p>
        </div>
      </div>

      {/* UPLOAD AREA */}
      <div className="cv-upload-section">

        {/* DROP ZONE */}
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onClick={() => !file && fileInputRef.current.click()}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileValidation(e.dataTransfer.files[0]) }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false) }}
        >
          {!file ? (
            <div className="drop-zone-inner">
              <div className="dz-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="dz-title">Drag & Drop file di sini</p>
              <p className="dz-sub">atau klik untuk memilih file</p>
              <div className="dz-badges">
                <span className="dz-badge pdf">PDF</span>
                <span className="dz-badge docx">DOCX</span>
              </div>
            </div>
          ) : (
            <div className="file-preview-row">
              <span className={`ftype-badge ${file.name.endsWith('.pdf') ? 'pdf' : 'docx'}`}>
                {file.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}
              </span>
              <div className="finfo">
                <span
                  className="fname"
                  onClick={(e) => { e.stopPropagation(); window.open(URL.createObjectURL(file), '_blank') }}
                  title="Klik untuk preview"
                >
                  {file.name}
                </span>
                <span className="fsize">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
              <button className="btn-hapus" onClick={(e) => { e.stopPropagation(); setFile(null) }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Hapus
              </button>
            </div>
          )}
        </div>

        <input type="file" accept=".pdf,.docx" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

        {/* ACTIONS ROW */}
        <div className="cv-actions-row">
          <button className="primary-btn upload-btn" disabled={!file || isUploading} onClick={handleUpload}>
            {isUploading
              ? <><span className="btn-spinner" /> Menganalisis...</>
              : 'Upload & Analisis CV'
            }
          </button>
          {statusMessage && (
            <p className="status-indicator">{statusMessage}</p>
          )}
        </div>

        {/* TIPS */}
        <div className="cv-tips">
          <span className="tips-icon">💡</span>
          <span>Gunakan CV terstruktur dengan skill dan pengalaman kerja yang jelas.</span>
        </div>
      </div>

      {/* ANALYSIS RESULT */}
      {analysisResult && (
        <div className="analysis-result-container">
          <h3>Hasil Analisis CV</h3>

          <div className="result-grid">

            {/* Skill */}
            <div className="result-card">
              <div className="result-card-header">
                <h4>Skill Terdeteksi</h4>
              </div>
              <div className="skill-tags">
                {analysisResult.skills?.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            {/* Kategori */}
            <div className="result-card">
              <div className="result-card-header">
                <h4>Kategori Pekerjaan</h4>
              </div>
              <p className="kategori-value">{analysisResult.kategori}</p>
            </div>

            {/* Rekomendasi — CTA ke halaman rekomendasi */}
            <div className="result-card result-card-full rek-cta-card">
              <div className="rek-cta-left">
                <div>
                  <h4>Rekomendasi Pekerjaan Tersedia</h4>
                  <p>{analysisResult.rekomendasi?.length || 0} pekerjaan cocok ditemukan berdasarkan CV kamu</p>
                </div>
              </div>
              <button className="primary-btn rek-cta-btn" onClick={() => navigate('/rekomendasi')}>
                Lihat Rekomendasi →
              </button>
            </div>

            {/* Gap Skill */}
            <div className="result-card result-card-full">
              <div className="result-card-header">
                <h4>Gap Skill</h4>
              </div>
              <div className="skill-tags">
                {analysisResult.gap_skills?.map((skill, i) => (
                  <span key={i} className="skill-tag gap">{skill}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default UploadCV
