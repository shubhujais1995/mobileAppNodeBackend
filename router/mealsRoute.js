
const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { addMealToCard } = require('../controller/mealController');

router.post('/add-meal-to-card', validateToken, addMealToCard);

// router.post('/add-meal', addMeal);
// router.post('/get-mealDetail', getMeals);

module.exports = router;

