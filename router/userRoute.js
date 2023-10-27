const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { sendOTP, verifyOtp, profileUpdate, getCurrentUser } = require('../controller/userController');

router.post('/send-otp', sendOTP);

router.post('/profileUpdate/:id', validateToken, profileUpdate)

router.post('/verify-otp', verifyOtp)

router.get('/current/:id', validateToken,  getCurrentUser)
// router.get('/current/:id',  getCurrentUser)

module.exports = router;
