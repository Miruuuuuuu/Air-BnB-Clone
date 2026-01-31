const express= require("express")
const app= express();
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const MyError= require("../utils/ExpressError.js");
const {isloggedIn}= require("../middleware.js");



// Home Page
router.get("/",wrapAsync(async(req,res)=>{
    res.render("about/index")
}))

module.exports=router;