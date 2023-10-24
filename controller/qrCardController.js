const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const QRCard = require("../model/qaCardModel");
const User = require("../model/userModel");
const ObjectId = require('mongodb').ObjectId;
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

  if (
    !qr_id ||
    !qr_display_name ||
    !qr_code ||
    !total_meals ||
    !qr_available_meals ||
    !qr_app ||
    !qr_status
  ) {
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

  const response = createResponse(201, {
    message: "QR Added succesfully!",
    qr,
  });
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
    res.status(404);
    throw new Error("User don't have permission to update other user contacts");
  }
  if(qr_status === false) {
    console.log(req.user);
  }
  await QRCard.findByIdAndUpdate({ _id: qrId }, { qr_status }, { new: true });
//   await QRCard.update({ _id:  new ObjectId(qrId) }, { qr_status }, function (err, result) {
    // if (err) {
    //     console.log('some error');
    // }
    // res.send(
    //     (err === null) ? {msg: 'updated'} : {msg: err}
    // )});
  const response = createResponse(200, {
    message: "QR Status updated succesfully!",
  });
  res.status(200).json(response);
});

const fetchQRList = asyncHandler(async (req, res) => {
  const allQRs = await QRCard.find();

  if (!allQRs.length) {
    const response = createResponse(200, {
        message: "QR List is found empty!",
        allQRs,
      });
      res.status(200).json(response);
  } else {
    const response = createResponse(200, {
      message: "QR List fetched succesfully!",
      allQRs,
    });
    res.status(200).json(response);
  }
});

// Function to create a standardized response format
const createResponse = (status, data) => {
  return {
    status,
    data,
  };
};
module.exports = { addQR, updateQR, fetchQRList };
