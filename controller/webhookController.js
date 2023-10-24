
const asyncHandler = require("express-async-handler");
const Webhook = require("../model/webhookModel");
require("dotenv").config();

const webhookCall = asyncHandler(async (req, res) => {
  const meal = req.body.meals;
  const userId = req.user.id; 

  console.log("res came!");
  console.log(userId, meal.meals);

  const mealCreated = await Webhook.create({
    meals: meal,
    user_id: userId
  });

  
  console.log("Meal Created " , mealCreated);

  const response = createResponse("success", "Webhook Api called!", mealCreated);
  res.status(200).json(response);
});

// Function to create a standardized response format
const createResponse = (status, message, data) => {
    return {
      status,
      message,
      data,
    };
  };

module.exports = { webhookCall };