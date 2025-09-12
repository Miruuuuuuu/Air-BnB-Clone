const express= require("express");
const app = express();
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const MyError= require("../utils/ExpressError.js");
const listing= require('../models/Listing');
const {isloggedIn}= require("../middleware.js");
//const listing_schema=require("listing_schema");

router.get("/", wrapAsync(async(req,res)=>{
let alllisting= await listing.find();
//console.log(alllisting);

res.render("./listings/index",{alllisting});
//console.log(alllisting.image.url);
// alllisting.forEach(item => {
//     console.log(item.image.url); // Access the URL here
// });
}))


// new listing

router.get("/new",isloggedIn,(req,res)=>{
    res.render("./listings/new");
})

// new listing in db
router.post("/new", wrapAsync(async(req,res,next)=>{
let newlisting=req.body;
   // let image_url=req.body.Image;
   let{ Title,Description,Price,Image,Location,Country}=req.body;
    if(!Title){   throw new MyError(404,"Title is not valid")}
    if(!Description){   throw new MyError(404,"Description is not valid")}
    if(!Country)  {   throw new MyError(404,"Country is not valid")}  
    if(!Image){   throw new MyError(404,"Image is not valid")}
    if(!Location){   throw new MyError(404,"Location is not valid")}
    if(!Price){   throw new MyError(404,"Price is not valid")}
    let list= await listing.insertMany({
        title:Title,
        description: Description,
        image:{
            url:Image
        },
        price:Price,
        location:Location,
        country:Country
    });
    req.flash("success", "New Listing Added!");
    res.redirect("/listing");
})
)

// prouct route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    //res.send(id);
  let list = await listing.findById(id).populate("reviews");
  if(!list)
  {
    req.flash("error","Requested listing is not available");
    res.redirect("/listing");
  }
  //console.log(list.image);
  //res.send(list);
  console.log(list.reviews);
  res.render("./listings/list",{list});

}));


router.get("/:id/edit",isloggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let list=await listing.findById(id);
    if(!list) {
        req.flash("error","Listing not found");
        return res.redirect("/listing");
    }
    res.render("./listings/edit",{list});
}));

router.put("/:id",isloggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let{ Title,Description,Price,Location,Country}=req.body;
    let list= await listing.findByIdAndUpdate(id,{
        title:Title,
        description: Description,
        price:Price,
        location:Location,
        country:Country
    },{
        new:true
    });
    console.log("This is updated list");
    console.log(list.description);
    
    res.redirect("/listing");
    

}));



/// delete route

router.delete("/:id",isloggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params; 
   let list = await listing.findByIdAndDelete(id);
//    console.log('after delete',list);
//     let res2=await Review.deleteMany({_id:{$in:list.reviews}});
//         console.log('Deleted reviews of this post ',res2);
   
   console.log(`ID of deleting post is:${id}`);
   res.redirect("/listing");
}));


module.exports=router;