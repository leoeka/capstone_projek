import './styles/riwayat.css';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

const riwayat = [
    { id: 1, company: 'PT. TechInnovate', role: 'Frontend Developer', location: 'Jakarta', match: '85%', tanggal: '10 April 2025', status: 'diterima' },
    { id: 2, company: 'Creative Solutions', role: 'UI-UX Designer', location: 'Bandung', match: '72%', tanggal: '10 Mei 2025', status: 'ditolak' },
    { id: 3, company: 'Global Fintech', role: 'Data Analyst', location: 'Surabaya', match: '60%', tanggal: '10 Juni 2025', status: 'proses' },
];

const statusLabel = {
    diterima: { text: "Diterima", class: "status-diterima" },
    ditolak: { text: "Ditolak", class: "status-ditolak" },
    proses: { text: "Proses", class: "status-proses" },
    menunggu: { text: "Menunggu", class: "status-menunggu" }
};

const Riwayat = () => {
    return (
        <div className="riwayat-content">
            <h2 className="riwayat-title">Riwayat Lamaran</h2>

            {riwayat.length === 0 ? (
                <p className="riwayat-kosong">Tidak ada riwayat lamaran.</p>
            ) : (
                <div className="riwayat-list">
                    {riwayat.map((item) => (
                        <div key={item.id} className="riwayat-card">
                            <div className="riwayat-info">
                                <p className="riwayat-posisi">{item.role}</p>
                                <p className="riwayat-perusahaan">{item.company} . {item.location}</p>
                                <p className="riwayat-tanggal">Dilamar: {item.tanggal}</p>
                                <p className="riwayat-match">Match: {item.match}</p>
                            </div>
                            <span className={`riwayat-badge ${statusLabel[item.status]?.class}`}>
                                {statusLabel[item.status]?.text}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Riwayat;