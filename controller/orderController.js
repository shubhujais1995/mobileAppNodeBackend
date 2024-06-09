const asyncHandler = require("express-async-handler");
const Order = require("../model/orderModel");
const axios = require("axios");

const AddOrderGetPaymentId = asyncHandler(async (req, res) => {
  try {
    const { amount, currency} = req.body;

    if (!amount || !currency) {
      res.status(400);
      throw new Error("All fields are mandatory in AddOrderGetPaymentId API");
    }

    const url = "https://api.razorpay.com/v1/orders";
    const AuthorizationToken =
      "Basic cnpwX3Rlc3RfRFpWTzBIWjR3MVdZSGk6M1pJSmlJNFM1cFoyOHQyY3ZLblR0S3hK";

    const apiResponse = await axios.post(url, {amount, currency}, {
      headers: {
        Authorization: `${AuthorizationToken}`,
        "Content-Type": "application/json",
      },
    });
    const responseData = apiResponse. data;

    console.log(
      "responseData response from axios success -" , responseData
    );

    const obj = {
      id: responseData.id,
      orderId: responseData.id,
      status: responseData.status,
      currency: responseData.currency,
      method: "card",
      amount: responseData.amount,
      user_id: req.user.id
    };

    const orderCreated = await Order.create(obj);

    console.log("response from axios and created order", obj, orderCreated);

    const response = createResponse(
      "success",
      "Order created succesfully!",
      orderCreated 
    );
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error from axios:", error);
    // res.status(500).json({ success: false, error: "Internal Server Error" });
    const response = createResponse("error", 
      "Order creation failed!",
      null,
    );
    res.status(200).json(response);
  }
});

const getTransactionByOrderId = asyncHandler(async (req, res) => {
  
  const orderId = req.params.id;
  const orderDetail = await Order.find({ orderId });
  console.log(orderDetail);
  if(!orderDetail.length) {
    const response = createResponse(
      "error",
      "You are not authorized to fetch other's transaction, Please provide valid QR Id!",
      null
    );
    res.status(401).json(response);
  } else {
    
    const transactionListByOrderId = orderDetail.filter((order) => order.status !== "created");
    const response = createResponse(
      "success",
      "Transactions fetched succesfully!",
      transactionListByOrderId
    );
    
    res.status(200).json(response);
  }

}); 

const getAllTransactions = asyncHandler(async (req, res) => {

  const user_id = req.user.id;
  const orders = await Order.find({user_id});

  if(!orders) {
    const response = createResponse(
      "error",
      "You are not authorized to fetch other's transaction!",
      null
    );
    res.status(401).json(response);
  } else {
    
    const transactionList = orders.filter((order) => order.status !== "created");
    const response = createResponse(
      "success",
      "Transactions fetched succesfully!",
      transactionList
    );
    
    res.status(200).json(response);
  }

});

// Function to create a standardized response format
const createResponse = (status, message, data) => {
  return {
    status,
    message,
    data,
  };
};

module.exports = { AddOrderGetPaymentId, getAllTransactions, getTransactionByOrderId };
