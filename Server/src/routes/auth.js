const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { register, login, getMe, updateProfile, uploadCV } = require('../controllers/authController')
const verifyToken = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.get('/me', verifyToken, getMe)
router.put('/profile', verifyToken, upload.single('photo'), updateProfile)
router.post('/upload-cv', verifyToken, upload.single('cv'), uploadCV)

module.exports = router
