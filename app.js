const express = require('express');
const app = express();
const mongoose= require('mongoose');
const path=require('path');
const wrapAsync=require("./utils/wrapAsync.js");
const MyError= require("./utils/ExpressError.js");
const methodOverride = require('method-override');
const {joi_schema,reviewSchema}=require('./schema.js');
const session = require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/User.js");
const Review= require('./models/Reviews.js');
const { log } = require('console');
//const listing_schema=require("listing_schema");
const init_data=require('./init/data');
const listingRoute=require("./routes/listings");
const reviewRoute=  require("./routes/reviews.js");
const userRoute=  require("./routes/users.js");
const aboutRoute= require("./routes/about.js");
const { date } = require('joi');

app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
const listing= require('./models/Listing');
app.use(express.urlencoded({extended:true}));
///   ejs mate
const ejsmate=require('ejs-mate');
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname, 'public')));


async function main()
{
     mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


main().then(
    (res)=>{
        console.log("Db conneected");
    }
).catch(
    (err)=>{
        console.log("Db error");
    }
)




// server Port
app.listen("8090",()=>{
   
    console.log("server is listening on localhost:8090");
})




app.get("/",(req,res)=>{
    res.send("Welcome to Home Page");
})

// express sessions

const sessionOptions= {
    secret:"MySuperSecret",
    saveUninitialized:true,
     resave:false,
     cookies:{
        expires:Date.now()+ 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
     }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currentUser=req.user;
    next();
})

app.get("/testUser",async(req,res)=>{
    const fakeUser= new User({
        email:"abcd@gmail.com",
        username:"fakeUser2"
    });
   const registeredUser= await User.register(fakeUser,"password");
     res.send(`A Dummy User has been created :\n ${registeredUser}`);
})


// test listing

app.get("/testlisting", wrapAsync(async(req,res)=>{
    let list= await listing.insertMany(
        {
            title:"Listingg 2",
            description:"This is the description of listing 1",
            price:100,
            location: "Lahore",
            country:"Pakistan"
        }
    )
    console.log(list);
    
    // let list = listing.insertMany(init_data.data).catch((err)=>{res.send(err)});

    res.send(`test succesful /n${list}`);
})
)

app.use("/about",aboutRoute)

//listing router
app.use("/listing",listingRoute);

app.use("/listing/:id/review",reviewRoute);

app.use("/",userRoute);

app.all("*",(req,res,next)=>{
   next(new MyError(404,"Page Not Found!"));
})

// error handling
app.use((err,req,res,next)=>{
    let {status,message}=err;
   
   res.send(message);
  // res.send("Some error in database");
})




