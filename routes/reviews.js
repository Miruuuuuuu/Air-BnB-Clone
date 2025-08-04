const express=require("express");
const app = express();
const router= express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const MyError= require("../utils/ExpressError.js");
const listing= require('../models/Listing.js');
const Review= require('../models/Reviews.js');
const {joi_schema,reviewSchema}= require('../schema.js');




// validate review
const validateReview=((req,res,next)=>{
    console.log(req.body.Review)
let {error}=reviewSchema.validate({"Review" : req.body.Review});
if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new MyError(404,errMsg);
}
else{
    next();
}
});


/// review post

router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    // console.log( "THE REQUEST BODY IS : " + req.body.Review.rating  + req.body.Review.comment )
    let newreview= await new Review(req.body.Review);
          let list = await listing.findById(id);
          await newreview.save();
          list.reviews.push(newreview);
         
         await list.save();
         
         res.redirect(`/listing/${id}`);
}));

// review delete

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
       const {id,reviewId}=req.params;
       await listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
       await Review.findByIdAndDelete(reviewId);
       

       res.redirect(`/listing/${id}`);
}));

module.exports= router;