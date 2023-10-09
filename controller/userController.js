// routes/auth.js
const express = require('express');
const asyncHandler = require('express-async-handler');
// const router = express.Router();
const User = require('../model/userModel');
require('dotenv').config();
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// const authToken = "f611bd9776dd9164381fa30e10fe5e30"
// const accoundSID = "AC48cd1cfe0c7d2b3da8b787e3aafaba69"
// const client = require("twilio")(accoundSID, authToken);

const jwt = require("jsonwebtoken");

// Route for sending OTP
// router.post('/send-otp', 

const sendOTP = asyncHandler ( async (req, res) => {
  const { phoneNumber } = req.body;

//   Check if the phone number exists in the database
  const user = await User.findOne({ phoneNumber });
  
  if (user) {
    // User exists, send login OTP
    console.log('req body - user', req.body, user);
    const otp = generateOTP();
    sendOTPToUser(phoneNumber, otp);
    console.log('new otp', otp, ' old otp ', user.otp);
    const obj = { ...req.body, otp }  
    const user2 = await User.findByIdAndUpdate(
      { _id:  String(user._id) },
      { $set: obj },
      { new: true }
    );
    console.log('user2 otp', user2.otp)
    return res.send({message: 'User already registered', userDetail: user2 });
    // return res.json({ message: 'Login OTP sent successfully', user });
  } else {
    console.log('else otp')
    const otp = generateOTP();
    sendOTPToUser(phoneNumber, otp);
    const user = await User.create({
        phoneNumber,
        otp
    });

  console.log(user, 'user created');
    // User doesn't exist, ask for registration
    return res.json({ message: 'Otp sent Successfully!' });
  }
});

// Route for user registration
// router.post('/register', 
const register = asyncHandler( async (req, res) => {
  const { phoneNumber, email, address } = req.body;

  // Create a new user document with the provided details
  const newUser = await User.create({ phoneNumber, email, address });

  // Send OTP for registration
  const otp = generateOTP();
  sendOTPToUser(phoneNumber, otp);

  return res.json({ message: 'Registration OTP sent successfully', user: newUser });
});

// Route for verifying OTP and logging in
// router.post('/verify-otp',
const verifyOtp =  async (req, res) => {

  const { phoneNumber, otp } = req.body;
console.log('po', phoneNumber, otp);
  // Find the user by phone number
  const user = await User.findOne({ phoneNumber });
  console.log('user found', user);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if the provided OTP matches the stored OTP
  if (otp !== user.otp) {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  // Clear the OTP after successful verification
  user.otp = undefined;
  // await user.save();

  return res.json({ message: 'Login successful', user });
    
};

// Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via Twilio SMS
function sendOTPToUser(phoneNumber, otp) {
  console.log(phoneNumber, otp, ' in send otp user function!')
  twilio.messages.create({
    body: `Your OTP is Shubham: ${otp}`,
    from: '+12405650825',
    to: `${phoneNumber}`,
  }, function(err, data) {
        if (err) {
            console.log('message error')
            console.log('err', err);
            console.log('data', data);
        }
    });//en d of sendMessage;
}

module.exports = { sendOTP, register, verifyOtp };
