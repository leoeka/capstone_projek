const pool = require('../config/db');
const upload = require('../middleware/upload');
const cvAnalysisQueue = require('../services/cvQueue');

exports.uploadCV = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "File CV tidak ditemukan" });
    }

    try {

        const record = await pool.query(
            'INSERT INTO users_cvs (user_id, file_path, status_analisis) VALUES ($1, $2, $3) RETURNING id',
            [req.user.id, req.file.path, 'pending']
        );
        const cvId = record.rows[0].id;

        const job = await cvAnalysisQueue.add({
            filePath: req.file.path,
            mimetype: req.file.mimetype,
            userId: req.user.id,
            cvId: cvId
        });

        res.status(202).json({
            message: "CV berhasil diunggah dan sedang dianalisis oleh AI",
            jobId: job.id
        });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
};

exports.checkCVStatus = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await cvAnalysisQueue.getJob(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job tidak ditemukan" });
        }

        const state = await job.getState();
        const progress = job._progress;

        if (state === 'completed') {
            return res.status(200).json({
                status: 'completed',
                result: job.returnvalue
            });
        } else if (state === 'failed') {
            return res.status(500).json({
                status: 'failed',
                error: job.failedReason
            });
        } else {
            return res.status(200).json({
                status: state,
                progress: progress
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan pada server, gagal mengecek status CV" });
    }
}

exports.getLastCV = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users_cvs WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT 1',
            [req.user.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "CV belum ada yang diupload" });
        }
        res.json({ cv: result.rows[0] })
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan pada server, gagal mengambil CV terakhir" });
    }
}