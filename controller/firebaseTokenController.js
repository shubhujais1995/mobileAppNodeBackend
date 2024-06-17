const asyncHandler = require("express-async-handler");
const FBTOKEN = require("../model/firebaseTokenModel");
const admin = require("firebase-admin");

const addFbToken = asyncHandler(async (req, res) => {
  const { firebaseToken } = req.body;
  console.log(firebaseToken);

  if (!firebaseToken) {
    const response = createResponse("error", "All fields are mandatory", null);
    res.status(200).json(response);
  }

  try {
    const oldToken = await FBTOKEN.findOne({ firebaseToken });

    if (!oldToken) {
      const ft = await FBTOKEN.create({
        firebaseToken: firebaseToken,
        user_id: req.user.id,
      });

      console.log(ft);
      const response = createResponse(
        "success",
        "Token added Successfully!",
        null
      );

      res.status(201).json(response);
    } else {
      console.log("token already present");
      const response = createResponse(
        "success",
        "Token added Successfully!",
        null
      );
      res.status(201).json(response);
    }
    sendPushNotification(
      req.user.id,
      "Test Notifiation to Amit",
      "From Node JS "
    );
  } catch (error) {
    const response = createResponse("error", "Error while setting token", null);
    res.status(201).json(response);
  }
});
const createResponse = (status, message, data) => {
  return {
    status,
    message,
    data,
  };
};

const sendPushNotification = async (userId, title, messageBody) => {
  try {
    const userTokens = await FBTOKEN.find({ user_id: userId });

    let userTokenList = userTokens.map(({ firebaseToken }) => firebaseToken);

    console.log("userTokenList :", userTokenList);
    const message = {
      notification: {
        title: title,
        body: messageBody,
      },
      tokens: userTokenList,
    };

    admin
      .messaging()
      .sendEachForMulticast(message)
      .then((response) => {
        console.log("Notification sent:", response);
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
module.exports = { addFbToken, sendPushNotification };
