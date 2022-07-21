const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const uniqid=require("uniqid");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const notifier=require('node-notifier');

const User = require(__dirname+"/../models/userSchema.js"); 

router.get("/",function(req,res){
    res.render("register");
});

router.post("/",function(req,res){
    const mail=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;

    //using bcrypt
    if(confirmPassword===password)
    {    
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(!err)
                {
                    const currId=uniqid();
                    const currUser= new User({
                        id:currId,
                        email:mail,
                        password:hash
                    });

                     currUser.save(function(err,result){
                        if(err)
                        console.log(err);
                    });
                    res.redirect(`/${currId}`);
                }
                else
                {
                    console.log(err);
                }
            });
        });
    }
    else
    {
        // Sending an alert kind-of-thing for acknowledgement
        notifier.notify({
            title:"Register status",
            message:"Password and Confirm Password doesn't match",
            wait:true,
            timeout:15,
            actions:["Try again"]
        },
        function(err,response,metadata){
            res.redirect("/register");
        }
        );
    }
});

module.exports=router;