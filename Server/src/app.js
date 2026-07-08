const express = require('express')
require('dotenv').config()

const ConnectDB = require("../src/config/database")

const User = require('./model/User')

const app = express()

const {validateSignUpData} = require('../utils/validation') 

const cookieParser = require("cookie-parser")

const authRouter = require("./routes/auth")

const profileRouter = require("./routes/profile")

const requestRouter = require("./routes/request")

const userRouter = require("./routes/user")

const cors = require('cors')

app.use(cors({
    origin : "https://dev-connect-pxkm-l7rh68ty9-darshans-singhs-projects.vercel.app/",
    credentials : true,
    // ✅ ADD THIS LINE to allow specific methods
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
}))

app.use(express.json()) 

app.use(cookieParser())

const PORT = 3000;

app.use("/auth", authRouter)

app.use("/profile", profileRouter)

app.use("/request", requestRouter)

app.use("/user", userRouter)


ConnectDB()
    .then(() => {
        console.log("DB Connection Successful")
        app.listen(PORT, () => {
            console.log("Server is Listening on :" , PORT)
        })
    })
    .catch((err)=>{
        console.error("DB Connection Failed!!", err && err.message ? err.message : err)
    })
