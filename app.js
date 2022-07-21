const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
require('dotenv').config()

//Controllers
const homeController=require(__dirname+"/controllers/homeController.js");
const loginController=require(__dirname+"/controllers/loginController.js");
const registerController=require(__dirname+"/controllers/registerController.js");

//Database Connections
mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Initializations
const app=express();
app.set("view engine", "ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Acquiring Model
const User = require(__dirname+"/models/userSchema.js"); 

//Setting Controllers
app.use("/login",loginController);
app.use("/register",registerController);
// app.get("/:userid/mail",function(req,res){
//     res.send("Mailing everyone");
// });
app.use("/",homeController);

//Testing
app.listen(3000,()=>{
    console.log("Server Listening On Post 3000");
});