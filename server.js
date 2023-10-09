// app.js
const express = require('express');
// const mongoose = require('mongoose');`
const userRoutes = require('./router/userRoute');
const dotenv = require("dotenv").config();
const connectDb = require("./connection/dbConnection");
const bodyParser = require('body-parser')

connectDb();


const app = express();
const port = process.env.PORT || 3000;

// mongoose.connect('mongodb://localhost:27017/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send({"message": "You are hero!"});
})

app.use(express.json());

app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
