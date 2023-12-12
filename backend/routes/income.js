const express = require("express");
let multer = require('multer');
const cc = require('../controllers/income_controller');
const authenticateToken = require('../middleware/auth');

require('dotenv').config()

const router = express.Router()
let upload = multer();

  router.get('/',authenticateToken,  cc.getIncome);
  router.post('/', [authenticateToken, upload.fields([])], cc.create);
  router.post('/update/:id', [authenticateToken, upload.fields([])], cc.update);
  router.get('/delete/:id', authenticateToken, cc.delete);
  router.get('/merge', authenticateToken, cc.merge);
  router.post('/search',[authenticateToken, upload.fields([])], cc.search)

module.exports = router
