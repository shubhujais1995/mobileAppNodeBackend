const asyncHandler = require("express-async-handler");
const Webhook = require("../model/webhookModel");
const Order = require("../model/orderModel");
const QRCardModel = require("../model/qaCardModel");

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

  console.log("Meal Created ", mealCreated);

  if (mealCreated) {
    const orderDetail = await Order.findOne({ orderId: mealCreated.order_id });

    console.log(orderDetail);

    if (orderDetail) {
      if (orderDetail.status !== "captured") {
        if (orderDetail.divideToAllCards) {
          console.log("Do devide to all qrs.");
        } else {
          const { qr_id } = orderDetail;

          const qRCardDetail = await QRCardModel.findOne({ qr_id });

          const totalMealCame = Math.ceil(mealCreated.amount / 70);

          qRCardDetail.total_meals =
            Number(qRCardDetail.total_meals) + totalMealCame;

          qRCardDetail.qr_available_meals =
            Number(qRCardDetail.qr_available_meals) + totalMealCame;

          qRCardDetail.status = qRCardDetail.status == false ? true : true;

          const _id = qRCardDetail._id.toString();

          const { qr_available_meals, qr_status, total_meals } = qRCardDetail;

          console.log(_id, qr_available_meals, qr_status, total_meals);

          await QRCardModel.findByIdAndUpdate(
            { _id },
            { qr_available_meals, qr_status, total_meals },
            { new: true }
          );

          console.log("Updated the QR model");

          const qRCardDetailAfterUpdate = await QRCardModel.findOne({ qr_id });

          console.log(
            "qRCardDetail AfterUpdate fetch back ",
            qRCardDetailAfterUpdate
          );

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

module.exports = { webhookCall };
