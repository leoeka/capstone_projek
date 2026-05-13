const Queue = require('bull');
const PDFParser = require('pdf2json');
const mammoth = require('mammoth');
const axios = require('axios');
const pool = require('../config/db');

const cvAnalysisQueue = new Queue('cv-analysis', 'redis://127.0.0.1:6379');

const extractText = async (filePath, mimetype) => {
    if (mimetype === 'application/pdf') {
        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser()
            pdfParser.on("pdfParser_dataReady", (data) => {
                const text = data.Pages
                    .map(page => page.Texts.map(t => {
                        try {
                            return decodeURIComponent(t.R[0].T)
                        } catch {
                            return t.R[0].T
                        }
                    }).join(' '))
                    .join('\n')
                resolve(text);
            })
            pdfParser.on('pdfParser_dataError', reject)
            pdfParser.loadPDF(filePath);
        })
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    }
    throw new Error('Format file tidak didukung untuk ekstraksi teks');
};

const callAI = async (text) => {
    const teksCV = Array.isArray(text) ? text.join(' ') : text
    const response = await axios.post('http://127.0.0.1:8000/api/v1/predict', {
        teks_cv: teksCV
    }, {
        headers: { 'Content-Type': 'application/json' }
    })
    return response.data
}


cvAnalysisQueue.process(async (job) => {
    const { filePath, mimetype, userId, cvId } = job.data;

    try {
        job.progress(30);
        const extractedText = await extractText(filePath, mimetype);

        job.progress(60);
        const aiResult = await callAI(extractedText);

        await pool.query(
            'UPDATE users_cvs SET extracted_text = $1, ai_result = $2, status_analisis = $3 WHERE id = $4',
            [extractedText, JSON.stringify(aiResult), 'completed', cvId]
        )

        job.progress(100);
        return aiResult;
    } catch (error) {
        if (cvId) {
            await pool.query(
                'UPDATE users_cvs SET status_analisis = $1 WHERE id = $2',
                ['failed', cvId]
            )
        }
        console.error('Error processing CV:', error);
        throw error;
    }
});

module.exports = cvAnalysisQueue;