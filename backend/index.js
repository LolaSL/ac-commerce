import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import sellerRouter from './routes/sellerRoutes.js'
import uploadRouter from "./routes/uploadRoutes.js";
import quoteRouter from './routes/quoteRoutes.js';
import contactRouter from './routes/contactRoutes.js'
import serviceProviderRouter from './routes/serviceProviderRoutes.js'
// import dashboardRouter from './routes/dashboardRouter.js';
import cors from 'cors';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to Mongo DB")
})
    .catch((err) => {
        console.log(err.message);
    })

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.get("/api/keys/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.get("/api/keys/google", (req, res) => {
    res.send({ key: process.env.GOOGLE_API_KEY || "" });
});

app.use('/api/seed', seedRouter);
app.use("/api/upload", uploadRouter);
app.use("/files", express.static("files"));
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/sellers', sellerRouter);
app.use('/api/contact', contactRouter);
app.use('/api/quote', quoteRouter);
app.use('/api/service-providers', serviceProviderRouter)
// app.use('/api/dashboard', dashboardRouter)
app.get('/', (req, res) => {
    res.send('Server is ready')
})
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});


const port = process.env.PORT || 5000;

app.listen(5030, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})