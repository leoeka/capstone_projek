import React, { useState, useRef } from 'react'
import './styles/UploadCV.css'
import axios from 'axios'
import { useAuth } from '../context/useAuth'

const UploadCV = () => {
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { token } = useAuth()

  // const handleDrop = (e) => {
  //   e.preventDefault()
  //   const droppedFile = e.dataTransfer.files[0]
  //   if (droppedFile) setFile(droppedFile)
  // }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    handleFileValidation(selectedFile)
  }

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

  const openFilePicker = () => {
    fileInputRef.current.click()
  }

  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true)

    const formData = new FormData()
    formData.append('cv', file)

    try {
      const response = await axios.post('http://localhost:5000/api/auth/upload-cv', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      alert(response.data.message)
      setFile(null)
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Terjadi kesalahan saat mengunggah file CV')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="upload-cv-content">
      <h2>Upload CV</h2>
      <div className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const droppedFile = e.dataTransfer.files[0]
          handleFileValidation(droppedFile)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false)
          }
        }}>
        <div className="drop-zone-icon-text">
          <div className="file-icons">
            <span className="pdf-icon" onClick={openFilePicker}>PDF</span>
            <span className="docx-icon" onClick={openFilePicker}>DOCX</span>
          </div>
          {!file ? (
            <p>Drag & Drop file disini atau klik ikon di atas</p>
          ) : (
            <div className="file-selected">
              <span
                className="file-name-link"
                onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                title="Klik untuk lihat file"
              >
                {file.name}
              </span>
              <button className="btn-hapus" onClick={(e) => { e.stopPropagation(); setFile(null) }}>✕ Hapus</button>
            </div>
          )}
        </div>
      </div>
      <input
        type="file"
        accept=".pdf,.docx"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button className="primary-btn upload-btn" disabled={!file || isUploading} onClick={handleUpload}>
        {isUploading ? 'Mengupload...' : 'Upload & Analisis'}
      </button>
    </div>
  )
}

export default UploadCV
