const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'photo') {
            cb(null, 'uploads/profiles/')
        } else {
            cb(null, 'uploads/cvs/')
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'photo') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Format ditolak! Hanya boleh upload gambar'), false)
        }
    } else if (file.fieldname === 'cv') {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true)
        } else {
            cb(new Error('Format ditolak! Hanya boleh upload PDF atau DOCX'), false)
        }
    }

}

const upload = multer({ storage, fileFilter })
module.exports = upload