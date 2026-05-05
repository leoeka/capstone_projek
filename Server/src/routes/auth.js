const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { register, login, getMe, updateProfile } = require('../controllers/authController')
const { uploadCV, checkCVStatus } = require('../controllers/cvController')
const verifyToken = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.get('/me', verifyToken, getMe)
router.put('/profile', verifyToken, upload.single('photo'), updateProfile)
router.post('/upload-cv', verifyToken, upload.single('cv'), uploadCV)
router.get('/check-cv-status/:jobId', verifyToken, checkCVStatus)

module.exports = router
