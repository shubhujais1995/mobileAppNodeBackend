const mongoose = require("mongoose");

const fbTokenSchema = mongoose.Schema(
    {
        firebaseToken: { type: String, unique: true, required: true }
    },{
        timestamps: true
    }
)
module.exports = mongoose.model("FBTOKEN", fbTokenSchema);