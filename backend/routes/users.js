const express = require('express');
const authenticateToken = require('../middleware/auth');
const { User } = require('../models'); 
const uc = require('../controllers/user_controller');
const multer = require('multer');
const router = express.Router();

const upload = multer()

router.get('/auth', authenticateToken, uc.findUser);
router.get('/', authenticateToken, uc.getUsers);
router.post('/',  upload.fields([]), uc.create);
router.get('/update/:id', [upload.fields([]),  authenticateToken], uc.update);
router.get('/delete/:id', authenticateToken, uc.delete);
router.post('/login', upload.fields([]), uc.login); 





module.exports = router;
