import './styles/profil.css';

const skills = [
    { name: "JavaScript", pct: 80, color: "green" },
    { name: "React", pct: 70, color: "blue" },
    { name: "Node.js", pct: 60, color: "yellow" }
];

const Profil = () => {
    return (
        <div className="profil-content">

            {/* Header */}
            <div className="profil-header">
                <div className="profil-avatar">MR</div>
                <div>
                    <p className="profil-name">Mister Naufal</p>
                    <p className="profil-role">Frontend Developer Jakarta</p>
                </div>
            </div>

            {/* Kontak */}
            <div className="profil-section">
                <h3>Kontak</h3>
                <p className="contact-row"><span>📧 Email</span>Email: naufal@example.com</p>
                <p className="contact-row"><span>📞 Telepon</span>Phone: +62 812 3456 7890</p>
            </div>

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
                <button className="btn-primary">Upload CV Baru</button>
                <button className="btn-outline">Edit Profil</button>
            </div>
        </div>
    );
};

export default Profil;