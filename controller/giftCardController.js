const asyncHandler = require("express-async-handler");
const GiftCard = require("../model/giftCardModel");
const User = require("../model/userModel");
const firebaseTokenController = require("../controller/firebaseTokenController");

const createGiftCard = asyncHandler(async (req, res) => {
  const gift_card_code = await generateCode();
  const total_meals = 0;
  const available_meals = 0;
  const gift_card_status = true;

  const giftCard = await GiftCard.create({
    gift_card_code: gift_card_code,
    total_meals: total_meals,
    available_meals: available_meals,
    gift_card_status: gift_card_status,
    user_id: req.user.id,
  });

  const response = createResponse(
    "success",
    "GiftCard created succesfully!",
    giftCard
  );
  res.status(200).json(response);
});

const updateGiftCard = asyncHandler(async (req, res) => {
  const giftCardId = req.params.id;
  const giftCard = await GiftCard.findOne({ _id: giftCardId });
 // const giftCard = giftCards.find(_id === giftCardId);

  const { gift_card_status } = req.body;
  if (!giftCard) {
    res.status(404);
    throw new Error("QR not found");
  }

  if (giftCard.user_id.toString() !== req.user.id) {
    const response = createResponse(
      "error",
      "You are not authorized to update other's QR!",
      null
    );
    res.status(401).json(response);
  }
  var resultResponse=null;
  if (gift_card_status == false) {
    const userId = req.user.id;
    const userDetail = await User.findOne({ _id: userId });

    if (userDetail) {
      const updatedWalletValue = userDetail.wallet + giftCard.available_meals;

      await User.findByIdAndUpdate(
        req.user.id,
        { $set: { wallet: updatedWalletValue } },
        { new: true }
      );

      const available_meals = 0;
      resultResponse =   await GiftCard.findByIdAndUpdate(
        { _id: giftCard._id },
        { gift_card_status, available_meals },
        { new: true }
      );
    }
  } else {
    resultResponse =   await GiftCard.findByIdAndUpdate(
      { _id: giftCard._id },
      { gift_card_status },
      { new: true }
    );
  }

  const response = createResponse(
    "success",
    "GiftCard Status updated succesfully!",
    resultResponse
  );
  res.status(200).json(response);
});

const fetchGiftCardList = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const giftCards = await GiftCard.find({ user_id });

  if (!giftCards.length) {
    const response = createResponse("success", "Giftcard List is found empty!", null);
    res.status(200).json(response);
  } else {
    const response = createResponse(
      "success",
      "Giftcard List fetched succesfully!",
      giftCards
    );
    res.status(200).json(response);
  }
});

const getGiftCardById = asyncHandler(async (req, res) => {
  const gift_card_id = req.params.id;
  const user_id = req.user.id;
  const userRole = req.user.user_role;
  const giftCardDetail = await GiftCard.findOne({ _id: gift_card_id });
  if (userRole == "super_admin" || userRole == "admin") {
   
    if (!giftCardDetail) {
      // res.send(404);
      // throw new Error("Please provide valid Qr id");

      const response = createResponse(
        "error",
        "Please provide valid Qr id",
        null
      );

      res.status(200).json(response);
    } else {
      const response = createResponse(
        "success",
        "GiftCard Detail fetched succesfully!",
        giftCardDetail
      );
      res.status(200).json(response);
    }
  } else {
  
    if (!giftCardDetail) {
      // res.send(404);
      // throw new Error("Please provide valid Qr id");

      const response = createResponse(
        "error",
        "Please provide valid Gift Card code",
        null
      );

      res.status(200).json(response);
    } else {
      const giftCardUserId = giftCardDetail.user_id.toString();
      if (giftCardUserId !== user_id) {
        const response = createResponse(
          "error",
          "You are not authorized to fetch other's Gift Card Detail!",
          null
        );
        res.status(401).json(response);
      } else {
        const response = createResponse(
          "success",
          "GiftCard Detail fetched succesfully!",
          giftCardDetail
        );
        res.status(200).json(response);
      }
    }
  }
});

const redeemGiftCard = asyncHandler(async (req, res) => {
  const currentUserRole = req.user.user_role;
  var userDetail =null;
  var user_id = "";
   try {
    if (currentUserRole === "admin"){
      const { gift_card_code } = req.body;
  
      const gifCardDetailList = await GiftCard.find({ gift_card_code });
      const gifCardDetail = gifCardDetailList[0];
      user_id = gifCardDetail.user_id;
      userDetail = await User.findOne({ _id: user_id });
      user_id = userDetail.id;
      console.log("gifCardDetail == ", gifCardDetail);
  
      if (!gifCardDetail) {
        const response = createResponse(
          "error",
          "Please provide valid gift card code",
          null
        );
        res.status(200).json(response);
      } else {
        console.log("came in else");
        if (gifCardDetail.available_meals < 1) {
          console.log("came in 404");
          // res.status(404);
          // throw new Error("Meals are not left in your account!");
          const response = createResponse(
            "success",
            "Meals are not left in your account!",
            null
          );
          res.status(200).json(response);
          firebaseTokenController.sendPushNotification(user_id, "Dear "+userDetail.name,"We are unable to redeem meal from your account. Please add more meals","/gift-card-detail-page",gifCardDetail._id.toString());
        } else {
          let available_meals = gifCardDetail.available_meals - 1;
          const _id = gifCardDetail._id.toString();
          await GiftCard.findByIdAndUpdate(
            { _id },
            { available_meals },
            { new: true }
          );
    
          var adminUser = await User.findOne({ _id: req.user.id });
          var total_redeem = 0
     
          if(!adminUser.total_redeem){
            total_redeem = 0;
          }else{
            total_redeem = adminUser.total_redeem;
          }

           total_redeem = total_redeem + 1;
  
          await User.findByIdAndUpdate(
            { _id:adminUser.id },
            { total_redeem:total_redeem },
            { new: true }
          );
          console.log("updated");
          firebaseTokenController.sendPushNotification(user_id, "Dear "+userDetail.name+", Thank you","We have successfully redeem an meal from your account","/gift-card-detail-page",gifCardDetail._id.toString());
          const response = createResponse(
            "success",
            "Meal redeem succesfully!",
            null
          );
  
          res.status(200).json(response);
        }
      }
    } else {
      const response = createResponse(
        "error",
        "You are not authrized to redeem the gift card",
        null
      );
  
      res.status(200).json(response);
    }
   } catch (error) {
    const response = createResponse(
      "error",
      "Error while redeeming the meal, Please again later",
      null
    );
    res.status(200).json(response);
   }
});


