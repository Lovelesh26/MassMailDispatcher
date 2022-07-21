const express=require("express");
const router=express.Router();
const uploadAndViewController=require(__dirname+"/uploadAndViewController.js");
const nodemailer = require("nodemailer");
const bodyParser=require("body-parser");
var fs = require('fs');
var formidable = require('formidable');
const multer  = require('multer');
const mongoose=require("mongoose");
const upload = multer({ dest: '/../uploads/' });
const User = require(__dirname+"/../models/userSchema.js"); 
const notifier=require('node-notifier');

router.get("/",function(req,res){
    res.render("home",{isLoggedIn:false,userid:''});
});

router.get("/:userid",function(req,res){
    const id=req.params.userid;
    res.render("home",{isLoggedIn:true,userid:id});
});

router.get("/:userid/logout",function(req,res){
    res.redirect("/");
});

router.get("/:userid/mail",function(req,res){
    const id=req.params.userid;
    res.render("mail",{userid:id});
});

router.post("/:userid/mail",upload.array('attachments'),function(req,res){
    const userid=req.params.userid;
    const sub=req.body.subject;
    const content=req.body.content;
    const attachmentsInfo=req.files.map((file)=>{return {path:file.path,filename:file.originalname}});

    User.findOne({id:userid},function(err,foundUser)
    {
        if(!err)
        {
            const emails=foundUser.rectifiedEmails.map((mail)=>{
                return mail.email;
            });
            console.log(emails);
            let transporter = nodemailer.createTransport({
                pool:true,
                service: 'gmail',
                auth: {
                  type: 'OAuth2',
                  user: process.env.USER_NAME,
                  pass: process.env.USER_PASSWORD,
                  clientId: process.env.CLIENT_ID,
                  clientSecret: process.env.CLIENT_SECRET,
                  refreshToken: process.env.REFRESH_TOKEN,
        
                }
              });
        
              let mailOptions={
                  from:"testmaildispatcher@gmail.com",
                  to:emails,
                  subject:sub,
                  text:content,
                  attachments:attachmentsInfo
              };
        
              transporter.sendMail(mailOptions,function(err,data){
                  if(!err)
                  {
                    notifier.notify("Mail Sent Successfully");
                  }
                  else
                  {
                      console.log(err);
                  }
              });
        }
    });

    res.redirect(`/${userid}`);
});

router.use("/",uploadAndViewController);

module.exports=router;