const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Order = require("../model/orderModel");
const axios = require("axios");

const AddOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, currency, divideToAllCards, qr_id } = req.body;

    if (!amount || !currency) {
      res.status(400);
      throw new Error("All fields are mandatory");
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
    const responseData = apiResponse.data;

    // id: 'order_Mrlm3WcBPTxCRI',
    // entity: 'order',
    // amount: 500,
    // amount_paid: 0,
    // amount_due: 500,
    // currency: 'INR',
    // receipt: null,
    // offer_id: null,
    // status: 'created',
    // attempts: 0,
    // notes: [],
    // created_at: 1698090575
    console.log(req.user.id);
    const obj = {
      id: responseData.id,
      orderId: responseData.id,
      status: responseData.status,
      currency: responseData.currency,
      method: "card",
      amount: responseData.amount,
      user_id: req.user.id,
    };

    const orderCreated = await Order.create(obj);

    console.log("response from axios and created order", obj, orderCreated);

    // res.status(200).json({ success: true, obdaj });

    const response = createResponse(
      "success",
      "Order created succesfully!",
      orderCreated 
    );
    
    res.status(201).json(response);
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

// function makeRequest(url, method, data) {
//   const options = {
//     method: method,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   if (data) {
//     options.body = JSON.stringify(data);
//   }

//   return new Promise((resolve, reject) => {
//     const req = http.request(url, options, (res) => {
//       let responseData = "";

//       res.on("data", (chunk) => {
//         responseData += chunk;
//       });

//       res.on("end", () => {
//         resolve(JSON.parse(responseData));
//       });
//     });

//     req.on("error", (error) => {
//       reject(error);
//     });

//     if (data) {
//       req.write(JSON.stringify(data));
//     }

//     req.end();
//   });
// }

// async function fetchData() {
//   try {
//     // First API call
//     const data1 = await makeRequest("https://api.example.com/data1", "GET");

//     // Process data1 or make decisions based on it

//     // Second API call with data from the first call
//     const data2 = await makeRequest("https://api.example.com/data2", "POST", {
//       data: data1,
//     });

//     // Process data2 or make decisions based on it

//     // Third API call with data from the second call
//     const data3 = await makeRequest("https://api.example.com/data3", "PUT", {
//       data: data2,
//     });

//     // Continue processing or return the final result
//     return data3;
//   } catch (error) {
//     console.error("Error:", error.message);
//     throw error; // Propagate the error to the calling function or handle it accordingly
//   }
// }

// // Call the function and handle the result or error
// fetchData()
//   .then((result) => {
//     console.log("Final Result:", result);
//   })
//   .catch((error) => {
//     console.error("Failed to fetch data:", error.message);
//   });

// Function to create a standardized response format
const createResponse = (status, message, data) => {
  return {
    status,
    message,
    data,
  };
};

module.exports = { AddOrder };
