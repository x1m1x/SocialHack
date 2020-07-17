const { Router } = require('express')
const controllers = require('../controllers/maps_controllers')
const multer = require('multer')

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    dest: "./uploads"
})

const router = Router()


router.get('', controllers.main_page)

router.post('/report', upload.single("reportImage"), controllers.add_report)

router.get('/top', controllers.popular)

router.get('/place', controllers.findPlaceID)
router.get('/is_place_adaptive', controllers.isPlaceAdaptive)

router.post('/set_place_properties', controllers.setPlaceProperties)

module.exports = router