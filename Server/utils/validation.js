// using validator library (also file name just in case i have written validator.js (it can be anything else), nothing related to validator library)
const validator = require('validator')

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;                        // signUp will have (for now) : firstName, lastName, emailId, password, (these are neccessary to be validated rest can be done or ignored for now) .....
    if (!firstName || !lastName) {
        throw new Error("Error filling name details")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email Filled")
    }
    else if (!password) {
        throw new Error("Password is required")
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Please Enter a strong password")
    }
}

const validateEditData = (req) => {

    const allowedEditData = ["firstName","lastName","about","photoUrl","skills","age","gender"]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditData.includes(field))

    return isEditAllowed
    
}

module.exports = {validateSignUpData,validateEditData}