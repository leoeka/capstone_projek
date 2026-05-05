import React, { useState, useRef, useEffect } from 'react'
import './styles/UploadCV.css'
import axios from 'axios'
import { useAuth } from '../context/useAuth'

const UploadCV = () => {
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { token } = useAuth()
  const [analysisResult, setAnalysisResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

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
    setIsUploading(true);
    setStatusMessage('Mengupload file...');
    setAnalysisResult(null);

    const formData = new FormData()
    formData.append('cv', file)

    try {
      const response = await axios.post('http://localhost:5000/api/auth/upload-cv', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const jobId = response.data.jobId;
      setStatusMessage('File berhasil diunggah. Menunggu analisis...');
      pollJobStatus(jobId);
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Terjadi kesalahan saat mengunggah file CV')
      setIsUploading(false);
      setStatusMessage('');
    }
  };

  const pollJobStatus = (jobId) => {

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/check-cv-status/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.data.status === 'completed') {
          clearInterval(pollingIntervalRef.current);
          setIsUploading(false);
          setStatusMessage('Analisis selesai.');
          setAnalysisResult(res.data.result);
          setFile(null);
        } else if (res.data.status === 'failed') {
          clearInterval(pollingIntervalRef.current);
          setIsUploading(false);
          setStatusMessage('');
          alert('Analisis CV gagal: ' + res.data.error);
        }
      } catch (error) {
        console.error(error);
        clearInterval(pollingIntervalRef.current);
        setIsUploading(false);
        console.log("Gagal mengecek status pekerjaan", error);
      }
    }, 2000); // Poll every 2 seconds
  };

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
      {statusMessage && (
        <div className="status-indicator">
          <p>{statusMessage}</p>
        </div>
      )}
      {analysisResult && (
        <div className="analysis-result-container">
          <h3>Hasil Analisis:</h3>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  )
}

export default UploadCV
