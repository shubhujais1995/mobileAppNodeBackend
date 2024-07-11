const express = require('express');
const userRoutes = require('./router/userRoute');
const giftCardRoutes = require('./router/giftCardRoutes');
const testimonialRoutes = require('./router/testimonialRoute');
const fbtRoutes = require('./router/firebaseTokenRoute');
const orderRoutes = require('./router/orderRoute');
const webhookRoutes = require('./router/webhookRoute');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require("dotenv").config();
const connectDb = require("./connection/dbConnection");
const firebaseApp = require("./connection/firebaseApp");
const bodyParser = require('body-parser')

connectDb();
firebaseApp();

const app = express();
const port = process.env.PORT || 3000;

// mongoose.connect('mongodb://localhost:27017/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send({"message": "Deployed again! ;"});
})

// app.post('/api/qr/add-qr', (rq, res) => {
//   res.status(200).json({"messsage": "this calledd!"})
// });
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/gift-card', giftCardRoutes);
app.use('/api/fb', fbtRoutes);
app.use('/api/testimonial', testimonialRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wh', webhookRoutes);
app.use(errorHandler); //middleware for getting error properly


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
