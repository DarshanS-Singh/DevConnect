const express = require('express')

const profileRouter = express.Router()

const {userAuth} = require("../middlewares/userAuth")

const { validateEditData } = require('../../utils/validation')

const validator = require('validator')

const bcrypt = require('bcrypt')


// see user profile if loggedIn

profileRouter.get("/getProfile", userAuth, async (req,res) => {
    try {

        const user = req.user
    
        res.send(user)
    }
    catch (err){
        res.status(404).send(err)
    }
})

// edit the profile

profileRouter.patch("/editUserProfile", userAuth, async (req, res) => {
    try {

        if (!validateEditData(req)){
            throw new Error("Bad edit request")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

        await loggedInUser.save()

        res.json({
            message : `${loggedInUser.firstName} ur profile is updated. `,
            data : loggedInUser
        })

    } catch (err) {
        res.status(400).send(err.message)
    }
})

// edit the password

profileRouter.patch("/editUserPassword",userAuth , async (req,res) => {
    const user = req.user;
    
        try {
            const oldPassword = req.body.password
            const newPassword = req.body.newPassword
            const isOldPassword = await bcrypt.compare(oldPassword, user.password)

            // Check if fields exist
            if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Old and new password are required" });
            }

            if (!isOldPassword) {
                return res.status(401).json({ error: "Old password is incorrect" });
            } else{

                if (!validator.isStrongPassword(newPassword)){
                    return res.status(400).json({ error: "Enter a stronger password" });
                }

                const hashNewPassword = await bcrypt.hash(newPassword,10) 
                user.password = hashNewPassword;

                await user.save()

                res.json({ message: "Password updated successfully" });
            }
        }catch (err) {
            res.status(500).json({ error: "Server error: " + err.message });
        }
})

module.exports = profileRouter;

