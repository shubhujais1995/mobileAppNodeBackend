const express = require("express");

const router = express.Router();


const { sendOTP, verifyOtp, register } = require('../controller/userController');

router.post('/send-otp', sendOTP);

router.post('/register', register)

router.post('/verify-otp', verifyOtp)

// router.post('/login', loginUser)

// router.get('/current', validateToken,  getCurrentUser)

module.exports = router;
