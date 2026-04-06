import React, { useState } from 'react'
import './styles/UploadCV.css'

const UploadCV = () => {
  const [file, setFile] = useState(null)

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) setFile(droppedFile)
  }

  return (
    <div className="upload-cv-content">
      <h2>Upload CV</h2>
      <div className="drop-zone" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <div className="drop-zone-icon-text">
          <div className="file-icons">
            <span className="pdf-icon">PDF</span>
            <span className="docx-icon">DOCX</span>
          </div>
          <p>Drag & Drop file disini</p>
          <p className="or-text">atau</p>
        </div>
      </div>
      <button className="primary-btn upload-btn">Upload & Analisis</button>
      {file && <p>File terpilih: {file.name}</p>}
    </div>
  )
}

export default UploadCV
