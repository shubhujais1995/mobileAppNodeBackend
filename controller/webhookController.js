const asyncHandler = require("express-async-handler");
const Webhook = require("../model/webhookModel");
require("dotenv").config();

const webhookCall = asyncHandler(async (req, res) => {
  // const meal = 105; //req.body.meals;
  // const userId = req.user.id;

  const {
    account_id,
    payload: {
      payment: {
        entity: { amount, id, email, method, bank, order_id },
      },
    },
  } = req.body;
  
  console.log("api called! ", req.body); 
  
  if (
    !amount ||
    !id ||
    !email ||
    !method ||
    !bank ||
    !order_id ||
    !account_id
  ) {
    amount = 5001;
    id = "abc123";
    email = "shubham@gmail.com";
    method = "card";
    bank = "icici";
    order_id = "123";
    account_id = "abc";
  }

 // Use the extracted values
console.log("Account ID:", account_id);
console.log("Amount:", amount);
console.log("ID:", id);
console.log("Email:", email);
console.log("Method:", method);
console.log("Bank:", bank);
console.log("Order ID:", order_id);

  const mealCreated = await Webhook.create({
    bank,
    order_id,
    id,
    amount,
    email,
    method,
    account_id,
  });

  console.log("Meal Created ", mealCreated);

  const response = createResponse(
    "success",
    "Webhook Api called!",
    mealCreated
  );
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
