const { default: mongoose } = require("mongoose");
const mongooose = require("mongoose");
const { stringify } = require("querystring");

const userSchema = new mongoose.Schema({
    id:{type:String , required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    rectifiedEmails:{type:Array},
    invalidEmails:{type:Array}
});

const User = mongoose.model("User",userSchema);

module.exports=User;