const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { name, email, telepon, role, password } = req.body

    try {
        const cek = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (cek.rows.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar' })
        }

        const hash = await bcrypt.hash(password, 10)

        const result = await pool.query(
            'INSERT INTO users (name, email, telepon, role, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, telepon, role',
            [name, email, telepon, role, hash]
        )

        res.status(201).json({ message: 'Registrasi berhasil', user: result.rows[0] })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Email tidak ditemukan' })
        }

        const user = result.rows[0]

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            return res.status(400).json({ message: 'Password salah' })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                telepon: user.telepon,
                role: user.role,
                photo: user.photo
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getMe = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, telepon, role, photo FROM users WHERE id = $1', [req.user.id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User Tidak Ditemukan' })
        }
        res.json({ user: result.rows[0] })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const updateProfile = async (req, res) => {
    const { name, email, telepon, role } = req.body
    let photoPath = null

    if (req.file) {
        photoPath = `/uploads/profiles/${req.file.filename}`
    }

    try {
        const result = await pool.query(
            'UPDATE users SET name=$1, email=$2, telepon=$3, role=$4, photo=COALESCE($5, photo) WHERE id=$6 RETURNING id, name, email, telepon, role, photo',
            [name, email, telepon, role, photoPath, req.user.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' })
        }
        res.json({ message: 'Profil berhasil diupdate', user: result.rows[0] })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const uploadCV = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'File CV tidak ditemukan' })

    const cvPath = `/uploads/cvs/${req.file.filename}`

    try {
        const result = await pool.query(
            'INSERT into users_cvs (user_id, file_path, status_analisis) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, cvPath, 'pending']
        )
        res.status(201).json({ message: 'CV berhasil diupload dan sedang dianalisis', cv: result.rows[0] })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}



module.exports = { register, login, getMe, updateProfile, uploadCV }