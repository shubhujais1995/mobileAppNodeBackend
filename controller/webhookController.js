const asyncHandler = require("express-async-handler");
const Webhook = require("../model/webhookModel");
const Order = require("../model/orderModel");
const QRCardModel = require("../model/qaCardModel");
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
    res.status(400);
    throw new Error("All fields are mandatory");
  }

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

    const orderDetail = await Order.findOne({ orderId: mealCreated.order_id });

    console.log(orderDetail);

    if (orderDetail) {
      const _orderId = orderDetail._id.toString();
      if (orderDetail.status !== "captured") {

        if (orderDetail.divide_to_all_card) {

          const allQrCodes = await QRCardModel.find();
          
          const allQrCodesLength = allQrCodes.length;
          
          const totalMealCame = parseInt(mealCreated.amount / 70);
          
          let remainingMeals = 0;

          if (totalMealCame > 1) {

            remainingMeals = (mealCreated.amount / 70) % allQrCodesLength;
          
          }

          const eachMeal = parseInt(totalMealCame / allQrCodesLength);

          if (remainingMeals == 0) {

            const updatedMealsId = allQrCodes.map((qr) => {
              qr.qr_available_meals = qr.qr_available_meals + eachMeal;
              qr.total_meals = qr.total_meals + eachMeal;

              return qr._id.toString();
            });

            for (let i = 0; i < allQrCodes.length; i++) {

              const element = allQrCodes[i];
              const _id = element._id.toString();
              const qr_available_meals = element.qr_available_meals;
              const total_meals = element.total_meals;

              await QRCardModel.findByIdAndUpdate(
                { _id },
                { qr_available_meals, total_meals },
                { new: true }
              );
            }

          } else {

            const updatedMealsId = allQrCodes.map((qr) => {
              return qr._id.toString();
            });

            for (let i = 0; i < allQrCodes.length; i++) {

              const element = allQrCodes[i];
              const _id = element._id.toString();
              const qr_available_meals = element.qr_available_meals;
              const total_meals = element.total_meals;

              await QRCardModel.findByIdAndUpdate(
                { _id },
                { qr_available_meals, total_meals },
                { new: true }
              );

            }

            const userId = orderDetail.user_id.toString();

            const userDetail = await UserModel.find({ _id: userId });

            const updateWallet = userDetail[0].wallet + remainingMeals;

            await UserModel.findByIdAndUpdate(
              { _id: userId },
              { wallet: updateWallet },
              { new: true }
            );

            const userDetailUpdate = await UserModel.find({ _id: userId });

            await Order.findByIdAndUpdate(
              { _id: _orderId },
              { status },
              { new: true });

            console.log("received after update", userDetailUpdate);

          }

        } else {
          const { qr_id } = orderDetail;

          const qRCardDetail = await QRCardModel.findOne({ qr_id });

          const totalMealCame = parseInt(mealCreated.amount / 70);

          qRCardDetail.total_meals = qRCardDetail.total_meals + totalMealCame;

          qRCardDetail.qr_available_meals = qRCardDetail.qr_available_meals + totalMealCame;

          qRCardDetail.status = qRCardDetail.status == false ? true : true;

          const _idQRId = qRCardDetail._id.toString();

          const { qr_available_meals, qr_status, total_meals } = qRCardDetail;

          await QRCardModel.findByIdAndUpdate(
            { _id: _idQRId },
            { qr_available_meals, qr_status, total_meals },
            { new: true }
          );

          const qRCardDetailAfterUpdate = await QRCardModel.findOne({ qr_id });
        
          
          await Order.findByIdAndUpdate(
            { _id: _orderId },
            { status },
            { new: true });

          const response = createResponse(
            "success",
            "Webhook Api called! and udpate QR amount & meals",
            qRCardDetailAfterUpdate
          );

          res.status(200).json(response);

        }

      } else {
        console.log("orderDetail.status  - Captured");
      }
    } else {
      console.log("Order Id did not match!");
    }
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
    const element_qr_available_meals = element.qr_available_meals;
    const element_total_meals = element.total_meals;

    // Use await inside an async function
    await QRCardModel.findByIdAndUpdate(
      { _id: element.toString() },
      {
        qr_available_meals: element_qr_available_meals,
        total_meals: element_total_meals,
      },
      { new: true }
    );
  }
}

module.exports = { webhookCall };
