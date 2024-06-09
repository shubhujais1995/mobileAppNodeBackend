const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Meal = require("../model/mealModel");
const GiftCard = require("../model/giftCardModel");
const UserModel = require("../model/userModel");

const addMealToCard = asyncHandler(async (req, res) => {
  const { gift_card_code, meals } = req.body;

  console.log(req.params.id);
  try {
    const giftCardDetail = await GiftCard.find({
      gift_card_code: gift_card_code,
    });

    if (giftCardDetail[0].gift_card_status === true) {
      const userDetail = await UserModel.find({ _id: req.user.id });

      if (userDetail[0].wallet != 0 && userDetail[0].wallet >= meals) {
        var updateWalletToUser = userDetail[0].wallet - meals;
        var updateAvailableToCard = giftCardDetail[0].available_meals + meals;
        var updateTotalToCard = giftCardDetail[0].total_meals + meals;

        var resultResponse = await GiftCard.findByIdAndUpdate(
          { _id: giftCardDetail[0]._id },
          { available_meals: updateAvailableToCard, total_meals: updateTotalToCard },
          { new: true }
        );

        await UserModel.findByIdAndUpdate(
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
          "Meals failed to update",
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
  } catch (error) {
    console.error("Error from axios:", error);
    // res.status(500).json({ success: false, error: "Internal Server Error" });
    const response = createResponse("error", "add meal failed!", null);
    res.status(200).json(response);
  }
});

const createResponse = (status, message, data) => {
  return {
    status,
    message,
    data,
  };
};

module.exports = { addMealToCard };
