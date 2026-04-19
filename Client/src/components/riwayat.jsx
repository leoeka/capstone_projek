import { useState } from 'react';
import './styles/riwayat.css';

const ambilRiwayat = () => JSON.parse(localStorage.getItem('riwayat') || '[]')

const Riwayat = () => {
    const [riwayat] = useState(ambilRiwayat);

    return (
        <div className="riwayat-content">
            <h2 className="riwayat-title">Pekerjaan yang Disimpan</h2>

            {riwayat.length === 0 ? (
                <p className="riwayat-kosong">Tidak ada pekerjaan yang disimpan.</p>
            ) : (
                <div className="riwayat-list">
                    {riwayat.map((item) => (
                        <div key={item.simpanId} className="riwayat-card">
                            <div className="riwayat-info">
                                <p className="riwayat-posisi">{item.role}</p>
                                <p className="riwayat-perusahaan">{item.company} . {item.location}</p>
                                <p className="riwayat-tanggal">Disimpan: {item.tanggal}</p>
                            </div>
                            <span className="riwayat-badge status-diterima">
                                {item.match} Match
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Riwayat;