const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { sendOTP, verifyOtp, register, getCurrentUser } = require('../controller/userController');

router.post('/send-otp', sendOTP);

router.post('/register/:id', register)

router.post('/verify-otp', verifyOtp)

// router.post('/login', loginUser)

router.get('/current/:id', validateToken,  getCurrentUser)

module.exports = router;
