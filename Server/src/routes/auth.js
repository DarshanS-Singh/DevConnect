const express = require('express')

const authRouter = express.Router()

const {userAuth} = require("../middlewares/userAuth")

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const User = require('../model/User')

const {validateSignUpData} = require('../../utils/validation')

// signup 

authRouter.post("/signup" , async (req,res) => {

    
    try {

        const {firstName,lastName,emailId,password} = req.body

        validateSignUpData(req)

        const passwordHash = await bcrypt.hash(password,10)
        console.log(passwordHash)
        
        const user = new User({firstName,lastName,emailId,
            password : passwordHash })

        await user.save()

        const token = await user.getJWT()

        // console.log(token)
        
        res.cookie("token", token, {expires : new Date(Date.now() + 24*60*60*1000)})  
        

        res.json({
            message : "Signed Up Successfully.",
            data : user
        })
    }
    catch(err){
        res.status(500).send("Error : " + err.message )
    }  
})

// login

authRouter.post("/login" , async (req, res) => {
    try {
        const { emailId, password} = req.body

        const UserFound = await User.findOne({emailId : emailId})

        if (!UserFound) {
            throw new Error("Invalid Credential")
        }

        // const passwordVerify = await User.verifyPassword(password)  this one wrong
        //userSchema.methods creates instance methods, not static (model-level) methods. That means verifyPassword exists on a User document instance, not on the User model itself.

        const passwordVerify = await UserFound.verifyPassword(password)

        if (passwordVerify) {

            const token = await UserFound.getJWT()

            // console.log(token)
            
            res.cookie("token", token, {expires : new Date(Date.now() + 24*60*60*1000)})  
            
            res.send(UserFound)
        }else {
            throw new Error("Invalid Credential")
        }

        
    } catch (err) {
        res.status(500).send("Error : " + err.message)
    }
})

// logout

authRouter.post("/logout", (req , res) => {
    try {
    res.cookie("token", null, {
        expires : new Date(Date.now())
    }).send("Logged Out")
    } catch (err) {
        res.send("Something Went Wrong " + err.message)
    }
})


module.exports = authRouter;