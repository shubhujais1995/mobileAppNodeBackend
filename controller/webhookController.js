const asyncHandler = require("express-async-handler");
const Webhook = require("../model/webhookModel");
const Order = require("../model/orderModel");
const GiftCardModel = require("../model/giftCardModel");
const UserModel = require("../model/userModel");

require("dotenv").config();

const webhookCall = asyncHandler(async (req, res) => {
  const {
    account_id,
    payload: {
      payment: {
        entity: {
          id,
          amount,
          currency,
          status,
          order_id,
          method,
          amount_refunded,
          refund_status,
          card_id,
          bank,
          wallet,
          vpa,
          email,
          contact,
          error_code,
          error_reason,
          acquirer_data: { bank_transaction_id },
          created_at,
        },
      },
    },
  } = req.body;

  if (
    !amount ||
    !id ||
    !email ||
    !method ||
    !bank ||
    !order_id ||
    !account_id
  ) {
    // res.status(400);
    // throw new Error("All fields are mandatory");
    const response = createResponse("error", "All fields are mandatory!", null);
    res.status(200).json(response);
  }

  try {
    const mealCreated = await Webhook.create({
      account_id,
      id,
      amount,
      currency,
      status,
      order_id,
      method,
      amount_refunded,
      refund_status,
      card_id,
      bank,
      wallet,
      vpa,
      email,
      contact,
      error_code,
      error_reason,
      bank_transaction_id,
      created_at,
    });

    if (mealCreated) {
      const orderDetail = await Order.findOne({
        orderId: mealCreated.order_id,
      });

      console.log(orderDetail);

      if (orderDetail) {
        if (orderDetail.status !== "captured") {
          const userId = orderDetail.user_id.toString();

          const userDetail = await UserModel.find({ _id: userId });

          const totalMealCame = parseInt(mealCreated.amount / 70);

          const updateWallet = userDetail[0].wallet + totalMealCame;

        var userData=   await UserModel.findByIdAndUpdate(
            { _id: userId },
            { wallet: updateWallet },
            { new: true }
          );

          const response = createResponse(
            "success",
            "Webhook Api called! and udpate QR amount & meals",
            userData
          );

          res.status(200).json(response);
          return;
          // if (orderDetail.divide_to_all_card) {

          //   const allQrCodes = await GiftCardModel.find();

          //   const allQrCodesLength = allQrCodes.length;

          //   const totalMealCame = parseInt(mealCreated.amount / 70);

          //   let remainingMeals = 0;

          //   if (totalMealCame > 1) {

          //     remainingMeals = (mealCreated.amount / 70) % allQrCodesLength;

          //   }

          //   const eachMeal = parseInt(totalMealCame / allQrCodesLength);

          //   if (remainingMeals == 0) {

          //     const updatedMealsId = allQrCodes.map((qr) => {
          //       qr.available_meals = qr.available_meals + eachMeal;
          //       qr.total_meals = qr.total_meals + eachMeal;

          //       return qr._id.toString();
          //     });

          //     for (let i = 0; i < allQrCodes.length; i++) {

          //       const element = allQrCodes[i];
          //       const _id = element._id.toString();
          //       const available_meals = element.available_meals;
          //       const total_meals = element.total_meals;

          //       await GiftCardModel.findByIdAndUpdate(
          //         { _id },
          //         { available_meals, total_meals },
          //         { new: true }
          //       );
          //     }

          //   } else {

          //     const updatedMealsId = allQrCodes.map((qr) => {
          //       return qr._id.toString();
          //     });

          //     for (let i = 0; i < allQrCodes.length; i++) {

          //       const element = allQrCodes[i];
          //       const _id = element._id.toString();
          //       const available_meals = element.available_meals;
          //       const total_meals = element.total_meals;

          //       await GiftCardModel.findByIdAndUpdate(
          //         { _id },
          //         { available_meals, total_meals },
          //         { new: true }
          //       );

          //     }

          //     const userId = orderDetail.user_id.toString();

          //     const userDetail = await UserModel.find({ _id: userId });

          //     const updateWallet = userDetail[0].wallet + remainingMeals;

          //     await UserModel.findByIdAndUpdate(
          //       { _id: userId },
          //       { wallet: updateWallet },
          //       { new: true }
          //     );

          //     const userDetailUpdate = await UserModel.find({ _id: userId });

          //     await Order.findByIdAndUpdate(
          //       { _id: _orderId },
          //       { status },
          //       { new: true });

          //     console.log("received after update", userDetailUpdate);

          //   }

          // } else {
          //   const { gift_card_code } = orderDetail;

          //   const GiftCardDetail = await GiftCardModel.findOne({ gift_card_code });

          //   const totalMealCame = parseInt(mealCreated.amount / 70);

          //   GiftCardDetail.total_meals = GiftCardDetail.total_meals + totalMealCame;

          //   GiftCardDetail.available_meals = GiftCardDetail.available_meals + totalMealCame;

          //   GiftCardDetail.status = GiftCardDetail.status == false ? true : true;

          //   const _idgiftCardCode = GiftCardDetail._id.toString();

          //   const { available_meals, gift_card_status, total_meals } = GiftCardDetail;

          //   await GiftCardModel.findByIdAndUpdate(
          //     { _id: _idgiftCardCode },
          //     { available_meals, gift_card_status, total_meals },
          //     { new: true }
          //   );

          //   const GiftCardDetailAfterUpdate = await GiftCardModel.findOne({ gift_card_code });

          //   await Order.findByIdAndUpdate(
          //     { _id: _orderId },
          //     { status },
          //     { new: true });

          //   const response = createResponse(
          //     "success",
          //     "Webhook Api called! and udpate QR amount & meals",
          //     GiftCardDetailAfterUpdate
          //   );

          //   res.status(200).json(response);

          // }
          
        } else {
          console.log("orderDetail.status  - Captured");
        }
      } else {
        console.log("Order Id did not match!");
      }
    }
  } catch (error) {
    console.error("Error from axios:", error);
    // res.status(500).json({ success: false, error: "Internal Server Error" });
    const response = createResponse("error", "webhook failed!", null);
    res.status(200).json(response);
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

async function updateQRCodes(allQrCodes) {
  // const allQrCodes = [...]; // Replace with your actual array of QR codes

  for (const element of allQrCodes) {
    console.log("element ", element);
    const element_available_meals = element.available_meals;
    const element_total_meals = element.total_meals;

    // Use await inside an async function
    await GiftCardModel.findByIdAndUpdate(
      { _id: element.toString() },
      {
        available_meals: element_available_meals,
        total_meals: element_total_meals,
      },
      { new: true }
    );
  }
}

module.exports = { webhookCall };
