const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3
    } ,
    lastName : {
        type : String,
    },
    emailId :{
        type : String,
        unique: true,
        required : true,
        trim : true,              // saves id after trimming
        lowercase : true,          //saves emailId in lowercase
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        },
    },
    photoUrl : {
        type : String,
        default : "https://tinyurl.com/3xdsrn2z",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo Url")
            }
        }
    },
    password : {
        type : String
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type : String,
        // making custom validate function
        validate (value) {
            if (!["male","female","others"].includes(value.toLowerCase())){
                throw new Error ("Gender Data is not valid")
            }
        }
    },
    about : {
        type : String,
        default : "This is about section of user."
    },
    skills :  {
        type : [String]
    }
}, {
    timestamps : true            // at first time creation of document both createdAt and  updatedAt will be same, but if that doc. is updated later the updatedAt will change(or update)
})

// off-loading the jwt creating token process 
// Schema method : can create flow or function which uses somewhat user schema or works each time for this schema (example : at time of login process 
// jwt is created in which we store or take user id which is related to user schema so can take that function and attach to this schema )

userSchema.methods.getJWT = async function () {

    const user = this             // {we know all document are instances of this user Model , so when i do this it will represent that particular instance so example if token made for Raj then user._id (or document) : will be of Raj}

    const token = await jwt.sign({_id : user._id}, "DEV@Tinder$030", {expiresIn : "6hr"})

    return token;

} 

userSchema.methods.verifyPassword = async function ( passwordInputedFromUser ) {
    
    const passwordHashed = this.password
    // OR
    // const user = this;
    // const passwordHashed = user.password

    const isPassword = await bcrypt.compare(passwordInputedFromUser, passwordHashed)

    return isPassword;
}

const User = mongoose.model("User", userSchema)

module.exports = User