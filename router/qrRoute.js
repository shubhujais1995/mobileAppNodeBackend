const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { addQR, updateQR, fetchQRList } = require('../controller/qrCardController');

// router.post('/send-otp', sendOTP);

router.post('/add-qr', validateToken, addQR);
router.post('/update-qr/:id', validateToken, updateQR);
router.get('/qr-list', validateToken,  fetchQRList)

// router.post('/add-qr',  addQR);
// router.post('/update-qr/:id', updateQR);
// router.get('/qr-list',  fetchQRList)


module.exports = router;
