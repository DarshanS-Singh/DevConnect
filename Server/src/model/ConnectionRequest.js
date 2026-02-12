const mongoose = require('mongoose')


const ConnectionRequestSchema = mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",          // reference to the user collection
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored" , "interested", "accepted", "rejected"],
            message : `{VALUE} is incorrect status type`
        }
    },    
},
{
    timestamps  : true
})

ConnectionRequestSchema.pre("save", function (next) {
    const ConnectionRequest = this;

    if (ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)) {
        throw new Error("Request Not Possible [Same IDs].")
    }
    next();
})

ConnectionRequestSchema.index({fromUserId : 1, toUserId : 1})

const ConnectionRequest =  mongoose.model("ConnectionRequest", ConnectionRequestSchema)

module.exports = ConnectionRequest
