const express= require("express");
const app = express();
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const MyError= require("../utils/ExpressError.js");

const User= require("../models/User.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup");
})
router.post("/signup",wrapAsync(async(req,res,next)=>{
    try{
const {username,email,password}=req.body;
    const user=new User({username,email});
    const registeredUser=await User.register(user,password);
    console.log(registeredUser);
    req.login(registeredUser,err=>{
        if(err) return next(err);
    req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listing");
    })
   
    }catch(err)
    {
        req.flash("error",err.message);
        res.redirect("/signup");
    }
  
}));
router.get("/login",(req,res)=>{
    res.render("users/login");
})
router.post('/login',saveRedirectUrl, 
  passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
  function(req, res) {
    req.flash("success","Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
  });

router.get("/logout",(req,res,next)=>{
    req.logout(err=>{
  if (err){return next(err);}
        req.flash("success","Logged out successfully!");
        res.redirect("/listing");
    })
   
})

module.exports= router;