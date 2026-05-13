import './styles/profil.css'
import { Form, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import axios from 'axios'

const Profil = () => {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    role: user?.role || '',
    email: user?.email || '',
    telepon: user?.telepon || '',
  })

  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [skills, setSkills] = useState([])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem('token')

         const res = await axios.get(/*'http://localhost:5000/api/auth/last-cv'*/`${import.meta.env.VITE_API_URL}/api/auth/last-cv`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        )
        if (res.data?.cv?.ai_result) {
          const aiData =
            typeof res.data.cv.ai_result === 'string'
              ? JSON.parse(res.data.cv.ai_result)
              : res.data.cv.ai_result;

          const generatedSkills = aiData.skills?.map((skill, index) => ({
            name: skill,
            pct: 90 - index * 10,
            color:
              index % 3 === 0
                ? 'green'
                : index % 3 === 1
                  ? 'blue'
                  : 'yellow'
          }))
          setSkills(generatedSkills || [])
        }
      } catch (error) {
        console.log('Gagal mengambil skill CV', error)
      }
    }

    fetchSkills()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSimpan = async () => {
    setError('')
    setSuccessMsg('')

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('role', form.role)
    formData.append('email', form.email)
    formData.append('telepon', form.telepon)
    if (photoFile) {
      formData.append('photo', photoFile)
    }

    const result = await updateUser(formData)
    if (result.success) {
      setSuccessMsg('Profil berhasil diperbarui')
      setIsEditing(false)
      setPhotoFile(null)
      setPreviewUrl(null)
    } else {
      setError(result.message)
    }
  }

  const handleBatal = () => {
    setForm({ name: user.name, role: user.role, email: user.email, telepon: user.telepon })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="profil-content">

      {/* Notifikasi */}
      {successMsg && <div className="profil-success">{successMsg}</div>}
      {error && <div className="profil-error">{error}</div>}

      {/* Header */}
      <div className="profil-header">
        <div className="profil-avatar">
          {(previewUrl || user?.photo) ? (
            <img
              src={previewUrl || /*`http://localhost:5000${user.photo}`*/ `${import.meta.env.VITE_API_URL}${user.photo}`}
              alt="profile"
              className="avatar-img"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="profil-name">{user?.name}</p>
          <p className="profil-role">{user?.role}</p>
        </div>
      </div>

      {/* Kontak - mode lihat */}
      {!isEditing && (
        <div className="profil-section">
          <h3>Kontak</h3>
          <p className="contact-row"><span>📧 Email</span>{user?.email}</p>
          <p className="contact-row"><span>📞 Telepon</span>{user?.telepon}</p>
        </div>
      )}

      {/* Form edit */}
      {isEditing && (
        <div className="profil-section">
          <h3>Edit Profil</h3>
          <div className="form-group">
            <input type='file' accept='image/*' onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                setPhotoFile(file)
                setPreviewUrl(URL.createObjectURL(file))
              }
            }} />
          </div>
          <div className="form-group">
            <label>Nama</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input name="role" value={form.role} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Telepon</label>
            <input name="telepon" value={form.telepon} onChange={handleChange} />
          </div>
          <div className="button-group" style={{ marginTop: '12px' }}>
            <button className="btn-primary" onClick={handleSimpan}>Simpan</button>
            <button className="btn-outline" onClick={handleBatal}>Batal</button>
          </div>
        </div>
      )}

      {/* Skill Gap */}
      <div className="profil-section">
        <h3>Analisis Skill</h3>
        {skills.map((skill) => (
          <div key={skill.name} className="skill-row">
            <span className="skill-label">{skill.name}</span>
            <div className="skill-track">
              <div className={`skill-fill fill-${skill.color}`} style={{ width: `${skill.pct}%` }} />
            </div>
            <span className={`skill-pct text-${skill.color}`}>{skill.pct}%</span>
          </div>
        ))}
      </div>

      {/* Tombol */}
      <div className="button-group">
        <button className="btn-primary" onClick={() => navigate('/upload-cv')}>Upload CV Baru</button>
        {!isEditing && (
          <button className="btn-outline" onClick={() => setIsEditing(true)}>Edit Profil</button>
        )}
        <button className="btn-logout" onClick={() => setShowLogoutModal(true)}>Keluar</button>
      </div>

      {/* Pop up konfirmasi logout */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-title">Yakin ingin keluar?</p>
            <p className="modal-sub">Anda akan keluar dari akun ini.</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowLogoutModal(false)}>Batal</button>
              <button className="btn-logout" onClick={() => { setShowLogoutModal(false); handleLogout(); }}>Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profil
