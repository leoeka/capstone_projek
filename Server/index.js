const express = require('express')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./src/routes/auth')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})