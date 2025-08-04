const mongoose= require('mongoose');
const Schema= mongoose.Schema;
const passportLocalMongoose= require('passport-local-mongoose');

const UserSchema=new Schema({
    email:{
        type:string,
        required:true,
    }
});

const User= mongoose.model("User",UserSchema);

User.plugin(passportLocalMongoose);



module.exports= User;