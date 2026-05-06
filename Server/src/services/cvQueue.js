const Queue = require('bull');
const fs = require('fs');
const PDFParser = require('pdf2json');
const mammoth = require('mammoth');
const axios = require('axios');

const cvAnalysisQueue = new Queue('cv-analysis', 'redis://127.0.0.1:6379');

const extractText = async (filePath, mimetype) => {
    if (mimetype === 'application/pdf') {
        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser()
            pdfParser.on("pdfParser_dataReady", (data) => {
                const text = data.Pages
                    .map(page => page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(' '))
                    .join('\n');
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
    return {
        skills: ['JavaScript', 'Node.js'],
        kategori: 'Software Engineer',
        rekomendasi: [
            { role: 'Frontend Developer', match: 85 },
            { role: 'Backend Developer', match: 75 },
        ],
        gap_skills: ['Docker', 'TypeScript']
    }
    // const aiEndpoint = 'https://api.openai.com/analyze-cv'; // Replace with actual AI endpoint
    // const response = await axios.post(aiEndpoint, {
    //     model: 'gpt-3.5-turbo', // Sesuaikan dengan model yang tersedia
    //     messages: [
    //         { role: "system", content: "Anda adalah HR assistant. Analisis CV berikut dan berikan ringkasan skill, pengalaman, dan nilai kandidat." },
    //         { role: "user", content: text }
    //     ]
    // }, {
    //     headers: {
    //         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //         'Content-Type': 'application/json'
    //     }
    // });

    // return response.data.choices[0].message.content;
};

cvAnalysisQueue.process(async (job) => {
    const { filePath, mimetype, userId } = job.data;

    try {
        job.progress(30);
        const extractedText = await extractText(filePath, mimetype);

        job.progress(60);
        const aiResult = await callAI(extractedText);

        job.progress(100);
        return aiResult;
    } catch (error) {
        console.error('Error processing CV:', error);
        throw error;
    }
});

module.exports = cvAnalysisQueue;