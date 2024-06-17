const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { addFbToken } = require('../controller/firebaseTokenController');

router.post('/addFirebaseToken', validateToken, addFbToken);

module.exports = router;
