const express = require('express');
const authenticateToken = require('../middleware/auth');
const { User } = require('../models'); 
const uc = require('../controllers/dashboard_controller');
const multer = require('multer');
const router = express.Router();

const upload = multer()

router.post('/search', [authenticateToken, upload.fields([])], uc.search);
// router.post('/',authenticateToken, uc.getRecords);





module.exports = router;
