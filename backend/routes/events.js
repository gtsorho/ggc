const express = require("express");
let multer = require('multer');
const cc = require('../controllers/event_controller');
const authenticateToken = require('../middleware/auth');

require('dotenv').config()

const router = express.Router()
let upload = multer();

  router.get('/', cc.getEvents);
  router.post('/',[authenticateToken, upload.fields([])], cc.create);
  router.post('/update/:id',[authenticateToken, upload.fields([])], cc.update);
  router.get('/delete/:id',authenticateToken, cc.delete);
  router.post('/search',[authenticateToken,upload.fields([])], cc.search)
  router.get('/upcoming/:noDays', cc.getUpcoming)





module.exports = router
