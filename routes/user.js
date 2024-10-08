const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js')
const passport=require("passport")
const {saveRedirectUrl} = require("../middleware.js");


router.get("/signup",(req, res)=>{
    res.render("./users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username ,email , password}=req.body;
        let newUser = new User({
            username,
            email
        });
        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success" , "welcome to Wardrobe Manager");
            res.redirect("/");
        })
    }
    catch(e)
    {
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req, res)=>{
    res.render("./users/login.ejs"); 
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",
    {
    failureRedirect:"/login", 
    failureFlash:true,
    }),async(req,res)=>{
        req.flash("success","Welcome back to Wardrope Manager!");
        let redirectUrl = res.locals.redirectUrl || "/";
        res.redirect(redirectUrl);
})



router.get("/logout", (req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/");

    });
});



module.exports = router; 