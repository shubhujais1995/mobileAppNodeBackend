
const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { addTestimonial, fetchTestimonialList } = require('../controller/testimonialController');

router.post('/addTestimonial', validateToken, addTestimonial);
router.get('/fetchTestimonialList', validateToken, fetchTestimonialList);

module.exports = router;

