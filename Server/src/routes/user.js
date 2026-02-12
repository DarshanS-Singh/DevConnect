const express = require('express')

const userRouter = express.Router()

const {userAuth} = require('../middlewares/userAuth')

const ConnectionRequest = require('../model/ConnectionRequest')

const User = require('../model/User')

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age" , "gender" , "about", "skills"]

// get all the pending connection Request for the user
userRouter.get("/getRequest/received", userAuth, async (req, res) =>{
    
    try {

    const loggedInUser = req.user;

    const ReceivedConnectionRequest = await ConnectionRequest.find({
        toUserId : loggedInUser._id,                             // i want request which people has to sent to the loggedin user and only the interested once
        status  : "interested"
    }).populate("fromUserId", "firstName lastName") // if u dont pass the second parameter then it will return whole User to u with all details which can be bad
    // }).populate("fromUserId", ["firstName" , "lastName"])

    res.json({
        message : "Fetched Successfully",
        data : ReceivedConnectionRequest
    })

    } catch(err) {
        res.status(400).send("Error : " + err.message)
    }

})


// to get all the conntions of a user (accepted once)
userRouter.get("/getConnectedUsers" , userAuth , async (req,res) => {

    try {

        const loggedInUser = req.user

        const getConnectedUsers = await ConnectionRequest.find({

            $or : [
                {fromUserId : loggedInUser._id, status : "accepted"},
                {toUserId : loggedInUser._id, status : "accepted"}
            ]

        }).populate("fromUserId" , USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        // Extracting the other user (not the loggedIn)
        const connectedUser = getConnectedUsers.map((conn) => {
            if (conn.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return conn.toUserId
            }else{
                return conn.fromUserId
            }
        })

        res.status(200).json({
            message : "All Your Connections.",
            data : connectedUser
        })


    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }


})

// get all the profiles of other users
// pagination concept adding : two ways api can be hit /feed (can be said default page = 1 and limit = 10) or /feed?page=something&limit=something ex: /feed?page=2&limit=20
userRouter.get("/feed", userAuth, async (req, res) => {

    try{

        const loggedInUser = req.user

        // extracting page and limit, and logic for skip  => for pagination
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10

        limit = limit > 50 ? 50 : limit

        const skip = (page-1)*limit

        // User should all the cards except :
        // 1. his own card
        // 2. his connections card
        // 3. ignored cards
        // 4. already sent the connection request (like they are pending)

        const ExceptConnectionRequest = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        // .populate("fromUserId", "firstName").populate("toUserId", "firstName")                                                // select used to choose specific field that need to be shown from all the data we get

        // console.log(ExceptConnectionRequest)

        // to filter and be specific we gonna use set()
        const UserNotToBeSoonInFeed = new Set()

        // adding all in set for filtering and being specific
        ExceptConnectionRequest.forEach((request) => {
            UserNotToBeSoonInFeed.add(request.fromUserId.toString()),
            UserNotToBeSoonInFeed.add(request.toUserId.toString())
        })

        // console.log(UserNotToBeSoonInFeed)

        const UserFeed = await User.find({
            $and : [
                { _id : {$nin : Array.from(UserNotToBeSoonInFeed)} },
                { _id : {$ne : loggedInUser._id} }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        

        res.status(200).json({
            message : "feed",
            data : UserFeed
        })

    }catch(err){
        res.status(400).send("Error : " + err.message)
    }

})

module.exports = userRouter;

