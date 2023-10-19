const express = require("express");
const asyncHandler = require("express-async-handler");
const FBTOKEN = require("../model/firebaseTokenModel");

const addFbToken = asyncHandler(async (req, res) => {

  const { firebaseToken } = req.body;
    console.log(firebaseToken);

  if (!firebaseToken) {
    res.status(404);
    throw new Error("firebaseToken not found");
  }

    const ft = await FBTOKEN.create({ firebaseToken });

    const response = createResponse(201, {
      message: "Token added Successfully!",
      ft,
    });

    res.status(201).json(response);
//   }
});
const createResponse = (status, data) => {
  return {
    status,
    data,
  };
};

module.exports = { addFbToken };

// {
//   "status": true,
//   "message": "sucessfully fetched",
//   "error": 0,
//   "data": {
//     "name": "Amit",
//     "mobile": "9910508758",
//     "email": "",
//     "address": "",
//     "meal_available": 0,
//     "meal_value": "70",
//     "user_role":"",
//     "active_cards":null,
//     "deactive_cards":null,
//     "total_transactions": null,

//     "recent_qr_cards": [
//       {
//         "qr_id":"13",
//         "qr_display_name":"My QR Cards-1",
//         "qr_code": "1kjhbjgvg",
//         "status": true,
//         "qr_available_meals": 0,
//         "qr_app":""
//       },
//       {
//          "qr_id":"234",
//         "qr_display_name":"My QR Cards-3",
//         "qr_code": "76vt544",
//         "status": true,
//         "qr_available_meals": 0,
//         "qr_app":""
//       },
//       {
//         "qr_id":"343",
//         "qr_display_name":"My QR Cards-3",
//         "qr_code": "fvgr547h",
//         "status": true,
//         "qr_available_meals": 0,
//         "qr_app":""
//       }
//     ]
//   }

// }

// add QR, update QR, get QL list,
//  Wallet Recharge -> update QR  ,
