const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { sendOTP, verifyOtp, profileUpdate, getCurrentUser, addNewUser } = require('../controller/userController');

router.post('/send-otp', sendOTP);

router.post('/profileUpdate/:id', validateToken, profileUpdate);

router.post('/verify-otp', verifyOtp);

router.get('/current', validateToken,  getCurrentUser);

router.post('/addNewUser', validateToken, addNewUser);

// router.post('/refresh-token', refreshTokenFun);

module.exports = router;
