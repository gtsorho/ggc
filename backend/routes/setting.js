const express = require('express');
const authenticateToken = require('../middleware/auth');
const { User } = require('../models'); 
const uc = require('../controllers/settings_controller');
const multer = require('multer');
const router = express.Router();

const upload = multer()

router.get('/', authenticateToken, uc.getSettings);
router.post('/update/:id', [upload.fields([]),  authenticateToken], uc.update);

module.exports = router;
