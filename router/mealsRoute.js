
const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { addMeal } = require('../controller/mealController');

router.post('/add-meal', validateToken, addMeal);

// router.post('/add-meal', addMeal);
// router.post('/get-mealDetail', getMeals);

module.exports = router;

