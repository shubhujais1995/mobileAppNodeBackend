const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  const user = await User.findOne({ phoneNumber });

  const otp = generateOTP();
  sendOTPToUser(phoneNumber, otp);

  if (user) {
    const updatedData = {
      phoneNumber,
      otp,
      timestamp: Date.now(),
    };

    const user = await User.findOneAndUpdate({ phoneNumber }, updatedData, {
      new: true,
    });
    console.log(user, "user updated");
  } else {
    const user = await User.create({
      phoneNumber,
      otp,
      timestamp: Date.now(),
    });

    console.log(user, "user created");
  }

  // return res.json({ message: "Otp sent Successfully!" });

  const response = createResponse("success", "Otp sent succesfully!", null);
  res.status(200).json(response);

});

const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const user = await User.findOne({ phoneNumber });
  console.log(user, otp);
  if (user) {
    const isTimestampValid =
      Date.now() - new Date(user.updatedAt).getTime() <= 60000;

    if (otp == user.otp && isTimestampValid) {
      if (user.name || user.email || user.address) {
        // const accessToken = jwt.sign(
        //   {
        //     user: {
        //       name: user.name,
        //       email: user.email,
        //       user_role:"normal",
        //       id: String(user._id),
        //     },
        //   },
        //   process.env.ACCESS_TOKEN_SECRET,
        //   {
        //     expiresIn: "1d",
        //   }
        // );

        res.setHeader("Authorization", `Bearer ${req.token}`);
        const response = createResponse("success", "User is already registered, Otp verified succesfully!", {
          token: req.token,
          user,
        });
        res.status(200).json(response);
      } else {
        const accessToken = jwt.sign(
          {
            user: {
              user_role:"normal",
              id: String(user._id),
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        const response = createResponse("success", "Otp verified succesfully, Please register the User", {
          token: accessToken,
          user,
        });
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        res.status(200).json(response);
      }
    } else {
      const response = createResponse("success", "Invalid OTP", null);
      return res.status(401).json(response);
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
    
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const { name, email, address, wallet = 0 } = req.body;
    console.log(email, name, address);
    if (name && email && address ) {
      const accessToken = jwt.sign(
        {
          user: {
            name: user.name,
            email: user.email,
            user_role:"normal",
            id: String(user._id),
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.setHeader("Authorization", `Bearer ${accessToken}`);
      await User.findByIdAndUpdate(
        { _id: userId },
        { $set: req.body },
        { new: true }
      );

      res.setHeader("Authorization", `Bearer ${accessToken}`);
      const response = createResponse("success", "User created/updated successfully", {
        token: accessToken,
        user
      });

      res.status(200).json(response);
    } else {
      const response = createResponse("error", "All fields are required", null);
      res.status(400).json(response);
    }
  } catch (error) {
    const response = createResponse("error", "An error occurred while processing the request", {
      error,
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
    role: user.user_role,
    wallet: user.wallet
  };

  const response = createResponse("success",  "Current User Info", {
    obj
  });

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
