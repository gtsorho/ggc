const express = require("express");
let multer = require('multer');
const cc = require('../controllers/ledger_controller');
const authenticateToken = require('../middleware/auth');

require('dotenv').config()

const router = express.Router()
let upload = multer();

  router.get('/ledgerheads', authenticateToken, cc.getLedgerHead);
  router.get('/ledgers/:i', authenticateToken, cc.getLedger);

  router.post('/ledgerhead', [authenticateToken, upload.fields([])], cc.createLedger_head);
  router.post('/', [authenticateToken, upload.fields([])], cc.createLedger);

  router.get('/setactive/:index',authenticateToken, cc.setActiveHead);
  router.get('/active', cc.getActive);

  router.post('/update/:id', [authenticateToken, upload.fields([])], cc.update);
  router.get('/delete/:id', authenticateToken, cc.delete);

  router.post('/ledgerhead/update/:id', [authenticateToken, upload.fields([])], cc.updateLedgerHead);
  router.get('/ledgerhead/delete/:id', authenticateToken, cc.deleteLedgerHead);

  router.post('/search',[authenticateToken, upload.fields([])], cc.search)

module.exports = router
