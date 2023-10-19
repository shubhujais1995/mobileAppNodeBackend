const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Route for sending OTP
// router.post('/send-otp',

let otpVal = "";
const sendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  //   Check if the phone number exists in the database
  const user = await User.findOne({ phoneNumber });

  if (user) {
    // User exists, send login OTP
    console.log("req body - user", req.body, user);
    const otp = generateOTP();
    otpVal = otp;
    sendOTPToUser(phoneNumber, otp);
    return res.send({ message: "User already registered", userDetail: user });
  } else {
    console.log("else otp");
    const otp = generateOTP();
    sendOTPToUser(phoneNumber, otp);
    otpVal = otp;
    const user = await User.create({
      phoneNumber,
    });

    console.log(user, "user created");
    return res.json({ message: "Otp sent Successfully!" });
  }
});

const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (otp !== otpVal) {
    return res.status(401).json({ message: "Invalid OTP" });
  } else {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      console.log(user);
      if (user.name || user.email || user.address) {
        const accessToken = jwt.sign(
          {
            user: {
              name: user.name,
              email: user.email,
              id: String(user._id)
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "2h",
          }
        );

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        const response = createResponse("success", {
          message: "User is already registered, Otp verified succesfully!",
          user
        });
        res.status(200).json(response);
        // return res
        //   .status(200)
        //   .json({
        //     message: "User is already registered, Otp verified succesfully",
        //     user,
        //     accessToken,
        //   });
      } else {
        return res
          .status(200)
          .json({
            message: "Otp verified succesfully, Please register the User",
            user,
          });
      }
    }
  }
};

// Route for user registration
// router.post('/register',
const register = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const allUsers = await User.find();
    const user = allUsers.find((c) => c.id === userId);
    console.log(userId, allUsers);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const { phoneNumber, name, email, address } = req.body;
    const accessToken = jwt.sign(
      {
        user: {
          name: name,
          email: email,
          id: userId,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );
    await User.findByIdAndUpdate(
      { _id: userId },
      { $set: req.body },
      { new: true }
    );

    res.setHeader("Authorization", `Bearer ${accessToken}`);
    const response = createResponse("success", {
      message: "User created/updated successfully",
    });

    res.status(200).json(response);
  } catch (error) {
    const response = createResponse("error", {
      message: "An error occurred while processing the request",
    });
    res.status(500).json(response);
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const allUsers = await User.find();
  const user = allUsers.find((c) => c.id === userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const obj = {
    name: user.name,
    phone: user.phone,
    address: user.address,
    email: user.email,
  };

  const response = createResponse("success", {
    message: "Current User Info",
    data: obj,
  });

  res.status(200).json(response);
});
// Function to create a standardized response format
const createResponse = (status, data) => {
  return {
    status,
    data,
  };
};

// Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via Twilio SMS
function sendOTPToUser(phoneNumber, otp) {
  console.log(phoneNumber, otp, " in send otp user function!");
  twilio.messages.create(
    {
      body: `Your OTP is Shubham: ${otp}`,
      from: "+12405650825",
      to: `${phoneNumber}`,
    },
    function (err, data) {
      if (err) {
        console.log("message error");
        console.log("err", err);
        console.log("data", data);
      }
    }
  ); //en d of sendMessage;
}

module.exports = { sendOTP, register, verifyOtp, getCurrentUser };

// {
//   "status": true,
//   "message": "sucessfully fetched",
//   "error": 0,
//   "data": {
//     "name": "Amit",
//     "mobile": "9910508758",
//     "email": "",
//     "address": "",
//     "meal_available": 0,
//     "meal_value": "70",
//     "user_role":"",
//     "active_cards":null,
//     "deactive_cards":null,
//     "total_transactions": null,

//     "recent_qr_cards": [
//       {
//         "qr_id":"13",
//         "qr_display_name":"My QR Cards-1",
//         "qr_code": "1kjhbjgvg",
//         "status": true,
//         "qr_available_meals": 0,
//         "qr_app":""
//       },
//       {
//          "qr_id":"234",
//         "qr_display_name":"My QR Cards-3",
//         "qr_code": "76vt544",
//         "status": true,
//         "qr_available_meals": 0,
//         "qr_app":""
//       },
//       {
//         "qr_id":"343",
//         "qr_display_name":"My QR Cards-3",
//         "qr_code": "fvgr547h",
//         "status": true,
//         "qr_available_meals": 0,
//         "qr_app":""
//       }
//     ]
//   }

// }

// add QR, update QR, get QL list,
//  Wallet Recharge -> update QR  ,
