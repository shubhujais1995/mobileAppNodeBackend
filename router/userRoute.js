const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { sendOTP, verifyOtp, profileUpdate, getCurrentUser, addNewUser, refreshTokenFun } = require('../controller/userController');

router.post('/sendOtp', sendOTP);

router.post('/profileUpdate/:id', validateToken, profileUpdate);

router.post('/verifyOtp', verifyOtp);

router.get('/current', validateToken,  getCurrentUser);

router.post('/addNewUser', validateToken, addNewUser);

router.post('/refreshToken', refreshTokenFun);

module.exports = router;
