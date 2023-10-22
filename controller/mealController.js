const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Meal = require("../model/mealModel");
const QRCard = require("../model/qaCardModel");
const addMeal = asyncHandler(async (req, res) => {
  const {
    qr_id,
    meals
  } = req.body;

  if ( !qr_id || !meals ) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const documentsToUpdate = await QRCard.find({ qr_id: qr_id });

  console.log(" meal " ,documentsToUpdate);

  const updatedDocuments = await Promise.all(
      documentsToUpdate.map(async (document) => {
        document.qr_available_meals = meals;
        
        return document.save();
      })
    );
  console.log(updatedDocuments);
  const response = createResponse(201, {
    message: "Meal Updated succesfully!",
    updatedDocuments,
  });
  res.status(201).json(response);
});

// getMeals = asyncHandler(async (req, res) => {
//   const {
//     qr_id,
//     meals
//   } = req.body;

//   if ( !qr_id || !meals ) {
//     res.status(400);
//     throw new Error("All fields are mandatory");
//   }

//   const documentsToUpdate = await QRCard.find({ qr_id: qr_id });

//   console.log(" meal " ,documentsToUpdate);

//   const updatedDocuments = await Promise.all(
//       documentsToUpdate.map(async (document) => {
//         document.qr_available_meals = meals;
        
//         return document.save();
//       })
//     );
//   console.log(updatedDocuments);
//   const response = createResponse(201, {
//     message: "Meal Updated succesfully!",
//     updatedDocuments,
//   });
//   res.status(201).json(response);
// });

// Function to create a standardized response format
const createResponse = (status, data) => {
  return {
    status,
    data,
  };
};

module.exports = { addMeal };
