const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { AddOrderGetPaymentId } = require('../controller/orderController');

router.post('/getPaymentId', validateToken, AddOrderGetPaymentId);

module.exports = router;
