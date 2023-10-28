const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const QRCard = require("../model/qaCardModel");
const User = require("../model/userModel");

const addQR = asyncHandler(async (req, res) => {
  const {
    qr_id,
    qr_display_name,
    qr_code,
    total_meals,
    qr_available_meals,
    qr_app,
    qr_status,
  } = req.body;

  if (!qr_id || !qr_display_name || !qr_code || !qr_app || !qr_status) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const qr = await QRCard.create({
    qr_id,
    qr_code,
    qr_display_name,
    total_meals,
    qr_available_meals,
    qr_app,
    qr_status,
    user_id: req.user.id,
  });

  const response = createResponse("success", "QR Added succesfully!", qr);
  res.status(201).json(response);
});

const updateQR = asyncHandler(async (req, res) => {
  const qrId = req.params.id;
  const allQRs = await QRCard.find();
  const qr = allQRs.find((qr) => qr.id === qrId);

  const { qr_status } = req.body;
  if (!qr) {
    res.status(404);
    throw new Error("QR not found");
  }

  if (qr.user_id.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User don't have permission to update other user contacts");
  }

  if (qr_status == false) {
    const userId = req.user.id;
    const userDetail = await User.findOne({ _id: userId });

    if (userDetail) {
      const updatedWalletValue = userDetail.wallet + qr.qr_available_meals;

      await User.findByIdAndUpdate(
        req.user.id,
        { $set: { wallet: updatedWalletValue } },
        { new: true }
      );

      const qr_available_meals = 0;
      await QRCard.findByIdAndUpdate(
        { _id: qrId },
        { qr_status, qr_available_meals },
        { new: true }
      );
    }
  } else {
    await QRCard.findByIdAndUpdate({ _id: qrId }, { qr_status }, { new: true });
  }

  const response = createResponse(
    "success",
    "QR Status updated succesfully!",
    null
  );
  res.status(200).json(response);
});

const fetchQRList = asyncHandler(async (req, res) => {
  const allQRs = await QRCard.find();

  if (!allQRs.length) {
    const response = createResponse("success", "QR List is found empty!", null);
    res.status(200).json(response);
  } else {
    const response = createResponse(
      "success",
      "QR List fetched succesfully!",
      allQRs
    );
    res.status(200).json(response);
  }
});

const getQrById = asyncHandler(async (req, res) => {
  
  const qr_id = req.id;

  const qrDetail = await QRCard.find({ qr_id });

  if (!qrDetail) {
    res.send(404);
    throw new Error("Please provide valid Qr id");
  } else {
    const response = createResponse(
      "success",
      "QR Detail fetched succesfully!",
      qrDetail
    );
    res.status(200).json(response);
  }
});

const redeemQr = asyncHandler(async (req, res) => {
  const currentUserRole = req.user.user_role;
  if (currentUserRole != "admin") {
    const response = createResponse(
      "error",
      "You are not autherized redeem meals!",
      null
    );
    res.status(401).json(response);
  } else {
    const { qr_id } = req.body;

    const qrDetails = await QRCard.find({ qr_id });
    const qrDetail = qrDetails[0];
    console.log(" qrDetail == ", qrDetail);

    if (!qrDetail) {
      console.log("qrDetail came in error");
      res.status(404);
      throw new Error("Please provide valid QR Id!");
    } else {
      console.log("came in else");
      if (qrDetail.qr_available_meals < 1) {
        console.log("came in 404");
        res.status(404);
        throw new Error("Meals are not left in your account!");
      } else {
        console.log("qr_available_meals", qrDetail.qr_available_meals);
        let qr_available_meals = qrDetail.qr_available_meals - 1;
        const _id = qrDetail._id.toString();
        console.log(_id);
        console.log(qr_available_meals);
        await QRCard.findByIdAndUpdate(
          { _id },
          { qr_available_meals },
          { new: true }
        );
        console.log("updated");

        const response = createResponse(
          "success",
          "Meal redeem succesfully!",
          null
        );
        res.status(200).json(response);
      }
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
module.exports = { addQR, updateQR, fetchQRList, redeemQr, getQrById };
