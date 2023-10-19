
const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { addMeal } = require('../controller/mealController');

// router.post('/send-otp', sendOTP);

router.post('/add-meal', validateToken, addMeal);
// router.post('/update-qr/:id', validateToken, updateMeal);

// router.post('/verify-otp', verifyOtp)

// // router.post('/login', loginUser)

// router.get('/qr-list', validateToken,  fetchQRList)

module.exports = router;

