const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const QRCardModel = require("../model/qaCardModel");
const OrdersModel = require("../model/orderModel");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const AccessToken = require("twilio/lib/jwt/AccessToken");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  const user = await User.findOne({ phoneNumber });
  console.log(phoneNumber, user);
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

    console.log(user, "otp sent and user updated!");
  } else {
    const user = await User.create({
      phoneNumber,
      user_role: "normal",
      otp,
      timestamp: Date.now(),
    });

    console.log(user, "user created and otp sent");
  }

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
      if (user.name || user.email || user.address || user.user_role) {
        const accessToken = jwt.sign(
          {
            user: {
              name: user.name,
              email: user.email,
              user_role: user.user_role,
              id: String(user._id),
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
          {
            user_id: String(user._id),
          },
          process.env.REFRESH_TOKEN_SECRET
        );

        // Store refresh token in the database (you need to implement this)
        await storeRefreshToken(user._id, refreshToken);

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        const response = createResponse(
          "success",
          "User is already registered, Otp verified succesfully!",
          {
            token: accessToken,
            refreshToken: refreshToken,
            user,
          }
        );
        res.status(200).json(response);
      } else {
        const accessToken = jwt.sign(
          {
            user: {
              user_role: "normal",
              id: String(user._id),
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        const response = createResponse(
          "success",
          "Otp verified succesfully, Please update the user profile!",
          {
            token: AccessToken,
            user,
          }
        );
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        res.status(200).json(response);
      }
    } else {
      const response = createResponse("error", "Invalid OTP", null);
      return res.status(200).json(response);
    }
  }
};

// Function to store the refresh token in the database
const storeRefreshToken = async (userId, refreshToken) => {
  // Implement logic to store the refresh token in your database
  // Store the refresh token in the array
  console.log(userId, refreshToken);
  refreshTokens[userId] = refreshToken;
};

const profileUpdate = asyncHandler(async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id });

    if (!user) {
      const response = createResponse("error", "User Not Found!", null);
      res.status(200).json(response);
    } else {
      const {
        name,
        email,
        address,
        wallet = 0,
        user_role = "normal",
      } = req.body;

      console.log(email, name, address, user_role);

      if (name && email && address) {
        const user_id = String(user._id);
        const accessToken = jwt.sign(
          {
            user: {
              name: user.name,
              email: user.email,
              user_role: "normal",
              id: user_id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        Generate refresh token
        const refreshToken = jwt.sign(
          {
            user_id: user_id,
          },
          process.env.REFRESH_TOKEN_SECRET
        );
        console.log("usser id - ", user_id);
        Store refresh token in the database (you need to implement this)
        await storeRefreshToken(user_id, refreshToken);

        await User.findByIdAndUpdate(
          { _id },
          { name, email, address, wallet, user_role },
          { new: true }
        );

        res.setHeader("Authorization", `Bearer ${accessToken}`);

        const response = createResponse(
          "success",
          "User created/updated successfully",
          {
            token: accessToken,
            refreshToken: refreshToken,
            user,
          }
        );

        res.status(200).json(response);
      } else {
        const response = createResponse(
          "error",
          "All fields are required",
          null
        );
        res.status(400).json(response);
      }
    }
  } catch (error) {
    const response = createResponse(
      "error",
      "An error occurred while processing the request",
      {
        error,
      }
    );
    res.status(500).json(response);
  }
});

const addNewUser = asyncHandler(async (req, res) => {
  try {
    const currentUserRole = req.user.user_role;

    if (currentUserRole == "super_admin") {
      const { name, email, address, wallet = 0, phoneNumber } = req.body;

      console.log(email, name, address, phoneNumber);

      if (name && email && address && phoneNumber) {
        const user_role = "admin";

        const user = await User.create({
          name,
          email,
          address,
          wallet,
          user_role,
          phoneNumber,
          timestamp: Date.now(),
        });

        const response = createResponse(
          "success",
          "New user created successfully!s",
          { user }
        );

        res.status(201).json(response);
      } else {
        const response = createResponse(
          "error",
          "All fields are required",
          null
        );
        res.status(400).json(response);
      }
    } else {
      const response = createResponse(
        "error",
        "You are not autherized to add user!",
        null
      );
      res.status(401).json(response);
    }
  } catch (error) {
    const response = createResponse(
      "error",
      "An error occurred while processing the request",
      { error }
    );
    res.status(500).json(response);
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userRole = req.user.user_role;
  const _id = req.user.id;
  const userDetails = await User.find({ _id });
  const user = userDetails[0];
  console.log(user);
  // console.log(userRole, _id, user);
  // console.log('wait');
  // const user = allUsers.find((c) => c.id === userId);

  const allQRList = await QRCardModel.find();
  const allorders = await OrdersModel.find();
  // console.log(' all ' ,allQRList, allorders);
  const totalTransactionList = allorders.length;
  const totalActiveQr = allQRList.filter((qr) => qr.qr_status == true).length;
  const totalDeactiveQr = allQRList.filter(
    (qr) => qr.qr_status == false
  ).length;

  // console.log( ' total -', totalActiveQr, totalDeactiveQr, totalTransactionList);

  if (!user) {
    // res.status(404);
    // throw new Error("User not found");
    const response = createResponse("error", "User Not Found!", null);
    res.status(200).json(response);
  }
  let userDetail;
  if (userRole == "super_admin") {
    userDetail = {
      name: user.name,
      phone: user.phoneNumber,
      address: user.address,
      email: user.email,
      role: user.user_role,
      wallet: user.wallet,
      noOfActiveQr: totalActiveQr,
      noOfDeactiveQr: totalDeactiveQr,
      noOfTransaction: totalTransactionList,
    };
  } else {
    userDetail = {
      name: user.name,
      phone: user.phoneNumber,
      address: user.address,
      email: user.email,
      role: user.user_role,
      wallet: user.wallet,
    };
  }
  // console.log(userDetail);
  const response = createResponse("success", "Current User Info", {
    user: userDetail,
  });

  res.status(200).json(response);
});

// Dummy data to simulate a database
const refreshTokens = {};
// Route to refresh the access token using a refresh token
const refreshTokenFun = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  // const userId = req.user;
  // console.log(userId)
  if (!refreshToken) {
    // return res.status(403).json({ message: "Invalid refresh token" });
    const response = createResponse(
      "error",
      "Please provide valid refresh token 1!",
      null
    );
    res.status(403).json(response);
  } else {
    // Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          // return res.status(403).json({ message: "Invalid refresh token" });
          const response = createResponse(
            "error",
            "Please provide valid refresh token 2!",
            null
          );
          res.status(403).json(response);
        }
        // console.log("user - ",req.user);
        const userId = decoded.user_id;
        console.log(
          "user - id decode ",
          decoded.user_id,
          "refresh  ",
          refreshTokens
        );

        if (!refreshTokens[userId] || refreshTokens[userId] !== refreshToken) {
          const response = createResponse(
            "error",
            "Please provide valid refresh token 3!",
            null
          );
          res.status(403).json(response);
        } else {
          const accessToken = jwt.sign(
            { userId },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1d",
            }
          );
          console.log("new access token ", accessToken);
          const response = createResponse("success", "Access Token", {
            accessToken,
          });

          res.status(200).json(response);
        }
      }
    );
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

module.exports = {
  sendOTP,
  profileUpdate,
  verifyOtp,
  getCurrentUser,
  addNewUser,
  refreshTokenFun,
};

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
