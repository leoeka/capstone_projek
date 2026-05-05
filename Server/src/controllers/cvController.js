const upload = require('../middleware/upload');
const cvAnalysisQueue = require('../services/cvQueue');

exports.uploadCV = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "File CV tidak ditemukan" });
    }

    try {
        const job = await cvAnalysisQueue.add({
            filePath: req.file.path,
            mimetype: req.file.mimetype,
            userId: req.user.id
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
};