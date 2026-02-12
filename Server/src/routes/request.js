const express = require('express');

const requestRouter = express.Router()

const {userAuth} = require("../middlewares/userAuth");

const ConnectionRequest = require('../model/ConnectionRequest');

const User = require('../model/User')

// creating connection request api , previous one was to basic, gonna create api which works for interest and ignored status 
requestRouter.post("/sendConnectionRequest/:status/:Id", userAuth, async ( req , res ) => {
    try {

    // getting logged in user ID
    const user = req.user;
    const fromUserId = user._id

    // getting id of user to which request has to be sent (it's passed in url)
    const toUserId = req.params.Id;

    // getting status of the send connection request
    const status = req.params.status

    // check for to make api works only for (swipe R or L)
    const allowed_status = ["ignored", "interested"];

    const isToUserPresent = await User.findById(toUserId) 

    if (!isToUserPresent) {
        return res.status(400).json({
            message : "Your Requested Id Is Invalid "
        })
    }

    if (!(allowed_status.includes(status))) {
        return res.status(400).json({
            message : "Invalid Status Type."
        })
    }

    // if (fromUserId == toUserId) {             // this one done with pre method at Schema level
    //     return res.status(400).json({message : "Request Not Possible."})
    // }


    // If there is an existing ConnectionRequest

    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or : [
        { fromUserId , toUserId } , 
        { fromUserId : toUserId , toUserId : fromUserId } 
        ]
    })

    if (existingConnectionRequest) {
        return res.status(400).json({
            message : "Already have requested"
        })
    }

    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    })

    const data = await connectionRequest.save()

    return res.json({
        message : status,
        data
    })

    
        
    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})


// Creating api which accepts or rejects the send connection request to toUser
requestRouter.post("/review/:status/:requestId", userAuth, async (req,res) => {             // requestId is the one which is objectId of connectionRequest at the time of creation

    try {

        const loggedInUser = req.user  // here loggedInUSer is toUserId
    
        const {status,requestId} = req.params;

        const allowed_status = ["accepted", "rejected"]

        if (!allowed_status.includes(status)) {
            return res.status(400).json({message : status + " as status is not allowed."})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        })

        if (!connectionRequest) {
            return res.status(404).json("No Such Connection Request Found")
        }

        connectionRequest.status = status

        const data = await connectionRequest.save()

        res.json({message : "You " + status + " the request.", data})

    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }

})                             

module.exports = requestRouter;