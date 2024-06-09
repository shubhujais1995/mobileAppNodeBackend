const asyncHandler = require("express-async-handler");
const FBTOKEN = require("../model/firebaseTokenModel");

const addFbToken = asyncHandler(async (req, res) => {

  const { firebaseToken } = req.body;
  console.log(firebaseToken);

  if (!firebaseToken) {
    const response = createResponse("error", "All fields are mandatory", null);
    res.status(200).json(response);
  }

    const ft = await FBTOKEN.create({ 
      firebaseToken: firebaseToken,
      user_id: req.user.id,
    });
    console.log(ft);
    const response = createResponse("success", "Token added Successfully!", null);

    res.status(201).json(response);

});
const createResponse = (status, message, data) => {
  return {
    status,
    message,
    data,
  };
};

module.exports = { addFbToken };
