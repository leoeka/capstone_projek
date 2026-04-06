import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import UploadCV from './components/UploadCV.jsx'
import JobRecommendations from './components/JobRecommendations.jsx'
import JobDetail from './components/JobDetail.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rekomendasi" element={<JobRecommendations />} />
            <Route path="/upload-cv" element={<UploadCV />} />
            <Route path="/job/:id" element={<JobDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
