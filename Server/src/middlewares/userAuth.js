const jwt = require('jsonwebtoken')
const User = require('../model/User')


const userAuth = async (req,res,next) => {
    try{
        // Read the token
    const {token} = req.cookies;

    if (!token){
        throw new Error("Looks Like U Are Not Logined In")
    }

    // validate the token 
    const decodedObj = await jwt.verify(token , "DEV@Tinder$030")

    // extracting the id
    const {_id} = decodedObj

    // Getting user from DB
    const user = await User.findById(_id)
    
    if (!user) {
        throw new Error("User not found.")
    }

    // wrapping user in req for the next request handler
    req.user = user
    next()

    }catch(err) {
        res.status(401).send(err.message);
    }
}

module.exports = {
    userAuth
}