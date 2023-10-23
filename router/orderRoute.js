const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { AddOrder } = require('../controller/orderController');

router.post('/getPaymentId', validateToken, AddOrder);

module.exports = router;
