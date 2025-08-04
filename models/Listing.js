const mongoose= require('mongoose');
const Review = require('./Reviews');
const Schema= mongoose.Schema;

const listing_schema=Schema(
    {
        title:
        {
            type:String,
            required:true
        },
        description:{
            type:String,
        
        },
       
        image: {
            type: {
                filename: { type: String },
                url: { type: String, required: true }
            },
            default: {
                filename: "default_image.jpg",
                url: "https://th.bing.com/th/id/R.6930d854ae066d2c74d3ed8d087ca07d?rik=g649XDiwyWuzTw&pid=ImgRaw&r=0"
            }
        },

        reviews:[
            {
                type:Schema.Types.ObjectId,
                ref:"Review",
            }
        ],

          
        price:{
            type:Number,
            
        },
        location:{
            type:String
        },
        country:{
            type:String
        }
    },{strict:false}
)

const listing= mongoose.model("listing",listing_schema);

module.exports=listing;


listing_schema.post("findOneAndDelete", async (data)=>{
    if(data.reviews)
    {
        let res=  await Review.deleteMany({_id:{$in:datareviews}});
        console.log('Deleted reviews of this post ',res);
    }
})