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
        entity: {
          id,
          amount,
          currency,
          status,
          order_id,
          method,
          amount_refunded,
          refund_status,
          card_id,
          bank,
          wallet,
          vpa,
          email,
          contact,
          error_code,
          error_reason,
          acquirer_data: { bank_transaction_id },
          created_at
        }
      }
    }
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
// Use the extracted values
console.log("ID:", id);
console.log("Amount:", amount);
console.log("Currency:", currency);
console.log("Status:", status);
console.log("Order ID:", order_id);
console.log("Method:", method);
console.log("Amount Refunded:", amount_refunded);
console.log("Refund Status:", refund_status);
console.log("Card ID:", card_id);
console.log("Bank:", bank);
console.log("Wallet:", wallet);
console.log("VPA:", vpa);
console.log("Email:", email);
console.log("Contact:", contact);
console.log("Error Code:", error_code);
console.log("Error Reason:", error_reason);
console.log("Bank Transaction ID:", bank_transaction_id);
console.log("Created At:", created_at);

  const mealCreated = await Webhook.create({
    account_id,
    id,
    amount,
    currency,
    status,
    order_id,
    method,
    amount_refunded,
    refund_status,
    card_id,
    bank,
    wallet,
    vpa,
    email,
    contact,
    error_code,
    error_reason,
    bank_transaction_id,
    created_at
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
