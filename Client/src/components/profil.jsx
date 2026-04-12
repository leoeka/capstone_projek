import './styles/profil.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const skills = [
    { name: "JavaScript", pct: 80, color: "green" },
    { name: "React", pct: 70, color: "blue" },
    { name: "Node.js", pct: 60, color: "yellow" }
];

const Profil = () => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profil, setProfil] = useState({
        name: "John doe",
        role: "Frontend Developer Jakarta",
        email: "leo@gmail.com",
        telepon: "+62 812 3456 7890"
    });

    const [form, setForm] = useState(profil);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSimpan = () => {
        setProfil(form);
        setIsEditing(false);
    }

    const handleBatal = () => {
        setForm(profil);
        setIsEditing(false);
    }

    return (
        <div className="profil-content">

            {/* Header */}
            <div className="profil-header">
                <div className="profil-avatar">
                    {profil.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="profil-name">{profil.name}</p>
                    <p className="profil-role">{profil.role}</p>
                </div>
            </div>

            {/* Kontak - mode lihat */}
            {!isEditing && (
                <div className="profil-section">
                    <h3>Kontak</h3>
                    <p className="contact-row"><span>📧 Email</span>{profil.email}</p>
                    <p className="contact-row"><span>📞 Telepon</span>{profil.telepon}</p>
                </div>
            )}

            {/* Form edit - muncul saat isEditing true */}
            {isEditing && (
                <div className="profil-section">
                    <h3>Edit Kontak</h3>

                    <div className="form-group">
                        <label>Nama</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Telepon</label>
                        <input
                            name="telepon"
                            value={form.telepon}
                            onChange={handleChange}
                        />
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
                            <div
                                className={`skill-fill fill-${skill.color}`}
                                style={{ width: `${skill.pct}%` }}
                            />
                        </div>
                        <span className={`skill-pct text-${skill.color}`}>{skill.pct}%</span>
                    </div>
                ))}
            </div>

            {/* Tombol */}
            <div className="button-group">
                <button className="btn-primary" onClick={() => navigate('/upload-cv')}>Upload CV Baru</button>
                <button className="btn-outline" onClick={() => setIsEditing(true)}>
                    Edit Profil
                </button>
            </div>
        </div>
    );
};

export default Profil;