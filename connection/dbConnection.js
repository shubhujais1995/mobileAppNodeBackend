
const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();
const connectDb = async () => {
    try {

        const connect = await mongoose.connect('mongodb+srv://admin:admin@sj-nodeexpresscluster.t7y7moz.mongodb.net/SJ-otp-db?retryWrites=true&w=majority');
        console.log("Database connected", connect.connection.host, connect.connection.name);

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDb;