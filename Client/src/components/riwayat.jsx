import { useState } from 'react';
import './styles/riwayat.css';

const ambilRiwayat = () => JSON.parse(localStorage.getItem('riwayat') || '[]')

const Riwayat = () => {
    const [riwayat, setRiwayat] = useState(ambilRiwayat);

    const hapusItem = (simpanId, index) => {
        const updated = riwayat.filter((item, i) =>
            simpanId != null ? item.simpanId !== simpanId : i !== index
        )
        setRiwayat(updated)
        localStorage.setItem('riwayat', JSON.stringify(updated))
    }

    return (
        <div className="riwayat-content">
            <h2 className="riwayat-title">Pekerjaan yang Disimpan</h2>

            {riwayat.length === 0 ? (
                <p className="riwayat-kosong">Tidak ada pekerjaan yang disimpan.</p>
            ) : (
                <div className="riwayat-list">
                    {riwayat.map((item, i) => (
                        <div key={item.simpanId ?? i} className="riwayat-card">
                            <div className="riwayat-info">
                                <p className="riwayat-posisi">{item.role}</p>
                                <p className="riwayat-perusahaan">{item.company} . {item.location}</p>
                                <p className="riwayat-tanggal">Disimpan: {item.tanggal}</p>
                            </div>
                            <div className="riwayat-actions">
                                <span className="riwayat-badge status-diterima">
                                    {item.match} Match
                                </span>
                                <button className="btn-hapus-riwayat" onClick={() => hapusItem(item.simpanId, i)} title="Hapus">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                        <path d="M10 11v6M14 11v6"/>
                                        <path d="M9 6V4h6v2"/>
                                    </svg>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Riwayat;