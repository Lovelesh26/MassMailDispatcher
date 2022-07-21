const express=require("express");
const router=express.Router();
var formidable = require('formidable');
const mongoose=require("mongoose");
var fs = require('fs');
const csv=require('csvtojson');
const notifier=require('node-notifier');

const User = require(__dirname+"/../models/userSchema.js"); 

router.get("/:userid/upload",function(req,res){
    const id=req.params.userid;
    res.render("upload",{userid:id});
});

router.get("/:userid/view",function(req,res){
    const userid=req.params.userid;
    User.findOne({id:userid},function(err,foundUser){
        if(!err)
        {  
            res.render("view",{emails:foundUser.rectifiedEmails,invalid:foundUser.invalidEmails,uid:userid});
        }
        else
            console.log(err);
    });
});


router.post("/:userid/upload",function(req,res){
    const userid=req.params.userid;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.emails.filepath;
      var newpath = 'C:/Users/HP/Desktop/MassMailDispatcher/uploads/' + files.emails.originalFilename;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        //reading the uploaded content
        // /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const csvFilePath=__dirname+"/../uploads/"+files.emails.originalFilename;
        csv({noheader:true,headers:["email"]}).fromFile(csvFilePath).then((jsonObject)=>{
            const re = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/g;
            const rectifiedmails=jsonObject.filter((obj)=>{return obj.email.match(re)!==null});
            const invalidmails=jsonObject.filter((obj)=>{return obj.email.match(re)===null});

            User.findOneAndUpdate({id:userid},{rectifiedEmails:rectifiedmails,invalidEmails:invalidmails},function(err){
                if(!err)
                {
                    console.log("Successfully Updated");
                }
            });

            //deletion of the file from the server
            try{
            fs.unlinkSync(csvFilePath);
            }
            catch(err)
            {
                console.log(err);
            }

        });

        notifier.notify("File Uploaded Successfully");
        res.redirect(`/${userid}`);
      });
    });
});

module.exports=router;