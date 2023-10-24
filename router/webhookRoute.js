const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { webhookCall } = require('../controller/webhookController');

router.post('/webhook', validateToken, webhookCall);

module.exports = router;
