const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Meal = require("../model/mealModel");
const QRCard = require("../model/qaCardModel");
const addMeal = asyncHandler(async (req, res) => {
  const requestBody = req.body;

  console.log(req.body);

  // Loop through each object in the request body
  const updatedDocuments = await Promise.all(
    requestBody.map(async (data) => {
      const { qr_id, meals } = data;

      // Fetch documents to update for the current QR ID
      const documentsToUpdate = await QRCard.find({ qr_id: qr_id });

      // Update each document
      const updatedDocs = await Promise.all(
        documentsToUpdate.map(async (document) => {
          console.log(" qr_id - current - ", qr_id,  document.qr_available_meals);
          document.qr_available_meals += meals;
          return document.save();
        })
      );

      return { qr_id, updatedDocs };
    })
  );

  // Log the updated documents
  console.log(updatedDocuments);

  // Send response to the client
  const response = createResponse(201, {
    message: "Meals Updated Successfully!",
    updatedDocuments,
  });

  res.status(201).json(response);

  // if ( !qr_id || !meals ) {
  //   res.status(400);
  //   throw new Error("All fields are mandatory");
  // }

  // const documentsToUpdate = await QRCard.find({ qr_id: qr_id });

  // console.log(" meal " ,documentsToUpdate);

  // const updatedDocuments = await Promise.all(
  //     documentsToUpdate.map(async (document) => {
  //       document.qr_available_meals = meals;

  //       return document.save();
  //     })
  //   );
  // console.log(updatedDocuments);
  // const response = createResponse(201, {
  //   message: "Meal Updated succesfully!",
  //   updatedDocuments,
  // });
  // res.status(201).json(response);
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
