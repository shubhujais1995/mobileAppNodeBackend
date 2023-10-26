const asyncHandler = require("express-async-handler");
const Webhook = require("../model/webhookModel");
const Order = require("../model/orderModel");
const QRCardModel = require("../model/qaCardModel");
require("dotenv").config();

const webhookCall = asyncHandler(async (req, res) => {
  // const meal = 105; //req.body.meals;
  // const userId = req.user.id;

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
          created_at
        }
      }
    }
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
    created_at
  });

  console.log("Meal Created ", mealCreated);

  if(mealCreated) {
    const orderDetail = await Order.findOne({ order_id });

    if(orderDetail.divideToAllCards) {
      console.log('Do devide to all qrs.');
    } else {

      const qRCardDetail = await QRCardModel.findOne({ qr_id });
      const totalMealCame = mealCreated.amout / 70; 
      console.log(qRCardDetail, totalMealCame);
      qRCardDetail.total_meals += totalMealCame;
      qRCardDetail.qr_available_meals += totalMealCame;

      console.log(qRCardDetail);

      if(qRCardDetail.status == false) {
        qRCardDetail.status = true;
      }

      await QRCard.findByIdAndUpdate(
        { _id: qrId },
        { qr_available_meals, total_meals, qr_status },
        { new: true }
      );

      const qRCardDetailAfterUpdate = await QRCardModel.findOne({ qr_id });
      console.log("after update ", qRCardDetailAfterUpdate);
      
      const response = createResponse(
        "success",
        "Webhook Api called! and udpate QR amount & meals",
        
      );
      res.status(200).json(response);
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
