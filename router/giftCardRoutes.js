const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { createGiftCard, updateGiftCard, fetchGiftCardList, redeemGiftCard, getGiftCardById, addMealToCard, transferMealToWallet } = require('../controller/giftCardController');

// router.post('/send-otp', sendOTP);

router.get('/createGiftCard', validateToken, createGiftCard);
router.post('/updateGiftCard/:id', validateToken, updateGiftCard);
router.get('/fetchGiftCardList', validateToken,  fetchGiftCardList);
router.post('/redeemGiftCard', validateToken,  redeemGiftCard);
router.get('/getGiftCardById/:id', validateToken , getGiftCardById);
router.post('/addMealToGiftCard', validateToken, addMealToCard);
router.post('/transferMealToWallet', validateToken, transferMealToWallet);
// router.post('/add-qr',  addQR);
// router.post('/update-qr/:id', updateQR);
// router.get('/qr-list',  fetchQRList)


module.exports = router;
