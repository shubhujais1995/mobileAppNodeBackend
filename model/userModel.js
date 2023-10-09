// models/user.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  phoneNumber: { type: String, unique: true , required: true},
  otp: {type: String},
  name: {type: String, required: false},
  email: {type: String},
  address: {type: String}
  // Add other fields as needed
},{
  timestamps: true,
});

// const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);
