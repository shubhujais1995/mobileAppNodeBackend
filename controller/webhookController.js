const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Webhook = require("../model/webhookModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const webhookCall = asyncHandler(async (req, res) => {
  console.log("res came!");
  console.log(req.body);
  const meals = 1;
  const mealCreated = await webhookSchema.create({
    meals
  });
  console.log(mealCreated);
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