const addMealToCard = asyncHandler(async (req, res) => {
  const { gift_card_code, meals } = req.body;

  console.log(req.params.id);
  try {
    const giftCardDetail = await GiftCard.find({
      gift_card_code: gift_card_code,
    });

    if(giftCardDetail){
      if (giftCardDetail[0].gift_card_status === true) {
        const userDetail = await User.find({ _id: req.user.id });
  
        if (userDetail[0].wallet != 0 && userDetail[0].wallet >= meals) {
          var updateWalletToUser = userDetail[0].wallet - meals;
          var updateAvailableToCard = giftCardDetail[0].available_meals + meals;
          var updateTotalToCard = giftCardDetail[0].total_meals + meals;
  
          var resultResponse = await GiftCard.findByIdAndUpdate(
            { _id: giftCardDetail[0]._id },
            { available_meals: updateAvailableToCard, total_meals: updateTotalToCard },
            { new: true }
          );
  
          await User.findByIdAndUpdate(
            { _id: req.user.id },
            { wallet: updateWalletToUser },
            { new: true }
          );
  
          const response = createResponse(
            "success",
            "Meals successfully updated ",
            resultResponse
          );
  
          res.status(200).json(response);
        } else {
          const response = createResponse(
            "error",
            "In-sufficient balance, Please recharge your wallet",
            null
          );
  
          res.status(200).json(response);
        }
      } else {
        const response = createResponse(
          "error",
          "You can add meal to deactivated card, please activate the card to add",
          null
        );
  
        res.status(200).json(response);
      }
    }else{
      const response = createResponse("error", "Please enter valid card code", null);
      res.status(200).json(response);
    }
    
  } catch (error) {
    console.error("Error from axios:", error);
    // res.status(500).json({ success: false, error: "Internal Server Error" });
    const response = createResponse("error", "add meal failed!", null);
    res.status(200).json(response);
  }
});

const transferMealToWallet = asyncHandler(async (req, res) => {
  const { gift_card_code, meals } = req.body;

  console.log(req.params.id);
  try {
    const giftCardDetail = await GiftCard.findOne({
      gift_card_code: gift_card_code,
    });

    if(giftCardDetail){
      if (giftCardDetail.gift_card_status === true) {
        const userDetail = await User.findOne({ _id: req.user.id });
  
        if (giftCardDetail.available_meals >= meals) {
          var updateWalletToUser = userDetail.wallet + meals;
     
          var resultResponse = await GiftCard.findByIdAndUpdate(
            { _id: giftCardDetail._id },
            { available_meals: 0,  },
            { new: true }
          );
  
          await User.findByIdAndUpdate(
            { _id: req.user.id },
            { wallet: updateWalletToUser },
            { new: true }
          );
  
          const response = createResponse(
            "success",
            "Meals successfully transfered",
            resultResponse
          );
  
          res.status(200).json(response);
        } else {
          const response = createResponse(
            "error",
            "In-sufficient meals",
            null
          );
  
          res.status(200).json(response);
        }
      } else {
        const response = createResponse(
          "error",
          "You can not add meal to deactivated card, please activate the card to add",
          null
        );
  
        res.status(200).json(response);
      }
    }else{
      const response = createResponse("error", "Please enter valid card code", null);
      res.status(200).json(response);
    }
    
  } catch (error) {
    console.error("Error from axios:", error);
    // res.status(500).json({ success: false, error: "Internal Server Error" });
    const response = createResponse("error", "transfer meal failed!", null);
    res.status(200).json(response);
  }
});

// Function to generate a gift card number
async function generateCode() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const giftCardDetails = await GiftCard.find({ gift_card_code: code });
  if (giftCardDetails != null && giftCardDetails[0] != null) {
    generateCode();
  }
  return code;
}

// Function to create a standardized response format
const createResponse = (status, message, data) => {
  return {
    status,
    message,
    data,
  };
};
module.exports = {
  createGiftCard,
  updateGiftCard,
  fetchGiftCardList,
  redeemGiftCard,
  getGiftCardById,
  addMealToCard,
  transferMealToWallet,
};
