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
                role: user.role
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getMe = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, telepon, role FROM users WHERE id = $1', [req.user.id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User Tidak Ditemukan' })
        }
        res.json({ user: result.rows[0] })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

module.exports = { register, login, getMe }