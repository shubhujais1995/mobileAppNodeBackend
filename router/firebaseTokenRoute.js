const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { addFbToken } = require('../controller/firebaseTokenController');

router.post('/add-firebase-token', validateToken, addFbToken);

module.exports = router;
