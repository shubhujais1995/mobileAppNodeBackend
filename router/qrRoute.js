const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { addQR, updateQR, fetchQRList } = require('../controller/qrCardController');

// router.post('/send-otp', sendOTP);

router.post('/add-qr', validateToken, addQR);
router.post('/update-qr/:id', validateToken, updateQR);

// router.post('/verify-otp', verifyOtp)

// // router.post('/login', loginUser)

router.get('/qr-list', validateToken,  fetchQRList)

module.exports = router;
