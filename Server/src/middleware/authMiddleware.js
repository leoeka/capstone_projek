const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.header('authorization')?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({ message: 'Akses ditolak. Token tidak valid.' })
    }
}

module.exports = { verifyToken }