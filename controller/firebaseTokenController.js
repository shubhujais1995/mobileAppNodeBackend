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
        title: "Test" + title,
        body: messageBody,
      },
      android: {
        notification: {
            channelId: 'aai-tag',
        }
    },
      data: {Key1: 'ValueSomething', AgainKey: 'NewHelp', OwnKey: '12345'},
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
