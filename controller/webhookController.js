const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const webhookCall = asyncHandler(async (req, res) => {

  const response = createResponse("success", "Webhook Api called!", null);
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