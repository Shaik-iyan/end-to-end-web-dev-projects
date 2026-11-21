const mongoose =require("mongoose");
const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDb connected successfully");
    }catch(error){
        console.log("MongoDb connection faild",error.message);
        process.exit(1);
    }
};
module.exports=connectDb;