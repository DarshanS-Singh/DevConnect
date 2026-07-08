const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const ConnectDB = require("./src/config/database");
const { validateSignUpData } = require('./utils/validation'); 
const User = require('./src/model/User'); 

// Route Imports
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");

const app = express();

// Middleware
app.use(cors({
    origin: "https://devconnect-1-vil1.onrender.com",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
}));

app.use(express.json()); 
app.use(cookieParser());

const PORT = 3000;

// Base Routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

// Database Connection & Server Start
ConnectDB()
    .then(() => {
        console.log("DB Connection Successful");
        // ✅ HOST FIX: Binding to '0.0.0.0' ensures Render can properly expose the service
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is Listening on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("DB Connection Failed!!", err && err.message ? err.message : err);
    });
