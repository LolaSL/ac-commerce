import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import sellerRouter from './routes/sellerRoutes.js'
import uploadRouter from "./routes/uploadRoutes.js";
import contactRouter from './routes/contactRoutes.js'
import serviceProviderRouter from './routes/serviceProviderRoutes.js'
import blogRouter from './routes/blogRoutes.js'
import notificationRouter from './routes/notificationRoutes.js';
import path from "path";
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
app.use("/api/upload", uploadRouter, express.static(path.join(__dirname, "/uploads")));
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/sellers', sellerRouter);
app.use('/api/contact', contactRouter);
app.use('/api/service-providers', serviceProviderRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/notifications', notificationRouter);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);


app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5050;

const server = app.listen(5030, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server gracefully shut down');
        process.exit(0);
    });
});
