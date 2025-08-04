const express = require('express');
const app = express();
const mongoose= require('mongoose');
const path=require('path');
const wrapAsync=require("./utils/wrapAsync.js");
const MyError= require("./utils/ExpressError.js");
methodOverride = require('method-override');
const {joi_schema,reviewSchema}=require('./schema.js');
app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
const listing= require('./models/Listing');
app.use(express.urlencoded({extended:true}));
///   ejs mate
const ejsmate=require('ejs-mate');
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname, 'public')));
const Review= require('./models/Reviews.js');
const { log } = require('console');
//const listing_schema=require("listing_schema");
const init_data=require('./init/data');
const listingRoute=require("./routes/listings");
const reviewRoute=  require("./routes/reviews.js");
main().then(
    (res)=>{
        console.log("Db conneected");
    }
).catch(
    (err)=>{
        console.log("Db error");
    }
)

async function main()
{
     mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.listen("8090",()=>{
   
    console.log("server is listening on localhost//:8090");
})
app.get("/",(req,res)=>{
    res.send("Welcome to Home Page");
})

// test listing

app.get("/testlisting", wrapAsync(async(req,res)=>{
    let list= await listing.insertMany(
        {
            title:"Listingg 1",
            description:"This is the description of listing 1",
            price:100,
            location: "Lahore",
            country:"Pakistan"
        }
    )
    console.log(list);
    
    // let list = listing.insertMany(init_data.data).catch((err)=>{res.send(err)});

    // res.send("test succesful");
})
)

//listing router
app.use("/listing",listingRoute);

app.use("/listing/:id/review",reviewRoute);



app.all("*",(req,res,next)=>{
   next(new MyError(404,"Page Not Found!"));
})

// error handling
app.use((err,req,res,next)=>{
    let {status,message}=err;
   
   res.send(message);
  // res.send("Some error in database");
})




