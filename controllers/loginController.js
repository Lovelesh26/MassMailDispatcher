const express=require("express");
const bcrypt = require('bcrypt');
const mongoose=require("mongoose");
const User = require(__dirname+"/../models/userSchema.js"); 
const router=express.Router();
const notifier=require('node-notifier');


router.get("/",function(req,res){
    res.render("login");
});

router.post("/",function(req,res){
    const mail=req.body.email;
    const password=req.body.password;

    User.findOne({email:mail},function(err,foundUser){
        if(!err)
        {
            if(!foundUser)
            {    
                notifier.notify({
                    title:"Login status",
                    message:"The entered email does not exits!",
                    wait:true,
                    timeout:15,
                    actions:["Try again","Register"]
                },
                function(err,response,metadata){
                    console.log(response);
                    if(response==="register")
                    {
                        res.redirect("/register");
                    }
                    else
                    {
                        res.redirect("/login");
                    }
                }
                );
            }
            else{
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(!err)
                {
                    if(result===true)
                    {
                        res.redirect(`/${foundUser.id}`);
                    }
                    else
                    {
                        notifier.notify({
                            title:"Login status",
                            message:"Password Incorrect!",
                            wait:true,
                            timeout:15,
                            actions:["Try again"]
                        },
                        function(err,response,metadata){
                            console.log(response);
                            res.redirect("/login");
                        }
                        );
                    }
                }
                else
                {
                    console.log(err);
                }
            });
            }
        }
        else
        {
            console.log(err);
        }
    });
});

module.exports=router;