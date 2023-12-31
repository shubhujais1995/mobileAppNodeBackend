const asyncHandler = require("express-async-handler");
const Order = require("../model/orderModel");
const axios = require("axios");

const AddOrderGetPaymentId = asyncHandler(async (req, res) => {
  try {
    const { amount, currency, divide_to_all_card, qr_id } = req.body;

    if (!amount || !currency || !qr_id) {
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
    const responseData = apiResponse.data;

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
      user_id: req.user.id,
      divide_to_all_card: divide_to_all_card, 
      qr_id:qr_id
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

module.exports = { AddOrderGetPaymentId, getAllTransactions, getTransactionByOrderId };
