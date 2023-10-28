const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { AddOrderGetPaymentId, getAllTransactions } = require('../controller/orderController');

router.post('/getPaymentId', validateToken, AddOrderGetPaymentId);
router.get('/getAllTransactions', validateToken, getAllTransactions);
module.exports = router;
