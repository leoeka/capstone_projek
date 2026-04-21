import './styles/profil.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/useAuth'

const skills = [
  { name: 'JavaScript', pct: 80, color: 'green' },
  { name: 'React', pct: 70, color: 'blue' },
  { name: 'Node.js', pct: 60, color: 'yellow' },
]

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
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSimpan = () => {
    updateUser(form)
    setIsEditing(false)
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

      {/* Header */}
      <div className="profil-header">
        <div className="profil-avatar">
          {user?.name?.charAt(0).toUpperCase()}
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
